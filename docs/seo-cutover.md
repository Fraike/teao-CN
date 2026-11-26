# 域名切换 SEO 清单（www.chinateao.com）

> 最后核对：2026-11-16。域名不变，变的是托管服务器。

## 1. 当前状态

| 项 | 现状 |
|---|---|
| 代码 canonical | `https://www.chinateao.com` |
| 老站解析 | `211.149.238.226`（Server: wts） |
| 新站位置 | `8.163.39.156`（Nginx + Next.js），**已上线 HTTPS** |
| non-www | `chinateao.com` 301 → `https://www.chinateao.com/` |
| DNS TTL | 600 秒 |
| 老站 sitemap | 51 条，lastmod 约 2024-02 |
| 新站 sitemap | 线上 141 条（含 `/products/`、`/privacy/`、`/terms/`） |
| 新站 robots | 允许百度 / Bytespider / GPTBot / ClaudeBot / PerplexityBot，禁止 `/admin`、`/api/` |

**结论：域名没有变化，不需要做域名迁移。需要做的是同域名换服务器 + 老 URL 301 覆盖。**

> 2026-11-25：阿里云接入备案通过，DNS 已切到 `8.163.39.156`，HTTPS（Let's Encrypt）已生效。老站保留用于回滚。

## 2. 老站 sitemap 覆盖情况

- 老 sitemap 51 条；新 sitemap 覆盖 13 条。
- 缺失 38 条：
  - 12 条 `/zh-hans/torque/...` 已有 wildcard 301 → `/convert/`
  - **26 条已覆盖**：23 条配置级 301 + 3 条应用层 308（大小写归一化）
- 26 条补齐后，老 sitemap 全部有 200 / 301 / 308 响应，且重定向目标页均为 200。

## 3. 26 条旧 URL → 新 URL

### 3.1 老商品页

| 老 URL | 新 URL |
|---|---|
| `/synchronizers/organizer-rd-t181.html` | `/Glove Box Dampers/organizer-rd-t181.html` |
| `/axial-dampers/axial-barrel-damper-rd-t138.html` | `/axial-dampers/axial-barrel-damper- RD-T138.html` |
| `/axial-dampers/axial-barrel-damper-rd-v088.html` | `/axial-dampers/rd-v088tongzhouxinshiyongyumatongzuniqizhinengweiyu.html` |
| `/liner-dampers/gear-rotary-vane-damper-rd-v127.html` | `/Glove Box Dampers/gear-rotary-vane-damper-RD-V127.html` |
| `/liner-dampers/liner-damper-rd-v126.html` | `/Glove Box Dampers/liner-damper- RD-V126.html` |
| `/air-dampers/axial-barrel-damper-rd-v08.html` | `/Glove Box Dampers/axial-barrel-damper- RD-V08.html` |

以下 3 条旧路径与新商品路径只差大小写，Next 配置级 redirect 不区分大小写，会自跳转/遮蔽商品页，因此改为在 `[...legacyPath]` 路由内做大小写归一化并 `permanentRedirect`（308）：

| 老 URL | 新 URL |
|---|---|
| `/axial-dampers/axial-barrel-damper-rd-t017.html` | `/axial-dampers/axial-barrel-damper-RD-T017.html` |
| `/axial-dampers/axial-barrel-damper-rd-t013b.html` | `/axial-dampers/axial-barrel-damper-RD-T013B.html` |
| `/axial-dampers/axial-barrel-damper-rd-r018.html` | `/axial-dampers/axial-barrel-damper-RD-R018.html` |

### 3.2 老分类 / 中文落地页

| 老 URL | 新 URL |
|---|---|
| `/air-dampers/` | `/Glove Box Dampers/` |
| `/liner-dampers/` | `/axial-dampers/` |
| `/synchronizers/` | `/gear-damper/` |
| `/brochures/` | `/products/` |
| `/axial-damper-china/` | `/axial-dampers/` |
| `/air-damper-china/` | `/Glove Box Dampers/` |
| `/liner-damper-china/` | `/axial-dampers/` |
| `/organizer-china/` | `/Glove Box Dampers/` |

### 3.3 旧 CMS / 文章页

| 老 URL | 新 URL |
|---|---|
| `/index.php/products/gear-damper.html` | `/gear-damper/` |
| `/index.php/products/axial-dampers.html` | `/axial-dampers/` |
| `/index.php/Content/Pagedis/lists/id/47/catid/6/hcatid/47.html` | `/contacts/` |
| `/index.php/Content/Pagedis/lists/id/19/catid/6/hcatid/19.html` | `/contacts/` |
| `/index.php/Content/Pagedis/lists/id/42/catid/6/hcatid/42.html` | `/contacts/` |
| `/index.php/Content/Pagedis/lists/id/35/catid/6/hcatid/35.html` | `/contacts/` |
| `/index.php/Content/Pagedis/lists/id/37/catid/6/hcatid/37.html` | `/contacts/` |
| `/internal/air-dampers-in-automotive-interior-glove-compartments.html` | `/applications/automotive-interior/internal/` |
| `/internal/application-of-gear-dampers-in-automotive.html` | `/applications/automotive-interior/internal/` |

## 4. 安全兜底

以下前缀已加 wildcard 301，防止老站未进 sitemap 的 URL 直接 404：

- `/air-dampers/:path+` → `/Glove Box Dampers/`
- `/liner-dampers/:path+` → `/axial-dampers/`
- `/synchronizers/:path+` → `/gear-damper/`
- `/brochures/:path+` → `/products/`
- `/support/`、`/support/:path+` → `/products/`
- `/index.php/Content/Pagedis/lists/:path+` → `/contacts/`
- `/index.php/products/:path+` → `/products/`
- `/index.php/:path+` → `/products/`
- `/internal/:path+` → `/applications/automotive-interior/internal/`

> 注意：没有给 `/gear-damper/:path+`、`/axial-dampers/:path+`、`/Glove Box Dampers/:path+`、`/latches/:path+` 加 wildcard，因为会遮蔽新站自己的商品页。

## 5. `/products/` 收录

- 老站 `/products/` 可收录，已经存在关键词页。
- 新站已移除 `noindex`，并加入 sitemap（优先级 0.8，weekly）。
- canonical：`https://www.chinateao.com/products/`。

## 6. 切换前检查

- [ ] 备份老站数据和当前数据库（`data/teao-cn.db.bak`）。
- [ ] 新服务器配好 HTTPS 证书。
- [ ] Nginx `server_name` 同时包含 `www.chinateao.com` 和 `chinateao.com`。
- [ ] `http://` → `https://` 301。
- [ ] `chinateao.com` → `https://www.chinateao.com` 301（与老站当前行为一致）。
- [ ] 上线前给测试 IP 加 `X-Robots-Tag: noindex` 或 Basic Auth，避免重复收录。
- [ ] DNS TTL 已为 600 秒；切换前可保持不变。
- [ ] 确认百度验证 meta 仍在（`baidu-site-verification`）。
- [ ] 保留老站服务器至少 2–4 周，便于回滚。
- [ ] 运行 `npm run seo:audit`，确认 0 个 404。

## 7. 切换后检查

- [ ] 提交新 sitemap 到百度搜索资源平台、Google Search Console、Bing Webmaster。
- [ ] 百度主动推送（如已配置 token）。
- [ ] 检查 Nginx 404 日志，重点看老 URL。
- [ ] 监控百度/Google 索引量与关键词排名 2–4 周。
- [ ] 检查 `/products/`、5 个分类页、77 个商品页、41 篇新闻的收录。
- [ ] 检查 canonical、`robots.txt`、`sitemap.xml` 在新域名下均返回 `https://www.chinateao.com`。

## 8. 复现审计

```bash
# dev 服务需在 3000 端口运行
npm run seo:audit

# 或用已保存的老 sitemap
node scripts/audit-seo-cutover.mjs http://localhost:3000 --old-sitemap=/tmp/old-sitemap.xml
```

脚本会逐条检查老 sitemap URL 在新站的响应，跟随 301/308 检查目标页是否 200，并检查 `/products/` 是否已开放收录；有 404 或目标页非 200 会退出码 1。

## 9. 备注

- 老站 sitemap 可能不完整；切换前建议从百度搜索资源平台、Google Search Console 导出实际已收录 URL，再补一轮 301。
- 变体商品（RD-V088、RD-10 家族）如内容高度相似，后续可评估 canonical 或合并，避免重复内容稀释。
- 配置级 redirect 大小写不敏感，后续再补旧 URL 时，注意不要加「只差大小写」的 source，否则会遮蔽新商品页。
