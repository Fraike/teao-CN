# 云服务器访问与部署速查

> 最后更新:2026-11-10。私钥、密码等敏感信息**不写入本文件**,只记录方法与路径。

## 1. 目标服务器

| 项 | 值 |
|---|---|
| 主机 | `172.18.84.37` |
| 端口 | `22` |
| 用户 | `root` |
| 说明 | 该地址是**内网 IP**,公网不可达;需要在云控制台绑定「公网 IP / 弹性 IP」后,用公网地址访问 |
| 系统 | 待确认(首次登录后执行 `cat /etc/os-release`) |
| 项目路径 | 建议 `/opt/teao-cn` |

## 2. 登录方式(SSH 密钥)

本项目使用**独立密钥**,不使用密码登录。

- 私钥:`~/.ssh/teao_server`(**只在本机,绝不提交**)
- 公钥:`~/.ssh/teao_server.pub`

```bash
ssh -i ~/.ssh/teao_server root@<公网IP>
```

公钥内容(用于安装到服务器):

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIP03S8POIDosTfQbsjI38NYG8AllYHLJ//4EZyuWjzza teao-deploy@teao-cn
```

> 该密钥未设置口令,便于自动化部署。若担心私钥泄露,可改为带口令的密钥并使用 `ssh-agent`。

## 3. 首次安装公钥(只需一次)

在拿到公网 IP 之前无法执行。拿到后二选一:

**方式 A:密码登录时安装**

```bash
ssh-copy-id -i ~/.ssh/teao_server.pub root@<公网IP>
```

**方式 B:云控制台 VNC / 远程登录**

在服务器上执行:

```bash
mkdir -p ~/.ssh && chmod 700 ~/.ssh
echo 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIP03S8POIDosTfQbsjI38NYG8AllYHLJ//4EZyuWjzza teao-deploy@teao-cn' >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

验证:

```bash
ssh -i ~/.ssh/teao_server root@<公网IP> "hostname && cat /etc/os-release | head -2"
```

## 4. 安全加固(安装密钥并验证后)

1. **更换 root 密码**(原密码已在聊天中出现过,视为已泄露):
   ```bash
   passwd
   ```
2. **关闭密码登录**,只保留密钥:
   ```bash
   sed -i 's/^#\?PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
   systemctl restart sshd
   ```
3. 云控制台**安全组**只放行必要端口:`22`(可限制来源 IP)、`80`、`443`。

## 5. 部署速查(首次)

```bash
# 1. 系统依赖
apt update && apt install -y git nginx curl
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs

# 2. 代码(二选一)
#    A. 服务器可访问 GitHub 且仓库公开
git clone https://github.com/Fraike/teao-CN.git /opt/teao-cn
#    B. 从本机同步(推荐,避免服务器拉私库凭证)
rsync -avz --exclude node_modules --exclude .next --exclude data/*.db \
  /Users/mikewang/AI_Workspace/teao-CN/ root@<公网IP>:/opt/teao-cn/

# 3. 环境变量 /opt/teao-cn/.env.local
DATABASE_URL=file:data/teao-cn.db
AUTH_SECRET=<随机长字符串>
ADMIN_USERNAME=admin
ADMIN_PASSWORD=<强密码>

# 4. 初始化
cd /opt/teao-cn
npm ci
npm run db:push
npm run db:seed:admin      # 创建管理员 + 导入 41 篇新闻
npm run build

# 5. 进程守护
npm install -g pm2
pm2 start npm --name teao-cn -- start
pm2 save && pm2 startup
```

Nginx 反向代理(域名绑定后再加 `server_name` 与证书):

```nginx
server {
  listen 80;
  server_name _;
  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

> 注意:`next start` 在 `NODE_ENV=production` 下要求 `AUTH_SECRET`;上传的图片保存在 `public/uploads/`,备份时不要遗漏。

## 6. 给 AI 助手的上下文

- 仓库:本仓库(`teao-CN`),Next.js 16 App Router + TypeScript + Tailwind v4。
- 数据:Drizzle + libSQL,默认 `file:data/teao-cn.db`;表 `admins`、`news`(另有 phase-1 的 `products`/`categories`)。
- 后台:`/admin/login`,新闻 CRUD;上传目录 `public/uploads/news/`。
- 部署目标:上表服务器,项目路径 `/opt/teao-cn`,PM2 + Nginx。
- 规则:不要提交私钥;不要提交 `.env.local`、`data/*.db`、`public/uploads/` 以外的敏感文件;改动后先 `npx tsc --noEmit && npm run build`。
- 公网 IP 未绑定前,所有远程操作都无法进行。
