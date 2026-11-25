# 待办清单

## ✅ 已完成（2026-11-25）

- [x] 商品后台：商品 CRUD、上下架、批量操作、分类管理、媒体库
- [x] 前台商品/分类/搜索/sitemap 改为 DB 数据源（77 商品 / 5 分类）
- [x] 旧 URL 301/308 覆盖：老 sitemap 51 条，0 个 404
- [x] 域名切换：`www.chinateao.com` + `chinateao.com` → `8.163.39.156`
- [x] 阿里云接入备案通过；HTTPS（Let's Encrypt）已生效
- [x] `AUTH_COOKIE_SECURE=true`；PM2 已加载新构建
- [x] 专利墙：15 张证书，5×3 对齐 + 覆盖范围汇总
- [x] 隐私政策页 `/privacy/` 和联系表单合规链接（本地完成，待部署）
- [x] 补 `/favicon.ico`（本地完成，待部署）

## 🔴 上线运营

- [ ] 部署隐私政策页 + favicon（rsync / build / pm2 restart）
- [ ] 百度搜索资源平台：完成验证、提交 sitemap（140 条）
- [ ] Google Search Console / Bing Webmaster：提交 sitemap
- [ ] 百度「普通收录 → API 提交」token，配置 `BAIDU_PUSH_TOKEN`
- [ ] 接入后台发布时的百度主动推送
- [ ] 生产后台用真实账号登录，测试商品/分类/媒体/新闻
- [ ] 修改默认管理员密码（如未改）
- [ ] 老站、老备案保留 2–4 周；回滚方式：DNS 改回 CNAME `chinateao.gotoip11.com`

## 🟡 本周内

- [ ] 监控 Nginx 404 / 百度与 Google 索引
- [ ] 证书续期 `certbot renew --dry-run` 重测（上次 120s 超时）
- [ ] 本地 commit + 更新部署文档（当前大量改动未提交）

## 🟢 后续版本

- [ ] 询盘管理（查看、标记、导出）
- [ ] 双站发布 / 中英文同步
- [ ] 角色权限、操作审计、服务端验证码、CSRF 加固
- [ ] 首页 RSC 体积、应用页 GIF 压缩
- [ ] 百度统计或其他访问分析
- [ ] HTTPS 稳定后开启 HSTS
