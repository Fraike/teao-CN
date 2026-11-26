# 云服务器访问与部署速查

> 最后更新：2026-11-26。私钥、密码、token 等敏感信息**不写入本文件**。

## 1. 服务器

| 项 | 值 |
|---|---|
| 公网 IP | `8.163.39.156` |
| 内网 IP | `172.18.84.37` |
| 端口 | `22` |
| 用户 | `root` |
| 系统 | Alibaba Cloud Linux 4（x86_64） |
| 配置 | 2 vCPU / 3.5GB 内存 / 40GB 磁盘 |
| 项目路径 | `/opt/teao-cn` |
| 运行方式 | PM2 进程 `teao-cn`（`127.0.0.1:3000`）+ Nginx 80/443 |
| 域名 | `https://www.chinateao.com` + `chinateao.com`（非 www 301） |

## 2. 登录（仅 SSH 密钥）

密码登录已关闭，只允许密钥。

- 私钥：`~/.ssh/teao_server`（只在本机，绝不提交）
- 公钥：`~/.ssh/teao_server.pub`（已安装到服务器 `~/.ssh/authorized_keys`）

```bash
ssh -i ~/.ssh/teao_server root@8.163.39.156
```

公钥内容：

```text
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIP03S8POIDosTfQbsjI38NYG8AllYHLJ//4EZyuWjzza teao-deploy@teao-cn
```

> 阿里云控制台的「远程连接 / VNC」仍可用 root 密码登录，不受 sshd 密码策略影响。

## 3. 已安装环境

- Node.js `v24.22.1`、npm `11.x`
- Nginx `1.30.4`
- PM2
- certbot `5.10.0`（venv：`/opt/certbot`）
- rsync、git（服务器上没有 git 仓库，靠 rsync 部署）

HTTPS 证书：`/etc/letsencrypt/live/chinateao.com/`，有效期至 `2027-02-23`。
证书续期：`/etc/cron.d/certbot-renew`，每天 03:17、15:17 执行 `certbot renew`。

备份与监控：见 [backups-and-monitoring.md](backups-and-monitoring.md)。

## 4. 部署流程

> **所有改动部署上线前必须获得用户明确同意。**
> 本地 commit 可以；`git push`、rsync、服务器 build、`pm2 restart`、Nginx reload、生产数据库迁移、修改 `.env.local` 必须逐次确认。

### 4.1 同步代码

```bash
cd /Users/mikewang/AI_Workspace/teao-CN
rsync -az \
  --exclude node_modules --exclude .next --exclude '.next.bak*' --exclude .git \
  --exclude chinateao-export --exclude trash_review --exclude .superpowers --exclude .workbuddy \
  --exclude '特澳专利' \
  --exclude 'data/*.db*' --exclude 'public/uploads' \
  --exclude docs/site-audit --exclude docs/typography-review \
  -e "ssh -i $HOME/.ssh/teao_server" \
  ./ root@8.163.39.156:/opt/teao-cn/
```

### 4.2 数据库变更

```bash
ssh -i ~/.ssh/teao_server root@8.163.39.156
cd /opt/teao-cn

# 商品表只在 schema 缺少 path/listing_title 等字段时执行一次
DATABASE_URL=file:/opt/teao-cn/data/teao-cn.db node scripts/migrate-product-tables.mjs --force

# 首次迁移或空库时导入 77 条商品；线上已有商品时不要重复执行
DATABASE_URL=file:/opt/teao-cn/data/teao-cn.db npm run db:seed:products -- --force

# 询盘表（IF NOT EXISTS，可重复执行）
DATABASE_URL=file:/opt/teao-cn/data/teao-cn.db npm run db:migrate:inquiries -- --apply

# 校验商品
DATABASE_URL=file:/opt/teao-cn/data/teao-cn.db npm run db:verify:products
```

> 不要在生产重复执行 `db:seed:products -- --force`，会覆盖后台商品编辑。

### 4.3 构建与重启

```bash
cd /opt/teao-cn
NODE_OPTIONS=--max-old-space-size=2048 npm run build
# 首次从 npm start 切换到 ecosystem（会短暂中断）：
pm2 delete teao-cn
pm2 start ecosystem.config.cjs
pm2 save
```

`ecosystem.config.cjs` 固定 `next start -H 127.0.0.1 -p 3000`，3000 不再监听公网网卡。之后普通重启：

```bash
pm2 restart teao-cn
```

## 5. 运行时文件

- 环境变量：`/opt/teao-cn/.env.local`（权限 600）
- 数据库：`/opt/teao-cn/data/teao-cn.db`（SQLite）
- 上传图片：`/opt/teao-cn/public/uploads/`
- 定时备份：`/opt/teao-cn/backups/YYYY-MM-DD_HHmmss/`（含 DB + uploads）
- PM2 日志：`~/.pm2/logs/teao-cn-*.log`
- 一次性备份：`data/teao-cn.db.bak-2026-11-16-pre-admin`、`.next.bak-2026-11-16-pre-admin`

`.env.local` 当前需要的键：

```text
DATABASE_URL
AUTH_SECRET
ADMIN_USERNAME
ADMIN_PASSWORD
AUTH_COOKIE_SECURE=true
BAIDU_PUSH_TOKEN
CONTACT_WEBHOOK_URL
CONTACT_WEBHOOK_TYPE=wecom
# 可选：监控告警单独群；不配则回退 CONTACT_WEBHOOK_URL
ALERT_WEBHOOK_URL=
```

> 不要把值写入仓库或文档。修改 `.env.local` 后需要重启 PM2 才会被 Next.js 重新加载。

## 6. Nginx

- 配置：`/etc/nginx/conf.d/teao-cn.conf`
- HTTP 80：redirect 到 `https://www.chinateao.com`
- HTTPS 443：`www` 反代 `127.0.0.1:3000`；apex 301 到 www
- ACME 验证目录：`/var/www/certbot`
- Google 验证文件：`/google0f0d9d0f414db640.html`（Nginx 精确路径直接返回）
- `/uploads/` 直接映射磁盘；`/_next/static/` 长缓存
- 安全头：`X-Content-Type-Options`、`Referrer-Policy`、`X-Frame-Options`、`Permissions-Policy`、最小 CSP；`server_tokens off`
- HSTS 先注释，HTTPS 稳定 2 周后再开（单向操作）
- 默认 server 冲突：`/etc/nginx/nginx.conf` 自带 `server_name _` 的 stock server（约 37–53 行）与 `teao-cn.conf` 的 `listen 80 default_server` 冲突，需注释/删除 stock 块
- HTTPS 配置示例：`docs/deployment/nginx-https.conf.example`

## 7. 数据表

- `products`、`categories`
- `news`
- `admins`
- `inquiries`

## 8. 安全与运维

- HTTPS 已启用；`AUTH_COOKIE_SECURE=true`
- 3000 已通过 `ecosystem.config.cjs` 只绑定 `127.0.0.1`
- Nginx 已加安全响应头；HSTS 待 HTTPS 稳定 2 周后开启
- 定时备份：`scripts/backup-production.mjs` + `/etc/cron.d/teao-cn-backup`
- 监控：`scripts/health-check.mjs` + `/etc/cron.d/teao-cn-health`（页面 200 + 证书剩余天数）
- 管理员密码只在线下/聊天交付；建议定期轮换

## 9. 给 AI 助手的上下文

- 仓库：Next.js 16 App Router + TypeScript + Tailwind v4
- 数据：Drizzle + libSQL，表 `products/categories/news/admins/inquiries`
- 后台：`/admin/login`；商品、分类、媒体、新闻、询盘
- SEO：旧 URL 301/308；部署合规页后 sitemap 141 条
- 百度主动推送：发布/下架触发；批量脚本 `npm run seo:baidu-push`
- 询盘：DB 入库 + 后台列表 + 企业微信 webhook
- 规则：不提交私钥、`.env.local`、数据库、uploads；**所有上线动作必须逐次获得用户明确同意**
