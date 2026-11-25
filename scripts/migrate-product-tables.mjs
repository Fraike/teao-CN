// 一次性迁移：重建 products / categories 两张表以加入 path、pageSize 等字段。
// news / admins 不动。默认只预览；确认后加 --force 执行。
// 运行: node scripts/migrate-product-tables.mjs --force

import { createClient } from "@libsql/client";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const db = createClient({ url: process.env.DATABASE_URL || `file:${resolve(root, "data/teao-cn.db")}` });
const apply = process.argv.includes("--force");

const CATEGORIES_DDL = `CREATE TABLE \`categories\` (
  \`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  \`slug\` text NOT NULL,
  \`path\` text NOT NULL,
  \`name\` text NOT NULL,
  \`description\` text NOT NULL,
  \`image\` text NOT NULL,
  \`page_size\` integer DEFAULT 12 NOT NULL,
  \`sort_order\` integer DEFAULT 0 NOT NULL,
  \`created_at\` integer,
  \`updated_at\` integer
)`;

const PRODUCTS_DDL = `CREATE TABLE \`products\` (
  \`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  \`slug\` text NOT NULL,
  \`path\` text NOT NULL,
  \`model\` text NOT NULL,
  \`name\` text NOT NULL,
  \`listing_title\` text DEFAULT '' NOT NULL,
  \`category\` text NOT NULL,
  \`summary\` text NOT NULL,
  \`description\` text NOT NULL,
  \`features\` text DEFAULT '[]' NOT NULL,
  \`image\` text NOT NULL,
  \`images\` text DEFAULT '[]' NOT NULL,
  \`specifications\` text DEFAULT '[]' NOT NULL,
  \`torque\` text,
  \`force\` text,
  \`hard_torque\` text,
  \`hard_force\` text,
  \`sound_type\` text,
  \`durability\` text,
  \`materials\` text DEFAULT '[]',
  \`characteristics\` text DEFAULT '[]',
  \`dimension_drawing\` text,
  \`performance_charts\` text,
  \`variants\` text,
  \`buffer_direction\` text,
  \`assembly_method\` text,
  \`applications\` text DEFAULT '[]' NOT NULL,
  \`application_scenarios\` text DEFAULT '[]',
  \`seo_title\` text,
  \`seo_description\` text,
  \`tags\` text DEFAULT '[]',
  \`status\` text DEFAULT 'active',
  \`is_active\` integer DEFAULT 1 NOT NULL,
  \`sort_order\` integer DEFAULT 0 NOT NULL,
  \`created_at\` integer,
  \`updated_at\` integer,
  FOREIGN KEY (\`category\`) REFERENCES \`categories\`(\`slug\`) ON UPDATE no action ON DELETE no action
)`;

const INDEXES = [
  "CREATE UNIQUE INDEX `categories_slug_unique` ON `categories` (`slug`)",
  "CREATE UNIQUE INDEX `categories_path_unique` ON `categories` (`path`)",
  "CREATE INDEX `categories_sort_order_idx` ON `categories` (`sort_order`)",
  "CREATE UNIQUE INDEX `products_slug_unique` ON `products` (`slug`)",
  "CREATE UNIQUE INDEX `products_path_unique` ON `products` (`path`)",
  "CREATE INDEX `products_category_idx` ON `products` (`category`)",
  "CREATE INDEX `products_active_idx` ON `products` (`is_active`)",
  "CREATE INDEX `products_sort_order_idx` ON `products` (`sort_order`)",
  "CREATE INDEX `products_updated_at_idx` ON `products` (`updated_at`)",
];

const count = async table => Number((await db.execute(`select count(*) as n from ${table}`)).rows[0].n);
const before = { news: await count("news"), admins: await count("admins") };
const existing = {
  categories: await count("categories").catch(() => "missing"),
  products: await count("products").catch(() => "missing"),
};

console.log("迁移计划:");
console.log("- 备份:", `${root}/data/teao-cn.db.bak`);
console.log("- 现有:", existing, "news/admins:", before);
console.log("- 动作: DROP products -> DROP categories -> CREATE 两张新表 -> CREATE 9 个索引");
console.log("- 不动: news, admins");

if (!apply) {
  console.log("\ndry-run: 未执行。确认后加 --force。");
  process.exit(0);
}

await db.execute("PRAGMA foreign_keys=OFF");
await db.execute("DROP TABLE IF EXISTS `products`");
await db.execute("DROP TABLE IF EXISTS `categories`");
await db.execute(CATEGORIES_DDL);
await db.execute(PRODUCTS_DDL);
for (const sql of INDEXES) await db.execute(sql);
await db.execute("PRAGMA foreign_keys=ON");

const after = { news: await count("news"), admins: await count("admins") };
if (after.news !== before.news || after.admins !== before.admins) {
  console.error("news/admins 行数发生变化，迁移中止", { before, after });
  process.exit(1);
}

console.log("迁移完成: products/categories 已重建，news/admins 保持", after);
