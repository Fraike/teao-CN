import { sqliteTable, integer, text, index } from "drizzle-orm/sqlite-core";

export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  path: text("path").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  pageSize: integer("page_size").notNull().default(12),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
}, table => [
  index("categories_sort_order_idx").on(table.sortOrder),
]);

export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  path: text("path").notNull().unique(),
  model: text("model").notNull(),
  name: text("name").notNull(),
  listingTitle: text("listing_title").notNull().default(""),
  category: text("category").notNull().references(() => categories.slug),
  summary: text("summary").notNull(),
  description: text("description").notNull(),
  features: text("features").notNull().default("[]"),
  image: text("image").notNull(),
  images: text("images").notNull().default("[]"),
  specifications: text("specifications").notNull().default("[]"),
  torque: text("torque"),
  force: text("force"),
  hardTorque: text("hard_torque"),
  hardForce: text("hard_force"),
  soundType: text("sound_type"),
  durability: text("durability"),
  materials: text("materials").default("[]"),
  characteristics: text("characteristics").default("[]"),
  dimensionDrawing: text("dimension_drawing"),
  performanceCharts: text("performance_charts"),
  variants: text("variants"),
  bufferDirection: text("buffer_direction"),
  assemblyMethod: text("assembly_method"),
  applications: text("applications").notNull().default("[]"),
  applicationScenarios: text("application_scenarios").default("[]"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  tags: text("tags").default("[]"),
  status: text("status").default("active"),
  isActive: integer("is_active").notNull().default(1),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
}, table => [
  index("products_category_idx").on(table.category),
  index("products_active_idx").on(table.isActive),
  index("products_sort_order_idx").on(table.sortOrder),
  index("products_updated_at_idx").on(table.updatedAt),
]);

export const admins = sqliteTable("admins", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// 新闻内容。locale / translationKey 为后续「中英双站同发」预留:
// 同一篇文章的不同语言版本共享 translationKey。
export const news = sqliteTable("news", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  locale: text("locale").notNull().default("zh"),
  translationKey: text("translation_key"),
  title: text("title").notNull(),
  summary: text("summary").notNull().default(""),
  content: text("content").notNull().default(""),
  cover: text("cover").notNull().default(""),
  category: text("category").notNull().default("company"),
  categoryLabel: text("category_label").notNull().default("公司动态"),
  isPublished: integer("is_published").notNull().default(0),
  publishedAt: text("published_at").notNull(),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  keywords: text("keywords"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// 官网询盘。status: new -> contacted -> closed
export const inquiries = sqliteTable("inquiries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  company: text("company"),
  phone: text("phone").notNull(),
  email: text("email"),
  productInterest: text("product_interest"),
  annualVolume: text("annual_volume"),
  message: text("message").notNull(),
  ip: text("ip"),
  status: text("status").notNull().default("new"),
  submittedAt: text("submitted_at").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
}, table => [
  index("inquiries_status_idx").on(table.status),
  index("inquiries_submitted_at_idx").on(table.submittedAt),
]);
