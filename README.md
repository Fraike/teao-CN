# TEAO 中文独立站

面向 `www.chinateao.com` 的国内 B2B 官网，已上线 HTTPS。

- 线上：<https://www.chinateao.com/>
- 后台：<https://www.chinateao.com/admin>
- ICP 备案：粤ICP备13044030号-2

## 当前功能

**前台**

- 首页、产品中心、5 个产品分类、商品详情
- 应用案例、质量控制、关于我们（含专利荣誉墙）
- 新闻、联系我们、全局搜索
- sitemap、llms.txt、结构化数据、百度/Google/Bing 验证
- 隐私政策 `/privacy/`、服务条款 `/terms/`

**后台**

- 商品管理：CRUD、上下架、批量操作
- 分类管理：名称、描述、图片、分页配置
- 媒体库：上传、选图、删除（有引用保护）
- 新闻管理：Tiptap 编辑器、发布状态
- 询盘管理：列表、搜索、状态标记、CSV 导出
- 首页工作台：商品、分类、新闻、新询盘计数

**数据**

- SQLite + Drizzle，线上 `data/teao-cn.db`
- 77 商品 / 5 分类 / 41 新闻 / 1 管理员
- 询盘入库；企业微信 webhook 即时通知

**SEO**

- 旧商品/分类 URL 301/308 保留，老 sitemap 51 条 0 个 404
- 线上 sitemap 141 条（含 `/terms/`、`/privacy/`）
- `/products/` 已开放收录；robots 允许百度/AI 搜索爬虫
- 百度主动推送：发布/下架时触发

**运维**

- PM2 只监听 `127.0.0.1:3000`，Nginx 反代
- Nginx 安全响应头；HSTS 待 HTTPS 稳定 2 周后开启
- DB + uploads 每日备份；页面/证书健康检查

## 技术栈

- Next.js 16 App Router + React 19
- TypeScript + Tailwind CSS v4
- Drizzle ORM + libSQL/SQLite
- Tiptap 3
- PM2 + Nginx + Let's Encrypt

## 本地开发

```bash
npm install
cp env.example .env.local
# 填写 AUTH_SECRET、ADMIN_USERNAME、ADMIN_PASSWORD、DATABASE_URL
npm run db:migrate:products -- --force
npm run db:seed:products -- --force
npm run db:migrate:inquiries -- --apply
npm run db:seed:admin
npm run dev
```

默认地址：`http://localhost:3000`，后台 `/admin/login`。

> `db:migrate:products -- --force` 会重建 products/categories，仅用于本地首次初始化；线上禁止重复执行。

## 常用脚本

| 命令 | 用途 |
|---|---|
| `npm test` | 单元测试 |
| `npm run seo:audit` | 对比老站 sitemap 与当前站点响应 |
| `npm run seo:baidu-push -- --limit=5` | 百度主动推送批量补推（dry-run；加 `--apply` 提交） |
| `npm run db:verify:products` | 校验商品/分类/图片 |
| `npm run db:migrate:inquiries` | 创建询盘表 |
| `npm run db:seed:admin` | 创建管理员并导入新闻（表为空时） |
| `node scripts/backup-production.mjs` | 备份 DB + uploads（服务器执行） |
| `node scripts/health-check.mjs` | 检查页面 200 与证书剩余天数 |

## 文档

- [部署与服务器](docs/deployment/server-access.md)
- [备份、证书与监控](docs/deployment/backups-and-monitoring.md)
- [SEO 切换清单](docs/seo-cutover.md)
- [百度主动推送](docs/deployment/baidu-push.md)
- [合规说明](docs/compliance.md)
- [专利清单](docs/patent-inventory.md)
- [项目说明](PROJECT.md)
- [待办](TODO.md)

## 上线规则

**所有改动在部署上线前必须获得用户明确同意。** 本地 commit 可以；`git push`、rsync、服务器 build、`pm2 restart`、Nginx reload、生产数据库迁移、修改服务器 `.env.local` 都必须逐次确认。
