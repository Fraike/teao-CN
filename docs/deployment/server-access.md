# 云服务器访问与部署速查

> 最后更新:2026-11-10。私钥、密码等敏感信息**不写入本文件**。

## 1. 服务器

| 项 | 值 |
|---|---|
| 公网 IP | `8.163.39.156` |
| 内网 IP | `172.18.84.37` |
| 端口 | `22` |
| 用户 | `root` |
| 系统 | Alibaba Cloud Linux 4(x86_64) |
| 配置 | 2 vCPU / 3.5GB 内存 / 40GB 磁盘 |
| 项目路径 | `/opt/teao-cn` |
| 运行方式 | PM2 进程 `teao-cn`(端口 3000)+ Nginx 反向代理(80) |

## 2. 登录(仅 SSH 密钥)

密码登录已关闭,只允许密钥。

- 私钥:`~/.ssh/teao_server`(**只在本机,绝不提交**)
- 公钥:`~/.ssh/teao_server.pub`(已安装到服务器 `~/.ssh/authorized_keys`)

```bash
ssh -i ~/.ssh/teao_server root@8.163.39.156
```

公钥内容:

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIP03S8POIDosTfQbsjI38NYG8AllYHLJ//4EZyuWjzza teao-deploy@teao-cn
```

sshd 关键配置(`/etc/ssh/sshd_config`,原文件已备份为 `sshd_config.bak.*`):

```
PubkeyAuthentication yes
PasswordAuthentication no
PermitRootLogin prohibit-password
```

> 阿里云控制台的「远程连接 / VNC」仍可用 root 密码登录,不受 sshd 密码策略影响。

## 3. 已安装环境

Node.js `v24.22.1`、npm `11.x`、git、nginx `1.30`、rsync、pm2。

## 4. 更新部署流程

```bash
# 1. 本机同步代码(排除依赖/构建产物/大目录)
cd /Users/mikewang/AI_Workspace/teao-CN
rsync -az \
  --exclude node_modules --exclude .next --exclude .git \
  --exclude chinateao-export --exclude trash_review --exclude .superpowers \
  --exclude 'data/*.db*' --exclude 'public/uploads' \
  --exclude docs/site-audit --exclude docs/typography-review \
  -e "ssh -i $HOME/.ssh/teao_server" \
  ./ root@8.163.39.156:/opt/teao-cn/

# 2. 服务器构建并重启
ssh -i ~/.ssh/teao_server root@8.163.39.156
cd /opt/teao-cn
npm ci                      # 依赖有变化时
NODE_OPTIONS=--max-old-space-size=2048 npm run build
pm2 restart teao-cn
```

数据库变更时先执行 `npm run db:push`;首次部署还需 `npm run db:seed:admin`(创建管理员并导入 41 篇新闻)。

## 5. 运行时文件

- 环境变量:`/opt/teao-cn/.env.local`(权限 600),包含 `DATABASE_URL`、`AUTH_SECRET`、`ADMIN_USERNAME`、`ADMIN_PASSWORD`。
- 数据库:`/opt/teao-cn/data/teao-cn.db`(SQLite)。
- 上传图片:`/opt/teao-cn/public/uploads/`,由 Nginx `location /uploads/` 直接提供。
- PM2 日志:`~/.pm2/logs/teao-cn-*.log`。

## 6. Nginx

配置:`/etc/nginx/conf.d/teao-cn.conf`,80 端口反代到 `127.0.0.1:3000`;`/uploads/` 直接映射磁盘;`/_next/static/` 长缓存。

## 7. 安全与待办

> **推送与部署必须获得用户明确同意。** 本地 commit 可以,`git push` 与服务器部署/重启需逐次确认。


- ⚠️ 当前 **HTTP 访问**,`.env.local` 临时设置了 `AUTH_COOKIE_SECURE=false` 才能在 http 下登录后台。**配置 HTTPS 后必须删除该行**。
- 管理员密码只通过线下/聊天交付,未写入仓库;上线后建议更换。
- 待办:绑定域名 `www.chinateao.com` + HTTPS 证书;百度站长平台完成验证、提交 sitemap、获取主动推送 token。
- 备份:定期备份 `data/teao-cn.db` 与 `public/uploads/`。

## 8. 给 AI 助手的上下文

- 仓库:本仓库(`teao-CN`),Next.js 16 App Router + TypeScript + Tailwind v4。
- 数据:Drizzle + libSQL,`/opt/teao-cn/data/teao-cn.db`;表 `admins`、`news`。
- 后台:`/admin/login`,新闻 CRUD + Tiptap 编辑器 + 图片上传。
- 部署:公网 `8.163.39.156`,路径 `/opt/teao-cn`,PM2 `teao-cn`,Nginx 80。
- 规则:不提交私钥与 `.env.local`;改代码后先本地 `npx tsc --noEmit && npm run build`,再 rsync + 服务器 build + `pm2 restart teao-cn`。
