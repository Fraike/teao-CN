#!/usr/bin/env node
/**
 * 生产备份：SQLite 数据库 + uploads。
 *
 * 用法（服务器）：
 *   cd /opt/teao-cn
 *   node --env-file=.env.local scripts/backup-production.mjs
 *
 * 可选环境变量：
 *   BACKUP_DIR=/opt/teao-cn/backups
 *
 * 设计原则：
 * - 不删除任何历史备份，由运维按保留策略手动清理
 * - 备份目录包含询盘个人信息，权限应为 700
 */
import { existsSync } from "node:fs";
import { copyFile, mkdir, stat } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import { createClient } from "@libsql/client";

const root = process.cwd();
const databaseUrl = process.env.DATABASE_URL || "file:data/teao-cn.db";
const backupRoot = path.resolve(
  process.env.BACKUP_DIR || path.join(root, "backups"),
);

function localDbPath(url) {
  if (!url.startsWith("file:")) {
    throw new Error(
      `backup-production 只支持本地 file: 数据库，当前 DATABASE_URL=${url}`,
    );
  }
  return path.resolve(root, url.slice("file:".length));
}

function stamp() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return [
    `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`,
    `${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`,
  ].join("_");
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit" });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with code ${code}`));
    });
  });
}

async function fileSize(file) {
  const info = await stat(file);
  return `${(info.size / 1024 / 1024).toFixed(2)} MB`;
}

async function main() {
  const dbPath = localDbPath(databaseUrl);
  if (!existsSync(dbPath)) {
    throw new Error(`数据库不存在：${dbPath}`);
  }

  const dir = path.join(backupRoot, stamp());
  await mkdir(dir, { recursive: true, mode: 0o700 });

  const dbBackup = path.join(dir, "teao-cn.db");
  const client = createClient({ url: databaseUrl });
  let vacuumed = false;

  try {
    try {
      // VACUUM INTO 生成一致性快照，避免直接拷贝 WAL 中的半写状态
      const escaped = dbBackup.replace(/'/g, "''");
      await client.execute(`VACUUM INTO '${escaped}'`);
      vacuumed = true;
    } catch (error) {
      console.warn(
        `[backup] VACUUM INTO 失败，回退到 checkpoint + copy：${error.message}`,
      );
      await client.execute("PRAGMA wal_checkpoint(TRUNCATE)");
      await client.close();
      await copyFile(dbPath, dbBackup);
    }
  } finally {
    if (vacuumed) {
      await client.close();
    } else {
      // 回退分支已经 close；这里再兜底一次，忽略重复 close 错误
      await client.close().catch(() => {});
    }
  }

  console.log(`[backup] 数据库：${dbBackup} (${await fileSize(dbBackup)})`);

  const uploads = path.join(root, "public", "uploads");
  if (existsSync(uploads)) {
    const uploadsBackup = path.join(dir, "uploads.tar.gz");
    await run("tar", [
      "-czf",
      uploadsBackup,
      "-C",
      path.join(root, "public"),
      "uploads",
    ]);
    console.log(
      `[backup] uploads：${uploadsBackup} (${await fileSize(uploadsBackup)})`,
    );
  } else {
    console.log("[backup] public/uploads 不存在，跳过");
  }

  console.log(`[backup] 完成：${dir}`);
}

main().catch((error) => {
  console.error(`[backup] 失败：${error.stack || error.message}`);
  process.exitCode = 1;
});
