// 初始化后台管理员,并把 41 篇新闻导入数据库(表为空时才导入)。
// 运行: node scripts/seed-admin-news.mjs

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";

const root = resolve(import.meta.dirname, "..");
const db = createClient({ url: process.env.DATABASE_URL || `file:${resolve(root, "data/teao-cn.db")}` });
const generated = JSON.parse(readFileSync(resolve(root, "src/content/live-site/news.generated.json"), "utf8"));

const escape = text => String(text)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function blocksToHtml(blocks) {
  return blocks.map(block => {
    if (block.type === "h2") return `<h2>${escape(block.text)}</h2>`;
    if (block.type === "h3") return `<h3>${escape(block.text)}</h3>`;
    if (block.type === "img") return `<img src="${escape(block.src)}" alt="${escape(block.alt ?? "")}" />`;
    if (block.type === "ul") return `<ul>${block.items.map(item => `<li>${escape(item)}</li>`).join("")}</ul>`;
    if (block.type === "quote") return `<blockquote>${escape(block.text)}</blockquote>`;
    return `<p>${escape(block.text)}</p>`;
  }).join("\n");
}

const username = process.env.ADMIN_USERNAME || "admin";
const password = process.env.ADMIN_PASSWORD || "teao2026";

const existingAdmin = await db.execute({ sql: "select id from admins where username = ?", args: [username] });
if (existingAdmin.rows.length === 0) {
  const hash = await bcrypt.hash(password, 10);
  await db.execute({
    sql: "insert into admins (username, password_hash, created_at) values (?, ?, ?)",
    args: [username, hash, Math.floor(Date.now() / 1000)],
  });
  console.log(`admin created: ${username} / ${password}`);
} else {
  console.log(`admin exists: ${username}`);
}

const count = await db.execute("select count(*) as n from news");
if (Number(count.rows[0].n) > 0) {
  console.log(`news already has ${count.rows[0].n} rows, skip import`);
} else {
  let imported = 0;
  for (const article of generated) {
    await db.execute({
      sql: `insert into news
        (slug, locale, translation_key, title, summary, content, cover, category, category_label,
         is_published, published_at, created_at, updated_at)
        values (?, 'zh', ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)`,
      args: [
        article.slug,
        article.slug,
        article.title,
        article.summary,
        blocksToHtml(article.blocks),
        article.cover,
        article.category,
        article.categoryLabel,
        article.publishedAt,
        Math.floor(Date.now() / 1000),
        Math.floor(Date.now() / 1000),
      ],
    });
    imported += 1;
  }
  console.log(`news imported: ${imported}`);
}

db.close();
