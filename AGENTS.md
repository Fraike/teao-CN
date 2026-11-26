<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## 所有改动上线前需要用户明确同意

- 未经用户**明确同意**，禁止执行 `git push`。
- 未经用户**明确同意**，禁止部署或重启线上服务（服务器 `8.163.39.156`、PM2、Nginx）。
- 未经用户**明确同意**，禁止执行生产数据库迁移、修改服务器 `.env.local`、Nginx reload。
- 本地 `git commit` 可以正常进行；所有上线动作必须逐次确认。
- 之前的同意、已批准的 plan、或「把 P0 都处理一下」不构成本次自动部署授权。
