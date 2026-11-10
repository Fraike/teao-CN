# 待办清单

## 上线与域名(暂缓,后续处理)

- [x] **部署站点到公网服务器** `8.163.39.156`(PM2 + Nginx;详见 [docs/deployment/server-access.md](docs/deployment/server-access.md))
- [ ] **绑定域名 `www.chinateao.com`**(DNS + HTTPS 证书)
- [ ] HTTPS 上线后删除 `.env.local` 里的 `AUTH_COOKIE_SECURE=false`
- [ ] 确认服务器位于中国大陆或香港(影响百度抓取速度)
- [ ] 生产环境配置环境变量:`AUTH_SECRET`、`ADMIN_PASSWORD`、`DATABASE_URL`
- [ ] 生产环境执行一次 `npm run db:push` 与 `npm run db:seed:admin`

## 百度搜索资源平台

- [ ] 域名上线后,在百度搜索资源平台点「完成验证」(验证 meta 已加入全站)
- [ ] 提交 sitemap:`https://www.chinateao.com/sitemap.xml`(当前 124 条 URL)
- [ ] 获取「普通收录 → API 提交」的 token,配置 `BAIDU_PUSH_TOKEN`
- [ ] 接入后台发布时的百度主动推送(拿到 token 后实现)

## 内容与体验(可选优化)

- [ ] 首页 HTML 约 183KB,可精简 RSC 数据
- [ ] 应用页 GIF 合计约 38MB,可转 WebM/MP4 或压缩
- [ ] 分类/产品 URL 含大写与空格(如 `/Glove Box Dampers/`),是否规范化需与「保留原站 URL」原则权衡
- [ ] 增加百度统计或其他访问分析

## 后台后续版本

- [ ] 产品管理(型号、扭矩、规格、图集)
- [ ] 询盘管理(查看、标记、导出)
- [ ] 双站发布(借助已预留的 `locale` / `translationKey` 字段)
