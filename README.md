# TEAO 中文独立站

TEAO 中文独立站项目，面向 `www.chinateao.com` 的新版国内 B2B 官网。

## 项目目标

- 中文站部署在国内服务器，优先服务国内访问速度、百度抓取和国内客户转化。
- 英文站继续部署在美国服务器，面向海外客户。
- 两个站页面展示形式可以不同，但产品、新闻、媒体和核心事实数据必须从统一内容源发布同步。
- 产品基础数据自动同步，中文文案和新闻内容走“自动生成草稿 + 人工审核发布”流程。

## 启动文档

- [中文站重构方向](docs/chinese-site-rebuild-direction.md)
- [资料准备与调整清单](docs/chinese-site-preparation-checklist.md)
- [中英文双站内容同步架构](docs/bilingual-content-sync-architecture.md)

## 技术栈

- Next.js App Router
- TypeScript
- Tailwind CSS
- npm

## 本地开发

```bash
npm run dev
```

默认地址：

```text
http://localhost:3000
```

## 第一阶段边界

第一阶段先做中文站前台基础、页面信息架构和同步内容模型预留，不直接部署生产服务器。

任何正式上线、服务器更新、DNS 切换或生产部署，都需要单独确认。
