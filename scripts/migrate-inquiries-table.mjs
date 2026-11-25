// 创建 inquiries 表。默认 dry-run，确认后加 --apply。
// 运行: node scripts/migrate-inquiries-table.mjs --apply

import { createClient } from "@libsql/client";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const db = createClient({ url: process.env.DATABASE_URL || `file:${resolve(root, "data/teao-cn.db")}` });
const apply = process.argv.includes("--apply");

const DDL = `CREATE TABLE IF NOT EXISTS \`inquiries\` (
  \`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  \`name\` text NOT NULL,
  \`company\` text,
  \`phone\` text NOT NULL,
  \`email\` text,
  \`product_interest\` text,
  \`annual_volume\` text,
  \`message\` text NOT NULL,
  \`ip\` text,
  \`status\` text DEFAULT 'new' NOT NULL,
  \`submitted_at\` text NOT NULL,
  \`created_at\` integer,
  \`updated_at\` integer
)`;

const INDEXES = [
  "CREATE INDEX IF NOT EXISTS `inquiries_status_idx` ON `inquiries` (`status`)",
  "CREATE INDEX IF NOT EXISTS `inquiries_submitted_at_idx` ON `inquiries` (`submitted_at`)",
];

console.log("迁移计划: 创建 inquiries 表 + 2 个索引（IF NOT EXISTS，不删数据）");
if (!apply) {
  console.log("dry-run: 未执行。确认后加 --apply。");
  process.exit(0);
}

await db.execute(DDL);
for (const sql of INDEXES) await db.execute(sql);
const count = await db.execute("select count(*) as n from inquiries");
console.log(`完成: inquiries 表可用，当前 ${Number(count.rows[0].n)} 条`);
db.close();
