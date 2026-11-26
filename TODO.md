# 待办清单

## ✅ 已完成

- [x] 商品后台：商品 CRUD、上下架、批量操作、分类管理、媒体库
- [x] 前台商品/分类/搜索/sitemap 改为 DB 数据源（77 商品 / 5 分类）
- [x] 旧 URL 301/308 覆盖：老 sitemap 51 条，0 个 404
- [x] 域名切换：`www.chinateao.com` + `chinateao.com` → `8.163.39.156`
- [x] 阿里云接入备案通过；HTTPS（Let's Encrypt）已生效
- [x] `AUTH_COOKIE_SECURE=true`；PM2 已加载新构建
- [x] 专利墙：15 张证书，5×3 对齐 + 覆盖范围汇总
- [x] 隐私政策页 `/privacy/` 已上线
- [x] 补 `/favicon.ico`
- [x] 询盘管理：入库、后台列表、状态标记、CSV 导出
- [x] 企业微信询盘通知 webhook
- [x] 百度主动推送：发布/下架触发
- [x] GitHub `origin/main` 已同步（本次运维/合规改动已提交）
- [x] 服务条款页 `/terms/` 已上线
- [x] 隐私政策补充第三方服务/跨境/保留期限/投诉渠道，已上线
- [x] 项目文档更新（README / PROJECT / 部署 / 合规 / handoff）

## ✅ 2026-11-26 已上线

- [x] 部署 `/terms/` 与隐私政策更新；sitemap 140 → 141
- [x] Nginx 安全头、清理 `server_name "_"` 冲突；`nginx -t` 无警告
- [x] PM2 切换 `ecosystem.config.cjs`，3000 只绑 `127.0.0.1`
- [x] 安装每日备份 + 每 5 分钟健康检查 cron；手动备份已跑通
- [x] `certbot renew --dry-run` 成功
- [x] `AUTH_COOKIE_SECURE=true`、百度 token、企业微信 webhook 均在
- [x] 百度主动推送 `/terms/`、`/privacy/`（success=2）
- [ ] Google Search Console / Bing Webmaster 手动重新提交 sitemap

## 🟡 P1：安全与运维

- [ ] 管理员密码轮换；增加角色/操作审计/服务端验证码/CSRF 加固
- [ ] 老站、老备案保留 2–4 周后清理

## 🟡 P1：SEO 与内容

- [ ] 百度/GSC/Bing 索引量跟踪
- [ ] 变体商品重复内容检查（RD-V088、RD-10 家族）
- [ ] 百度主动推送配额监控，批量补推小步跑
- [ ] 增加百度统计或其他访问分析
- [ ] 静态页 sitemap `lastModified` 改为动态/可维护

## 🟢 P2：性能与体验

- [ ] 首页 HTML 约 187KB，精简 RSC 数据
- [ ] 图片 61MB / 应用 GIF 20MB，压缩或转 WebM/MP4
- [ ] 媒体库扫描优化（缓存/分页/目录筛选）
- [ ] 商品列表服务端分页、CSV 导入导出（视数据量）
- [ ] 询盘分页/负责人/跟进备注（视数据量）
- [ ] 双站发布 / 中英文同步
- [ ] CI/CD 与预发布环境

## 规则

- 本地 commit 可以；**push、部署、重启、迁移、修改服务器 `.env.local`、Nginx reload 必须逐次获得用户明确同意**。
- 不提交 `.env.local`、私钥、数据库、uploads。
