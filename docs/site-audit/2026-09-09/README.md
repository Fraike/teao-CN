# 中文站原址优化：线上盘点与逐页对照

采集日期：2026-09-09。权威来源：https://www.chinateao.com/。目标 URL 与来源 URL 完全相同。

发现 **180 个地址**；其中主抓取尝试 173 个，HTTP 200：40，HTTP 403：128，HTTP 404：5，仅发现未请求：7。sitemap 列出 51 个地址。

**覆盖尚不完整。** 403 是本次自动抓取被拒绝，不代表网页失效；后续链接无法展开。分类页在抓取前曾成功取得 HTML，保留早期快照和后续 403 两条证据。不因 403 或旧 sitemap 的 404 删除地址。

## 执行结果

- 两个原址样板已实现：`/gear-damper/`、`/gear-damper/gear-rotary-damper-rd-t038-v038.html`。
- 分类第 1 页保留原来的 12 款和顺序，分页保持 `index_2.html` / `index_3.html`。
- 导航保留首页、产品、应用案例、质量控制、支持、关于我们、联系我们，以及二/三级栏目。
- 样板以外链接使用线上绝对原址，避免在本地预览点击到未实现页面；没有把其请求重定向为样板。
- 样板设为 noindex，未放进本地 sitemap；正式上线前需完成内容核对、全站承接与索引配置。
- 现有本地首页、关于页、联系页和数据库保留；这不是整站部署包。

## 需要优先核对的事实

| 项目 | 中文站证据 | 对照 / 处理 |
|---|---|---|
| RD-T038 扭矩 | 详情：200–1000 gf.cm | 英文库：200–1500；样板沿用中文数据，不能自动覆盖 |
| RD-T038 尺寸 | 分类：Φ11；详情：Φ13 | 样板暂不展示冲突尺寸，待工程图确认 |
| RD-T038 模数 | 分类：1.0；详情：11 | 英文库：1；样板暂不展示，不能自行纠错后发布 |
| 其他卡片压力角 | 有 20°c 的标注 | 未作为确认参数展示，原文保存在 gear-products.json |
| 联系方式 | 旧站手机 18928247197、邮箱 info@chinateao.com | 本地开发版不同；样板使用旧站公开口径 |
| 资质与产能 | 旧详情含 ISO9001、1 亿年产能 | 其他内容来源存在不同口径；样板未扩大引用这些声明 |

## 下一步

1. 在正常访问条件下继续补抓被拒绝页和分页，结合后台导出、访问日志或搜索平台补齐孤立 URL。
2. 核对上述产品参数，确认本次分类/详情样板后，同模板承接其他产品。
3. 按下表承接原址，保留中文、空格、大小写、嵌套斜杠、.html、PHP 历史路径及查询参数。
4. 完成联系我们原页与真实询盘流转，再逐栏目处理应用、质量、支持、新闻、关于。
5. 全站验收后才调整 noindex / sitemap 并准备独立上线确认。

## 完整地址对应表

目标地址与「线上地址」相同；403/未请求条目的标题可能为空。

| 线上地址（目标原样保留） | 类型 | 抓取状态 | 页面标题 | 本地对应 |
|---|---|---|---|---|
| [/](https://www.chinateao.com/) | 栏目/基础页 | 200 | 旋转阻尼器_齿轮阻尼器_汽车内饰缓冲_东莞市特澳电子科技有限公司 | src/app/page.tsx（开发版首页，尚未按原站逐段验收） |
| [/Glove Box Dampers/](https://www.chinateao.com/Glove%20Box%20Dampers/) | 栏目/基础页 | 200 | 空气阻尼器 | 尚未承接；样板中的链接仍指向线上原址 |
| [/Glove Box Dampers/air-damper-rd-v118.html](https://www.chinateao.com/Glove%20Box%20Dampers/air-damper-rd-v118.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/Glove Box Dampers/axial-barrel-damper-rd-v108a.html](https://www.chinateao.com/Glove%20Box%20Dampers/axial-barrel-damper-rd-v108a.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/Glove Box Dampers/gear-rotary-vane-damper-RD-V127.html](https://www.chinateao.com/Glove%20Box%20Dampers/gear-rotary-vane-damper-RD-V127.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/Glove Box Dampers/index_2.html](https://www.chinateao.com/Glove%20Box%20Dampers/index_2.html) | 分页 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/Glove Box Dampers/liner-damper- RD-V126.html](https://www.chinateao.com/Glove%20Box%20Dampers/liner-damper-%20RD-V126.html) | 详情 | 200 | 汽车扶手箱 RD-V126适用于汽车扶手箱 | 尚未承接；样板中的链接仍指向线上原址 |
| [/Glove Box Dampers/liner-damper- RD-V128.html](https://www.chinateao.com/Glove%20Box%20Dampers/liner-damper-%20RD-V128.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/Glove Box Dampers/liner-damper- RD-V129.html](https://www.chinateao.com/Glove%20Box%20Dampers/liner-damper-%20RD-V129.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/Glove Box Dampers/organizer- RD-T180.html](https://www.chinateao.com/Glove%20Box%20Dampers/organizer-%20RD-T180.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/Glove Box Dampers/organizer- RD-T180A.html](https://www.chinateao.com/Glove%20Box%20Dampers/organizer-%20RD-T180A.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/Glove Box Dampers/organizer-rd-t181.html](https://www.chinateao.com/Glove%20Box%20Dampers/organizer-rd-t181.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/Glove Box Dampers/rd-V130-shiyongyuqicheshoutaoxiang-shounahe.html](https://www.chinateao.com/Glove%20Box%20Dampers/rd-V130-shiyongyuqicheshoutaoxiang-shounahe.html) | 详情 | 200 | Sale RD-V130 适用于汽车手套箱、 收纳盒 | 尚未承接；样板中的链接仍指向线上原址 |
| [/Glove Box Dampers/rd-t183shiyongyuqichezawuxiangsuojigouqichefushouxiang.html](https://www.chinateao.com/Glove%20Box%20Dampers/rd-t183shiyongyuqichezawuxiangsuojigouqichefushouxiang.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/Glove Box Dampers/rd-v107shiyongyujiadianneishizuniqiqicheshoutaoxiangqicheshounahe.html](https://www.chinateao.com/Glove%20Box%20Dampers/rd-v107shiyongyujiadianneishizuniqiqicheshoutaoxiangqicheshounahe.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/Glove Box Dampers/rd-v127-shiyongyuqicheshoutaoxiang-shounahe.html](https://www.chinateao.com/Glove%20Box%20Dampers/rd-v127-shiyongyuqicheshoutaoxiang-shounahe.html) | 详情 | 200 | RD-V127 适用于汽车手套箱、 收纳盒 Wholesale | 尚未承接；样板中的链接仍指向线上原址 |
| [/about-us/](https://www.chinateao.com/about-us/) | 栏目/基础页 | 200 | 关于我们 - 特澳阻尼器 | 未承接原址；可复用 src/app/about/page.tsx |
| [/air-damper-china/](https://www.chinateao.com/air-damper-china/) | 栏目/基础页 | 200 | 空气阻尼器 | 尚未承接；样板中的链接仍指向线上原址 |
| [/air-dampers/](https://www.chinateao.com/air-dampers/) | 栏目/基础页 | 200 | 空气阻尼器 | 尚未承接；样板中的链接仍指向线上原址 |
| [/air-dampers/air-damper-rd-v108.html](https://www.chinateao.com/air-dampers/air-damper-rd-v108.html) | 详情 | 200 | 齿条阻尼器 线性阻尼器 阻尼齿轮 RD-V108 汽车手套箱 收纳盒 | 尚未承接；样板中的链接仍指向线上原址 |
| [/air-dampers/air-damper-rd-v109.html](https://www.chinateao.com/air-dampers/air-damper-rd-v109.html) | 详情 | 200 | 线性 空气拉绳阻尼RD-V109广泛适用汽车内饰 | 尚未承接；样板中的链接仍指向线上原址 |
| [/air-dampers/air-damper-rd-v118.html](https://www.chinateao.com/air-dampers/air-damper-rd-v118.html) | 详情 | 200 | 空气阻尼器 汽车扶手箱阻尼器 RD-V118 | 尚未承接；样板中的链接仍指向线上原址 |
| [/air-dampers/axial-barrel-damper-rd-v08.html](https://www.chinateao.com/air-dampers/axial-barrel-damper-rd-v08.html) | 详情 | 200 | 汽车阻尼器 阻尼轮 阻尼齿轮 RD-V088适用于汽车扶手箱、汽车杂物箱 | 尚未承接；样板中的链接仍指向线上原址 |
| [/air-dampers/axial-barrel-damper-rd-v108a.html](https://www.chinateao.com/air-dampers/axial-barrel-damper-rd-v108a.html) | 详情 | 200 | 汽车阻尼器 阻尼轮 阻尼齿轮  RD-V108A 家电 内饰阻尼器 | 尚未承接；样板中的链接仍指向线上原址 |
| [/applications/](https://www.chinateao.com/applications/) | 栏目/基础页 | 200 | 汽车眼镜盒阻尼器厂家 | 尚未承接；样板中的链接仍指向线上原址 |
| [/applications/automotive-interior/](https://www.chinateao.com/applications/automotive-interior/) | 栏目/基础页 | 200 | 汽车内外饰 | 尚未承接；样板中的链接仍指向线上原址 |
| [/applications/automotive-interior/external/](https://www.chinateao.com/applications/automotive-interior/external/) | 栏目/基础页 | 200 | 外饰 | 尚未承接；样板中的链接仍指向线上原址 |
| [/applications/automotive-interior/index_2.html](https://www.chinateao.com/applications/automotive-interior/index_2.html) | 分页 | 200 | 汽车内外饰 | 尚未承接；样板中的链接仍指向线上原址 |
| [/applications/automotive-interior/internal/](https://www.chinateao.com/applications/automotive-interior/internal/) | 栏目/基础页 | 200 | 内饰 | 尚未承接；样板中的链接仍指向线上原址 |
| [/applications/home-life/](https://www.chinateao.com/applications/home-life/) | 栏目/基础页 | 200 | 家居 | 尚未承接；样板中的链接仍指向线上原址 |
| [/applications/index_2.html](https://www.chinateao.com/applications/index_2.html) | 分页 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/applications/index_3.html](https://www.chinateao.com/applications/index_3.html) | 分页 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/applications/industrial-application/](https://www.chinateao.com/applications/industrial-application/) | 栏目/基础页 | 200 | 工业设备 | 尚未承接；样板中的链接仍指向线上原址 |
| [/applications/office-equipment/](https://www.chinateao.com/applications/office-equipment/) | 栏目/基础页 | 200 | 办公设备 | 尚未承接；样板中的链接仍指向线上原址 |
| [/axial-damper-china/](https://www.chinateao.com/axial-damper-china/) | 栏目/基础页 | 200 | 圆筒阻尼器 | 尚未承接；样板中的链接仍指向线上原址 |
| [/axial-dampers/](https://www.chinateao.com/axial-dampers/) | 栏目/基础页 | 200 | 圆筒阻尼器 | 尚未承接；样板中的链接仍指向线上原址 |
| [/axial-dampers/圆桶 齿轮 轴阻尼器  RD-T013C汽车内饰、家用电器、工业机械、车顶把手、吸尘器扫.html](https://www.chinateao.com/axial-dampers/%E5%9C%86%E6%A1%B6%20%E9%BD%BF%E8%BD%AE%20%E8%BD%B4%E9%98%BB%E5%B0%BC%E5%99%A8%20%20RD-T013C%E6%B1%BD%E8%BD%A6%E5%86%85%E9%A5%B0%E3%80%81%E5%AE%B6%E7%94%A8%E7%94%B5%E5%99%A8%E3%80%81%E5%B7%A5%E4%B8%9A%E6%9C%BA%E6%A2%B0%E3%80%81%E8%BD%A6%E9%A1%B6%E6%8A%8A%E6%89%8B%E3%80%81%E5%90%B8%E5%B0%98%E5%99%A8%E6%89%AB.html) | 详情 | 200 | 圆桶 齿轮 轴阻尼器  RD-T013C汽车内饰、家用电器、工业机械、车顶把手、吸尘器扫 | 尚未承接；样板中的链接仍指向线上原址 |
| [/axial-dampers/圆桶 齿轮 轴阻尼器  RD-T013D扫地机器人、安全拉手、汽车内饰、家用电器、工业机械、车顶把手、吸尘器扫地机器人、安全拉手.html](https://www.chinateao.com/axial-dampers/%E5%9C%86%E6%A1%B6%20%E9%BD%BF%E8%BD%AE%20%E8%BD%B4%E9%98%BB%E5%B0%BC%E5%99%A8%20%20RD-T013D%E6%89%AB%E5%9C%B0%E6%9C%BA%E5%99%A8%E4%BA%BA%E3%80%81%E5%AE%89%E5%85%A8%E6%8B%89%E6%89%8B%E3%80%81%E6%B1%BD%E8%BD%A6%E5%86%85%E9%A5%B0%E3%80%81%E5%AE%B6%E7%94%A8%E7%94%B5%E5%99%A8%E3%80%81%E5%B7%A5%E4%B8%9A%E6%9C%BA%E6%A2%B0%E3%80%81%E8%BD%A6%E9%A1%B6%E6%8A%8A%E6%89%8B%E3%80%81%E5%90%B8%E5%B0%98%E5%99%A8%E6%89%AB%E5%9C%B0%E6%9C%BA%E5%99%A8%E4%BA%BA%E3%80%81%E5%AE%89%E5%85%A8%E6%8B%89%E6%89%8B.html) | 详情 | 200 | 圆桶 齿轮 轴阻尼器  RD-T013D汽车内饰、家用电器、工业机械、车顶把手、吸尘器扫 | 尚未承接；样板中的链接仍指向线上原址 |
| [/axial-dampers/圆桶 齿轮 轴阻尼器  RD-T013D汽车内饰、家用电器、工业机械、车顶把手、吸尘器扫.html](https://www.chinateao.com/axial-dampers/%E5%9C%86%E6%A1%B6%20%E9%BD%BF%E8%BD%AE%20%E8%BD%B4%E9%98%BB%E5%B0%BC%E5%99%A8%20%20RD-T013D%E6%B1%BD%E8%BD%A6%E5%86%85%E9%A5%B0%E3%80%81%E5%AE%B6%E7%94%A8%E7%94%B5%E5%99%A8%E3%80%81%E5%B7%A5%E4%B8%9A%E6%9C%BA%E6%A2%B0%E3%80%81%E8%BD%A6%E9%A1%B6%E6%8A%8A%E6%89%8B%E3%80%81%E5%90%B8%E5%B0%98%E5%99%A8%E6%89%AB.html) | 详情 | 200 | 圆桶 齿轮 轴阻尼器  RD-T013D汽车内饰、家用电器、工业机械、车顶把手、吸尘器扫 | 尚未承接；样板中的链接仍指向线上原址 |
| [/axial-dampers/圆桶齿轮轴阻尼器  RD-T020扫地机器人、安全拉手、汽车内饰、家用电器、工业机械、车顶把手、吸尘器扫地机器人、安全拉手.html](https://www.chinateao.com/axial-dampers/%E5%9C%86%E6%A1%B6%E9%BD%BF%E8%BD%AE%E8%BD%B4%E9%98%BB%E5%B0%BC%E5%99%A8%20%20RD-T020%E6%89%AB%E5%9C%B0%E6%9C%BA%E5%99%A8%E4%BA%BA%E3%80%81%E5%AE%89%E5%85%A8%E6%8B%89%E6%89%8B%E3%80%81%E6%B1%BD%E8%BD%A6%E5%86%85%E9%A5%B0%E3%80%81%E5%AE%B6%E7%94%A8%E7%94%B5%E5%99%A8%E3%80%81%E5%B7%A5%E4%B8%9A%E6%9C%BA%E6%A2%B0%E3%80%81%E8%BD%A6%E9%A1%B6%E6%8A%8A%E6%89%8B%E3%80%81%E5%90%B8%E5%B0%98%E5%99%A8%E6%89%AB%E5%9C%B0%E6%9C%BA%E5%99%A8%E4%BA%BA%E3%80%81%E5%AE%89%E5%85%A8%E6%8B%89%E6%89%8B.html) | 详情 | 200 | 圆桶齿轮轴阻尼器  RD-T020汽车内饰、家用电器、工业机械、车顶把手、吸尘器扫 | 尚未承接；样板中的链接仍指向线上原址 |
| [/axial-dampers/RD-T138适用于衣帽钩、 扫地机器人、汽车阻尼器、家用电器.html](https://www.chinateao.com/axial-dampers/RD-T138%E9%80%82%E7%94%A8%E4%BA%8E%E8%A1%A3%E5%B8%BD%E9%92%A9%E3%80%81%20%E6%89%AB%E5%9C%B0%E6%9C%BA%E5%99%A8%E4%BA%BA%E3%80%81%E6%B1%BD%E8%BD%A6%E9%98%BB%E5%B0%BC%E5%99%A8%E3%80%81%E5%AE%B6%E7%94%A8%E7%94%B5%E5%99%A8.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/axial-dampers/axial-barrel-damper- RD-T138.html](https://www.chinateao.com/axial-dampers/axial-barrel-damper-%20RD-T138.html) | 详情 | 200 | China Axial/Barrel Damper RD-T138适用于衣帽钩、 扫地机器人、汽车阻尼器、家用电器 | 尚未承接；样板中的链接仍指向线上原址 |
| [/axial-dampers/axial-barrel-damper-RD-R018.html](https://www.chinateao.com/axial-dampers/axial-barrel-damper-RD-R018.html) | 详情 | 200 | RD-R018 适用于汽车内饰、家用电器、工业机械、车顶把手、吸尘器 | 尚未承接；样板中的链接仍指向线上原址 |
| [/axial-dampers/axial-barrel-damper-RD-T012E.html](https://www.chinateao.com/axial-dampers/axial-barrel-damper-RD-T012E.html) | 详情 | 200 | 圆筒阻尼器 RD-T012E适用于汽车内饰衣帽钩、中控扶手、咖啡机、家电、汽车阻尼器 | 尚未承接；样板中的链接仍指向线上原址 |
| [/axial-dampers/axial-barrel-damper-RD-T013B.html](https://www.chinateao.com/axial-dampers/axial-barrel-damper-RD-T013B.html) | 详情 | 200 | 圆桶 齿轮 轴阻尼器  RD-T013B汽车内饰、家用电器、工业机械、车顶把手、吸尘器扫 | 尚未承接；样板中的链接仍指向线上原址 |
| [/axial-dampers/axial-barrel-damper-RD-T017.html](https://www.chinateao.com/axial-dampers/axial-barrel-damper-RD-T017.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/axial-dampers/axial-barrel-damper-rd-r018.html](https://www.chinateao.com/axial-dampers/axial-barrel-damper-rd-r018.html) | 详情 | 404 | 旋转阻尼器_齿轮阻尼器_汽车内饰缓冲_东莞市特澳电子科技有限公司 | 尚未承接；样板中的链接仍指向线上原址 |
| [/axial-dampers/axial-barrel-damper-rd-t012c.html](https://www.chinateao.com/axial-dampers/axial-barrel-damper-rd-t012c.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/axial-dampers/axial-barrel-damper-rd-t012d.html](https://www.chinateao.com/axial-dampers/axial-barrel-damper-rd-t012d.html) | 详情 | 200 | 齿轮 轴阻尼器 RD-T012D  广泛适用于汽车内饰、中控扶手、咖啡机、汽车内饰、家用 | 尚未承接；样板中的链接仍指向线上原址 |
| [/axial-dampers/axial-barrel-damper-rd-t013b.html](https://www.chinateao.com/axial-dampers/axial-barrel-damper-rd-t013b.html) | 详情 | 404 | 旋转阻尼器_齿轮阻尼器_汽车内饰缓冲_东莞市特澳电子科技有限公司 | 尚未承接；样板中的链接仍指向线上原址 |
| [/axial-dampers/axial-barrel-damper-rd-t017.html](https://www.chinateao.com/axial-dampers/axial-barrel-damper-rd-t017.html) | 详情 | 404 | 旋转阻尼器_齿轮阻尼器_汽车内饰缓冲_东莞市特澳电子科技有限公司 | 尚未承接；样板中的链接仍指向线上原址 |
| [/axial-dampers/axial-barrel-damper-rd-t138.html](https://www.chinateao.com/axial-dampers/axial-barrel-damper-rd-t138.html) | 详情 | 404 | 旋转阻尼器_齿轮阻尼器_汽车内饰缓冲_东莞市特澳电子科技有限公司 | 尚未承接；样板中的链接仍指向线上原址 |
| [/axial-dampers/axial-barrel-damper-rd-v088.html](https://www.chinateao.com/axial-dampers/axial-barrel-damper-rd-v088.html) | 详情 | 404 | 旋转阻尼器_齿轮阻尼器_汽车内饰缓冲_东莞市特澳电子科技有限公司 | 尚未承接；样板中的链接仍指向线上原址 |
| [/axial-dampers/index_2.html](https://www.chinateao.com/axial-dampers/index_2.html) | 分页 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/axial-dampers/rd-t013ashiyongyuqicheneishijiayongdianqigongyejixiechedingbashouxichenqisaodijiqirenanquanlashou.html](https://www.chinateao.com/axial-dampers/rd-t013ashiyongyuqicheneishijiayongdianqigongyejixiechedingbashouxichenqisaodijiqirenanquanlashou.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/axial-dampers/rd-v088tongzhouxinshiyongyumatongzuniqizhinengweiyu.html](https://www.chinateao.com/axial-dampers/rd-v088tongzhouxinshiyongyumatongzuniqizhinengweiyu.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/axial-dampers/rd-v088wutongzhouxinshiyongyumatongzuniqizhinengweiyu.html](https://www.chinateao.com/axial-dampers/rd-v088wutongzhouxinshiyongyumatongzuniqizhinengweiyu.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/brochures/](https://www.chinateao.com/brochures/) | 栏目/基础页 | 200 | 齿条阻尼器厂家 | 尚未承接；样板中的链接仍指向线上原址 |
| [/contacts/](https://www.chinateao.com/contacts/) | 栏目/基础页 | 403 | 未读取 | 未承接原址；可复用 src/app/contact/page.tsx，表单未接通 |
| [/convert/](https://www.chinateao.com/convert/) | 扭矩工具 | 200 | 扭矩换算 | 尚未承接；样板中的链接仍指向线上原址 |
| [/external/20.html](https://www.chinateao.com/external/20.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/external/dongzuoteaozuniqiqichechongdiankoudechuangxinshouhuzhe.html](https://www.chinateao.com/external/dongzuoteaozuniqiqichechongdiankoudechuangxinshouhuzhe.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/faq/](https://www.chinateao.com/faq/) | 栏目/基础页 | 200 | 汽车中控扶手箱阻尼器厂家 | 尚未承接；样板中的链接仍指向线上原址 |
| [/gear-damper-china/](https://www.chinateao.com/gear-damper-china/) | 栏目/基础页 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/gear-damper/](https://www.chinateao.com/gear-damper/) | 栏目/基础页 | 403；有早期 HTML | 齿轮阻尼器 | src/app/[...legacyPath]/page.tsx → CategoryPage（本次样板，第 1 页） |
| [/gear-damper/齿轮阻尼器RD-T021适用于眼镜盒、杯托、家电、智能锁.html](https://www.chinateao.com/gear-damper/%E9%BD%BF%E8%BD%AE%E9%98%BB%E5%B0%BC%E5%99%A8RD-T021%E9%80%82%E7%94%A8%E4%BA%8E%E7%9C%BC%E9%95%9C%E7%9B%92%E3%80%81%E6%9D%AF%E6%89%98%E3%80%81%E5%AE%B6%E7%94%B5%E3%80%81%E6%99%BA%E8%83%BD%E9%94%81.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/gear-damper/gear-rotary-damper- RD-T038A/V038A.html](https://www.chinateao.com/gear-damper/gear-rotary-damper-%20RD-T038A/V038A.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/gear-damper/gear-rotary-damper-rd-t038-v038.html](https://www.chinateao.com/gear-damper/gear-rotary-damper-rd-t038-v038.html) | 详情 | 200 | 齿轮 旋转缓冲器 RD-T038/ RD-v038双向适用于汽车内饰、家用电器、工业机械 | src/app/[...legacyPath]/page.tsx → ProductDetail（本次样板） |
| [/gear-damper/gear-rotary-damper-rd-t068-v068.html](https://www.chinateao.com/gear-damper/gear-rotary-damper-rd-t068-v068.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/gear-damper/index_2.html](https://www.chinateao.com/gear-damper/index_2.html) | 分页 | 未请求 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/gear-damper/index_3.html](https://www.chinateao.com/gear-damper/index_3.html) | 分页 | 未请求 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/gear-damper/rd--t019shiyongqichedianyanqiqicheyanjinghe-neishidianqiqichefangai-jiayongdianqi-gongyejixie.html](https://www.chinateao.com/gear-damper/rd--t019shiyongqichedianyanqiqicheyanjinghe-neishidianqiqichefangai-jiayongdianqi-gongyejixie.html) | 详情 | 未请求 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/gear-damper/rd-10guangfanshiyongyuqicheneishijiayongdianqi-gongyejixiekafeijidayinji.html](https://www.chinateao.com/gear-damper/rd-10guangfanshiyongyuqicheneishijiayongdianqi-gongyejixiekafeijidayinji.html) | 详情 | 未请求 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/gear-damper/rd-t015b-shiyongqicheneishi-jiayongdianqi-gongyejixie.html](https://www.chinateao.com/gear-damper/rd-t015b-shiyongqicheneishi-jiayongdianqi-gongyejixie.html) | 详情 | 未请求 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/gear-damper/rd-t025guangfanshiyongyuqicheneishijiayongdianqi-gongyejixiekafeijidayinji.html](https://www.chinateao.com/gear-damper/rd-t025guangfanshiyongyuqicheneishijiayongdianqi-gongyejixiekafeijidayinji.html) | 详情 | 未请求 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/gear-damper/rd-t029-shiyongqicheneishi-jiayongdianqi-gongyejixie.html](https://www.chinateao.com/gear-damper/rd-t029-shiyongqicheneishi-jiayongdianqi-gongyejixie.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/gear-damper/rd-t036-shiyongyuqicheneishijiayongdianqigongyejixie.html](https://www.chinateao.com/gear-damper/rd-t036-shiyongyuqicheneishijiayongdianqigongyejixie.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/gear-damper/rd-t040shiyongyuqichezuniqijiadianzuniqiqicheyongsuliaozunichilun-jianzhenzuniqi-shuangxiangsuliaozhuanlunsujiaozongchengjianhuanchongqi.html](https://www.chinateao.com/gear-damper/rd-t040shiyongyuqichezuniqijiadianzuniqiqicheyongsuliaozunichilun-jianzhenzuniqi-shuangxiangsuliaozhuanlunsujiaozongchengjianhuanchongqi.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/gear-damper/rd-t069-rd-v069shuangxiang-shiyongyuqicheneishijiayongdianqigongyejixieRD-T069/ RD-V069双向 适用于汽车内饰、家用电器、工业机械.html](https://www.chinateao.com/gear-damper/rd-t069-rd-v069shuangxiang-shiyongyuqicheneishijiayongdianqigongyejixieRD-T069/%20RD-V069%E5%8F%8C%E5%90%91%20%E9%80%82%E7%94%A8%E4%BA%8E%E6%B1%BD%E8%BD%A6%E5%86%85%E9%A5%B0%E3%80%81%E5%AE%B6%E7%94%A8%E7%94%B5%E5%99%A8%E3%80%81%E5%B7%A5%E4%B8%9A%E6%9C%BA%E6%A2%B0.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/home-life/dongzuoteaosuokouzaixiyijifangchenwangdechuangxinyingyong.html](https://www.chinateao.com/home-life/dongzuoteaosuokouzaixiyijifangchenwangdechuangxinyingyong.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/home-life/dongzuoteaozuniqizaixiyijishanggaidechuangxinyingyong.html](https://www.chinateao.com/home-life/dongzuoteaozuniqizaixiyijishanggaidechuangxinyingyong.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/index.php/Content/Pagedis/lists/id/15/catid/6/hcatid/15.html](https://www.chinateao.com/index.php/Content/Pagedis/lists/id/15/catid/6/hcatid/15.html) | 历史 PHP 路由/标签/搜索 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/index.php/Content/Pagedis/lists/id/17/catid/6/hcatid/17.html](https://www.chinateao.com/index.php/Content/Pagedis/lists/id/17/catid/6/hcatid/17.html) | 历史 PHP 路由/标签/搜索 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/index.php/Content/Pagedis/lists/id/18/catid/6/hcatid/18.html](https://www.chinateao.com/index.php/Content/Pagedis/lists/id/18/catid/6/hcatid/18.html) | 历史 PHP 路由/标签/搜索 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/index.php/Content/Pagedis/lists/id/19/catid/6/hcatid/19.html](https://www.chinateao.com/index.php/Content/Pagedis/lists/id/19/catid/6/hcatid/19.html) | 历史 PHP 路由/标签/搜索 | 200 | 联系我们_东莞市特澳电子科技有限公司 | 尚未承接；样板中的链接仍指向线上原址 |
| [/index.php/Content/Pagedis/lists/id/33/catid/6/hcatid/33.html](https://www.chinateao.com/index.php/Content/Pagedis/lists/id/33/catid/6/hcatid/33.html) | 历史 PHP 路由/标签/搜索 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/index.php/Content/Pagedis/lists/id/35/catid/6/hcatid/35.html](https://www.chinateao.com/index.php/Content/Pagedis/lists/id/35/catid/6/hcatid/35.html) | 历史 PHP 路由/标签/搜索 | 200 | 联系我们_东莞市特澳电子科技有限公司 | 尚未承接；样板中的链接仍指向线上原址 |
| [/index.php/Content/Pagedis/lists/id/37/catid/6/hcatid/37.html](https://www.chinateao.com/index.php/Content/Pagedis/lists/id/37/catid/6/hcatid/37.html) | 历史 PHP 路由/标签/搜索 | 200 | 联系我们_东莞市特澳电子科技有限公司 | 尚未承接；样板中的链接仍指向线上原址 |
| [/index.php/Content/Pagedis/lists/id/42/catid/6/hcatid/42.html](https://www.chinateao.com/index.php/Content/Pagedis/lists/id/42/catid/6/hcatid/42.html) | 历史 PHP 路由/标签/搜索 | 200 | 联系我们_东莞市特澳电子科技有限公司 | 尚未承接；样板中的链接仍指向线上原址 |
| [/index.php/Content/Pagedis/lists/id/44/catid/6/hcatid/44.html](https://www.chinateao.com/index.php/Content/Pagedis/lists/id/44/catid/6/hcatid/44.html) | 历史 PHP 路由/标签/搜索 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/index.php/Content/Pagedis/lists/id/47/catid/6/hcatid/47.html](https://www.chinateao.com/index.php/Content/Pagedis/lists/id/47/catid/6/hcatid/47.html) | 历史 PHP 路由/标签/搜索 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/index.php/Content/Pagedis/lists/id/48/catid/6/hcatid/48.html](https://www.chinateao.com/index.php/Content/Pagedis/lists/id/48/catid/6/hcatid/48.html) | 历史 PHP 路由/标签/搜索 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/index.php/Content/Pagedis/lists/id/6/catid/6/hcatid/6.html](https://www.chinateao.com/index.php/Content/Pagedis/lists/id/6/catid/6/hcatid/6.html) | 历史 PHP 路由/标签/搜索 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/index.php/Content/Pagedis/lists/id/73/catid/6/hcatid/73.html](https://www.chinateao.com/index.php/Content/Pagedis/lists/id/73/catid/6/hcatid/73.html) | 历史 PHP 路由/标签/搜索 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/index.php/Content/Pagedis/lists/id/75/catid/6/hcatid/75.html](https://www.chinateao.com/index.php/Content/Pagedis/lists/id/75/catid/6/hcatid/75.html) | 历史 PHP 路由/标签/搜索 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/index.php/Content/Pagedis/lists/id/77/catid/6/hcatid/77.html](https://www.chinateao.com/index.php/Content/Pagedis/lists/id/77/catid/6/hcatid/77.html) | 历史 PHP 路由/标签/搜索 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/index.php/Content/Pagedis/lists/id/78/catid/6/hcatid/78.html](https://www.chinateao.com/index.php/Content/Pagedis/lists/id/78/catid/6/hcatid/78.html) | 历史 PHP 路由/标签/搜索 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/index.php/Content/Pagedis/lists/id/79/catid/6/hcatid/79.html](https://www.chinateao.com/index.php/Content/Pagedis/lists/id/79/catid/6/hcatid/79.html) | 历史 PHP 路由/标签/搜索 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/index.php/Content/Pagedis/lists/id/80/catid/6/hcatid/80.html](https://www.chinateao.com/index.php/Content/Pagedis/lists/id/80/catid/6/hcatid/80.html) | 历史 PHP 路由/标签/搜索 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/index.php/Content/Pagedis/lists/id/81/catid/6/hcatid/81.html](https://www.chinateao.com/index.php/Content/Pagedis/lists/id/81/catid/6/hcatid/81.html) | 历史 PHP 路由/标签/搜索 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/index.php/Search/Index/index.html](https://www.chinateao.com/index.php/Search/Index/index.html) | 历史 PHP 路由/标签/搜索 | 未请求 | 站内搜索（GET 表单，参数 q） | 尚未承接；样板中的链接仍指向线上原址 |
| [/index.php/products/anquanlashou.html](https://www.chinateao.com/index.php/products/anquanlashou.html) | 历史 PHP 路由/标签/搜索 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/index.php/products/axial-dampers.html](https://www.chinateao.com/index.php/products/axial-dampers.html) | 历史 PHP 路由/标签/搜索 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/index.php/products/chilunzuniqi.html](https://www.chinateao.com/index.php/products/chilunzuniqi.html) | 历史 PHP 路由/标签/搜索 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/index.php/products/chitiaozuniqi.html](https://www.chinateao.com/index.php/products/chitiaozuniqi.html) | 历史 PHP 路由/标签/搜索 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/index.php/products/fushouxiangzuniqi.html](https://www.chinateao.com/index.php/products/fushouxiangzuniqi.html) | 历史 PHP 路由/标签/搜索 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/index.php/products/gear-damper.html](https://www.chinateao.com/index.php/products/gear-damper.html) | 历史 PHP 路由/标签/搜索 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/index.php/products/huanchongqi.html](https://www.chinateao.com/index.php/products/huanchongqi.html) | 历史 PHP 路由/标签/搜索 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/index.php/products/jiadianzuniqi.html](https://www.chinateao.com/index.php/products/jiadianzuniqi.html) | 历史 PHP 路由/标签/搜索 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/index.php/products/jianzhenzuniqi.html](https://www.chinateao.com/index.php/products/jianzhenzuniqi.html) | 历史 PHP 路由/标签/搜索 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/index.php/products/kongqizuniqi-qichefushouxiangzuniqi-rd-v118.html](https://www.chinateao.com/index.php/products/kongqizuniqi-qichefushouxiangzuniqi-rd-v118.html) | 历史 PHP 路由/标签/搜索 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/index.php/products/kongqizuniqi.html](https://www.chinateao.com/index.php/products/kongqizuniqi.html) | 历史 PHP 路由/标签/搜索 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/index.php/products/neishizuniqi.html](https://www.chinateao.com/index.php/products/neishizuniqi.html) | 历史 PHP 路由/标签/搜索 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/index.php/products/qichebashoutaohuanchongqi.html](https://www.chinateao.com/index.php/products/qichebashoutaohuanchongqi.html) | 历史 PHP 路由/标签/搜索 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/index.php/products/qichedingpenglashou.html](https://www.chinateao.com/index.php/products/qichedingpenglashou.html) | 历史 PHP 路由/标签/搜索 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/index.php/products/qichefushouxiang.html](https://www.chinateao.com/index.php/products/qichefushouxiang.html) | 历史 PHP 路由/标签/搜索 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/index.php/products/qichefushouxiangzuniqi.html](https://www.chinateao.com/index.php/products/qichefushouxiangzuniqi.html) | 历史 PHP 路由/标签/搜索 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/index.php/products/qicheneimenba.html](https://www.chinateao.com/index.php/products/qicheneimenba.html) | 历史 PHP 路由/标签/搜索 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/index.php/products/qicheshoutaoxiang.html](https://www.chinateao.com/index.php/products/qicheshoutaoxiang.html) | 历史 PHP 路由/标签/搜索 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/index.php/products/qichezuniqi.html](https://www.chinateao.com/index.php/products/qichezuniqi.html) | 历史 PHP 路由/标签/搜索 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/index.php/products/saodijiqiren.html](https://www.chinateao.com/index.php/products/saodijiqiren.html) | 历史 PHP 路由/标签/搜索 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/index.php/products/shounahe.html](https://www.chinateao.com/index.php/products/shounahe.html) | 历史 PHP 路由/标签/搜索 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/index.php/products/xianxingzuniqi.html](https://www.chinateao.com/index.php/products/xianxingzuniqi.html) | 历史 PHP 路由/标签/搜索 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/index.php/products/xuanzhuanzuniqi.html](https://www.chinateao.com/index.php/products/xuanzhuanzuniqi.html) | 历史 PHP 路由/标签/搜索 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/index.php/products/yuantongzuniqi.html](https://www.chinateao.com/index.php/products/yuantongzuniqi.html) | 历史 PHP 路由/标签/搜索 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/index.php/products/zhouzuniqi.html](https://www.chinateao.com/index.php/products/zhouzuniqi.html) | 历史 PHP 路由/标签/搜索 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/index.php/products/zunichilun.html](https://www.chinateao.com/index.php/products/zunichilun.html) | 历史 PHP 路由/标签/搜索 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/index.php/products/zunilun.html](https://www.chinateao.com/index.php/products/zunilun.html) | 历史 PHP 路由/标签/搜索 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/index.php/products/zuniqi.html](https://www.chinateao.com/index.php/products/zuniqi.html) | 历史 PHP 路由/标签/搜索 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/internal/air-dampers-in-automotive-interior-glove-compartments.html](https://www.chinateao.com/internal/air-dampers-in-automotive-interior-glove-compartments.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/internal/application-of-gear-dampers-in-automotive.html](https://www.chinateao.com/internal/application-of-gear-dampers-in-automotive.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/internal/axial-dampers-in-automotive-interior-safety-handles.html](https://www.chinateao.com/internal/axial-dampers-in-automotive-interior-safety-handles.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/internal/beituozaiqicheneishideyingyong.html](https://www.chinateao.com/internal/beituozaiqicheneishideyingyong.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/internal/kongqilaganzunizaiqicheneishishoutaoxiangdeyingyong.html](https://www.chinateao.com/internal/kongqilaganzunizaiqicheneishishoutaoxiangdeyingyong.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/internal/yimaogouzaiqicheneishidezuoyong.html](https://www.chinateao.com/internal/yimaogouzaiqicheneishidezuoyong.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/internal/zunichilunzaiqicheneishiyanjinghedeyingyong.html](https://www.chinateao.com/internal/zunichilunzaiqicheneishiyanjinghedeyingyong.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/latch-china/](https://www.chinateao.com/latch-china/) | 栏目/基础页 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/latches/](https://www.chinateao.com/latches/) | 栏目/基础页 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/latches/rd-09wushengsuokoumensuo-shiyongyuqicheneishi-jiayongdianqigongyejixie.html](https://www.chinateao.com/latches/rd-09wushengsuokoumensuo-shiyongyuqicheneishi-jiayongdianqigongyejixie.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/liner-damper-china/](https://www.chinateao.com/liner-damper-china/) | 栏目/基础页 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/liner-dampers/](https://www.chinateao.com/liner-dampers/) | 栏目/基础页 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/liner-dampers/gear-rotary-vane-damper-rd-v127.html](https://www.chinateao.com/liner-dampers/gear-rotary-vane-damper-rd-v127.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/liner-dampers/liner-damper-rd-v126.html](https://www.chinateao.com/liner-dampers/liner-damper-rd-v126.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/news/](https://www.chinateao.com/news/) | 栏目/基础页 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/news/congmojudaochengpincong---40dao-90teaokeji-jingmizhizaodeyingheshili.html](https://www.chinateao.com/news/congmojudaochengpincong---40dao-90teaokeji-jingmizhizaodeyingheshili.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/news/guanyudongzuoshiteaodianzikejiyouxiangongsi.html](https://www.chinateao.com/news/guanyudongzuoshiteaodianzikejiyouxiangongsi.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/news/pioneering-green-innovation-in-the-automotive.html](https://www.chinateao.com/news/pioneering-green-innovation-in-the-automotive.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/news/teao-electronic-technology-co-ltd.html](https://www.chinateao.com/news/teao-electronic-technology-co-ltd.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/news/teaodianzikejichaoshengbohanjieyizhenweirongzhujiuqianggulianjie.html](https://www.chinateao.com/news/teaodianzikejichaoshengbohanjieyizhenweirongzhujiuqianggulianjie.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/news/teaokeji11-tiaoquanzidongzhusushengchanxian-yinghechannengzhulaopinzhigenji.html](https://www.chinateao.com/news/teaokeji11-tiaoquanzidongzhusushengchanxian-yinghechannengzhulaopinzhigenji.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/news/teaokejiwaiguan-niuli-100-quanjian.html](https://www.chinateao.com/news/teaokejiwaiguan-niuli-100-quanjian.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/news/teaokejizhouhuijiyaopinzhishizhongshidiyiyaowu.html](https://www.chinateao.com/news/teaokejizhouhuijiyaopinzhishizhongshidiyiyaowu.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/office-equipment/dongzuoteaozuniqidayinjishanggaidechuangxinshengji.html](https://www.chinateao.com/office-equipment/dongzuoteaozuniqidayinjishanggaidechuangxinshengji.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/office-equipment/dongzuoteaozuniqilajitongshangdechuangxinbiange.html](https://www.chinateao.com/office-equipment/dongzuoteaozuniqilajitongshangdechuangxinbiange.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/office-equipment/zuniqizaidayinjishangmiandezuoyong.html](https://www.chinateao.com/office-equipment/zuniqizaidayinjishangmiandezuoyong.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/organizer-china/](https://www.chinateao.com/organizer-china/) | 栏目/基础页 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/products/](https://www.chinateao.com/products/) | 栏目/基础页 | 403 | 未读取 | src/app/products/page.tsx（现有 5 个开发产品，尚未承接线上目录） |
| [/qitaqichelingbujian/](https://www.chinateao.com/qitaqichelingbujian/) | 栏目/基础页 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/qitaqichelingbujian/rd-v112.html](https://www.chinateao.com/qitaqichelingbujian/rd-v112.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/quality-control/](https://www.chinateao.com/quality-control/) | 栏目/基础页 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/support/](https://www.chinateao.com/support/) | 栏目/基础页 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/synchronizers/](https://www.chinateao.com/synchronizers/) | 栏目/基础页 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/synchronizers/organizer-rd-t181.html](https://www.chinateao.com/synchronizers/organizer-rd-t181.html) | 详情 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/zh-hans/torque/centimetre-kilogram-force.html](https://www.chinateao.com/zh-hans/torque/centimetre-kilogram-force.html) | 扭矩工具 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/zh-hans/torque/dyne-centimetre.html](https://www.chinateao.com/zh-hans/torque/dyne-centimetre.html) | 扭矩工具 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/zh-hans/torque/foot-pound-force.html](https://www.chinateao.com/zh-hans/torque/foot-pound-force.html) | 扭矩工具 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/zh-hans/torque/gram-force-centimetre.html](https://www.chinateao.com/zh-hans/torque/gram-force-centimetre.html) | 扭矩工具 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/zh-hans/torque/inch-ounce-force.html](https://www.chinateao.com/zh-hans/torque/inch-ounce-force.html) | 扭矩工具 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/zh-hans/torque/kilogram-force-metre.html](https://www.chinateao.com/zh-hans/torque/kilogram-force-metre.html) | 扭矩工具 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/zh-hans/torque/kilonewton-metre.html](https://www.chinateao.com/zh-hans/torque/kilonewton-metre.html) | 扭矩工具 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/zh-hans/torque/kilopond-metre.html](https://www.chinateao.com/zh-hans/torque/kilopond-metre.html) | 扭矩工具 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/zh-hans/torque/meganewton-metre.html](https://www.chinateao.com/zh-hans/torque/meganewton-metre.html) | 扭矩工具 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/zh-hans/torque/metre-kilogram-force.html](https://www.chinateao.com/zh-hans/torque/metre-kilogram-force.html) | 扭矩工具 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/zh-hans/torque/micronewton-metre.html](https://www.chinateao.com/zh-hans/torque/micronewton-metre.html) | 扭矩工具 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/zh-hans/torque/millinewton-metre.html](https://www.chinateao.com/zh-hans/torque/millinewton-metre.html) | 扭矩工具 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/zh-hans/torque/newton-metre.html](https://www.chinateao.com/zh-hans/torque/newton-metre.html) | 扭矩工具 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/zh-hans/torque/ounce-force-foot.html](https://www.chinateao.com/zh-hans/torque/ounce-force-foot.html) | 扭矩工具 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/zh-hans/torque/ounce-force-inch.html](https://www.chinateao.com/zh-hans/torque/ounce-force-inch.html) | 扭矩工具 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/zh-hans/torque/pound-force-foot.html](https://www.chinateao.com/zh-hans/torque/pound-force-foot.html) | 扭矩工具 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
| [/zh-hans/torque/pound-force-inch.html](https://www.chinateao.com/zh-hans/torque/pound-force-inch.html) | 扭矩工具 | 403 | 未读取 | 尚未承接；样板中的链接仍指向线上原址 |
