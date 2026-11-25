# 百度主动推送

## 说明

- 接口：`http://data.zz.baidu.com/urls?site=www.chinateao.com&token=...`
- 删除接口：`http://data.zz.baidu.com/del?site=www.chinateao.com&token=...`
- **site 参数必须是 `www.chinateao.com`（不带 `https://`）**；带协议会返回 `site init fail`
- 推送内容里的 URL 使用完整 `https://www.chinateao.com/...`
- token 只放在服务器 `/opt/teao-cn/.env.local`，不要提交仓库

## 配置 token

在服务器 `.env.local` 增加：

```bash
BAIDU_PUSH_TOKEN=你的token
```

然后重启：

```bash
pm2 restart teao-cn
```

## 后台自动推送

已接入：

- 商品创建/首次上架：推送商品 URL
- 商品下架/删除：调用百度删除接口
- 商品批量上架：只推送原本未上架的商品；批量下架/删除：批量删除
- 新闻首次发布：推送新闻 URL
- 新闻下架/删除/改 slug：删除旧 URL、推送/删除新 URL
- 普通编辑不推送，避免耗尽每日配额；sitemap 会负责重新抓取

没有配置 `BAIDU_PUSH_TOKEN` 时会自动跳过，不影响后台保存。

## 批量补推

服务器上执行（默认 dry-run）：

```bash
cd /opt/teao-cn
node --env-file=.env.local scripts/baidu-push.mjs --limit=5
```

确认无误后提交：

```bash
node --env-file=.env.local scripts/baidu-push.mjs --apply --limit=5
```

- 默认只取 sitemap 前 5 条；当前账号每日配额较小（测试后 `remain` 约 8），不要一次全推
- `--limit=0` 表示全部
- 返回结果里看 `remain` 和 `success`；如果 `error`，检查 token/site 写法

## 注意

- 百度主动推送有每日配额，先小批量测试
- 普通收录 sitemap 仍然建议在百度搜索资源平台提交
- token 泄露后可在百度后台重置，并同步更新服务器 `.env.local`
