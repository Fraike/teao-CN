#!/usr/bin/env node
/**
 * 生产健康检查：首页/关键页面 + HTTPS 证书有效期。
 *
 * 用法（服务器）：
 *   cd /opt/teao-cn
 *   node --env-file=.env.local scripts/health-check.mjs
 *
 * 告警 webhook：
 *   ALERT_WEBHOOK_URL（可选，优先）
 *   CONTACT_WEBHOOK_URL（回退，复用企业微信询盘群）
 *
 * 连续失败每 30 分钟最多告警一次；恢复时发一次恢复通知。
 */
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import tls from "node:tls";

const root = process.cwd();
const stateFile = path.join(root, ".data", "health-state.json");
const webhook =
  process.env.ALERT_WEBHOOK_URL || process.env.CONTACT_WEBHOOK_URL || "";
const cooldownMs = 30 * 60 * 1000;
const timeoutMs = 10_000;
const certWarnDays = 14;

const targets = [
  "https://www.chinateao.com/",
  "https://www.chinateao.com/products/",
  "https://www.chinateao.com/privacy/",
  "https://www.chinateao.com/terms/",
  "https://www.chinateao.com/admin/login",
];

function certDays(host) {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(
      { host, port: 443, servername: host, rejectUnauthorized: true },
      () => {
        const cert = socket.getPeerCertificate();
        socket.end();
        if (!cert?.valid_to) {
          reject(new Error("证书没有 valid_to"));
          return;
        }
        resolve((new Date(cert.valid_to).getTime() - Date.now()) / 86_400_000);
      },
    );
    socket.setTimeout(timeoutMs, () => {
      socket.destroy();
      reject(new Error("证书检查超时"));
    });
    socket.on("error", reject);
  });
}

async function sendAlert(text) {
  if (!webhook) {
    console.error("[health] 未配置 ALERT_WEBHOOK_URL / CONTACT_WEBHOOK_URL，跳过告警");
    return;
  }
  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ msgtype: "text", text: { content: text } }),
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) {
      console.error(`[health] 告警发送失败：HTTP ${res.status}`);
    }
  } catch (error) {
    console.error(`[health] 告警发送失败：${error.message}`);
  }
}

async function loadState() {
  if (!existsSync(stateFile)) {
    return { down: false, lastAlertAt: 0 };
  }
  try {
    return JSON.parse(await readFile(stateFile, "utf8"));
  } catch {
    return { down: false, lastAlertAt: 0 };
  }
}

async function saveState(state) {
  await mkdir(path.dirname(stateFile), { recursive: true });
  await writeFile(stateFile, JSON.stringify(state, null, 2));
}

async function checkUrl(url) {
  const started = Date.now();
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: { "user-agent": "teao-health-check/1.0" },
      signal: AbortSignal.timeout(timeoutMs),
    });
    const ms = Date.now() - started;
    if (res.status !== 200) {
      return `${url} -> HTTP ${res.status} (${ms}ms)`;
    }
    console.log(`[ok] ${url} ${res.status} ${ms}ms`);
    return null;
  } catch (error) {
    return `${url} -> ${error.message}`;
  }
}

async function main() {
  const failures = [];

  for (const url of targets) {
    const failure = await checkUrl(url);
    if (failure) failures.push(failure);
  }

  try {
    const days = await certDays("www.chinateao.com");
    if (days < certWarnDays) {
      failures.push(
        `HTTPS 证书剩余 ${days.toFixed(1)} 天（< ${certWarnDays} 天）`,
      );
    } else {
      console.log(`[ok] HTTPS 证书剩余 ${days.toFixed(1)} 天`);
    }
  } catch (error) {
    failures.push(`HTTPS 证书检查失败：${error.message}`);
  }

  const state = await loadState();
  const now = Date.now();

  if (failures.length > 0) {
    const canAlert =
      !state.down || now - Number(state.lastAlertAt || 0) > cooldownMs;
    if (canAlert) {
      await sendAlert(
        [
          "【TEAO 监控告警】站点异常",
          ...failures,
          `时间：${new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}`,
        ].join("\n"),
      );
      state.lastAlertAt = now;
    }
    state.down = true;
    state.failures = failures;
    await saveState(state);
    for (const failure of failures) {
      console.error(`[fail] ${failure}`);
    }
    console.error(`[health] ${failures.length} 项异常`);
    process.exitCode = 1;
    return;
  }

  if (state.down) {
    await sendAlert(
      [
        "【TEAO 监控恢复】站点已恢复正常",
        `时间：${new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}`,
      ].join("\n"),
    );
  }
  await saveState({ down: false, lastAlertAt: 0, failures: [] });
  console.log("[health] 全部正常");
}

main().catch((error) => {
  console.error(`[health] 执行失败：${error.stack || error.message}`);
  process.exitCode = 1;
});
