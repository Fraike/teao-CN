# 备份、证书与监控

> 最后更新：2026-11-26。所有服务器操作需用户明确同意后执行。

## 1. 备份

脚本：`scripts/backup-production.mjs`

- 数据库：用 `VACUUM INTO` 生成一致性快照；失败时回退到 `wal_checkpoint + copy`
- uploads：`tar -czf` 打包 `public/uploads`
- 输出：`/opt/teao-cn/backups/YYYY-MM-DD_HHmmss/`
- 不自动删除历史备份；备份里含询盘个人信息，目录权限 700

手动执行：

```bash
ssh -i ~/.ssh/teao_server root@8.163.39.156
cd /opt/teao-cn
node --env-file=.env.local scripts/backup-production.mjs
```

### 定时任务

```bash
sudo mkdir -p /opt/teao-cn/backups
sudo chmod 700 /opt/teao-cn/backups
sudo tee /etc/cron.d/teao-cn-backup >/dev/null <<'EOF'
30 3 * * * root cd /opt/teao-cn && /usr/bin/node --env-file=.env.local scripts/backup-production.mjs >> /var/log/teao-cn-backup.log 2>&1
EOF
sudo chmod 644 /etc/cron.d/teao-cn-backup
```

保留建议：每周检查一次，保留最近 14–30 天；旧备份移到 `trash_review/` 或异地归档后再清理，不要直接 `rm`。

### 恢复

```bash
cd /opt/teao-cn
pm2 stop teao-cn
cp backups/<时间>/teao-cn.db data/teao-cn.db
tar -xzf backups/<时间>/uploads.tar.gz -C public
pm2 start ecosystem.config.cjs
curl -I https://www.chinateao.com/
```

恢复前先把当前 DB/uploads 另存一份，避免二次损坏。

## 2. 证书续期复测

```bash
ssh -i ~/.ssh/teao_server root@8.163.39.156
/opt/certbot/bin/certbot renew --dry-run
```

- 现有自动续期：`/etc/cron.d/certbot-renew`（每天 03:17、15:17）
- 证书路径：`/etc/letsencrypt/live/chinateao.com/`
- 当前有效期至 2027-02-23
- 若 dry-run 失败，先看 `/var/log/letsencrypt/letsencrypt.log`，不要直接改生产证书

## 3. 站点监控

脚本：`scripts/health-check.mjs`

检查项：

- `/`、`/products/`、`/privacy/`、`/terms/`、`/admin/login` 是否 200
- HTTPS 证书剩余天数（< 14 天告警）
- 失败时通过企业微信 webhook 告警；恢复时发一次恢复通知
- 连续失败每 30 分钟最多告警一次

环境变量：

```text
# 可选；不配则回退到 CONTACT_WEBHOOK_URL
ALERT_WEBHOOK_URL=
```

手动执行：

```bash
cd /opt/teao-cn
node --env-file=.env.local scripts/health-check.mjs
```

### 定时任务

```bash
sudo tee /etc/cron.d/teao-cn-health >/dev/null <<'EOF'
*/5 * * * * root cd /opt/teao-cn && /usr/bin/node --env-file=.env.local scripts/health-check.mjs >> /var/log/teao-cn-health.log 2>&1
EOF
sudo chmod 644 /etc/cron.d/teao-cn-health
```

日志：

```bash
tail -f /var/log/teao-cn-health.log
tail -f /var/log/teao-cn-backup.log
```

> 当前复用询盘企业微信群作为告警通道；如果告警太吵，可在企业微信另建「运维告警」群并配置 `ALERT_WEBHOOK_URL`。

## 4. 与 Nginx/PM2 的关系

- PM2 只监听 `127.0.0.1:3000`，由 Nginx 反代；健康检查走公网域名，能覆盖 Nginx + Next + 证书
- Nginx 安全头与 HSTS 说明见 `nginx-https.conf.example`
- 所有重启、Nginx reload、cron 安装、证书操作都必须逐次获得用户同意
