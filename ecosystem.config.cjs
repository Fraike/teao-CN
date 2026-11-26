/**
 * PM2 生产配置。
 *
 * 只监听 127.0.0.1:3000，外部流量必须经过 Nginx。
 * 部署/重启前需获得用户明确同意。
 */
module.exports = {
  apps: [
    {
      name: "teao-cn",
      cwd: __dirname,
      script: "node_modules/next/dist/bin/next",
      args: "start -H 127.0.0.1 -p 3000",
      interpreter: "node",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "800M",
      time: true,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
