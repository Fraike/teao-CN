// TEAO 中文站 — 新闻数据
// 基于英文站 src/db/seed.ts 的 3 篇 seed 新闻本地化,图片沿用英文站同名 placeholder

export interface NewsArticle {
  slug: string;
  category: "company" | "quality" | "engineering";
  categoryLabel: string;
  title: string;
  summary: string;
  content: string[];
  image: string;
  publishedAt: string;
}

export const newsArticles: NewsArticle[] = [
  {
    slug: "teao-expands-capacity",
    category: "company",
    categoryLabel: "公司动态",
    title: "特澳扩建自动化阻尼器装配产能",
    summary: "自动化水平提升，支撑稳定品质与大批量交付。",
    content: [
      "特澳已完成东莞工厂自动化阻尼器装配线的大幅扩建。新设备将年产能提升至 8000 万件，同时保持汽车客户所要求的一致扭矩性能与质量标准。",
      "本次投资在每条装配线上集成了自动化扭矩检测工位，实现 100% 全检能力。",
    ],
    image: "/images/news/placeholder-1.webp",
    publishedAt: "2026-03-15",
  },
  {
    slug: "automotive-quality-systems",
    category: "quality",
    categoryLabel: "质量",
    title: "阻尼器生产的汽车级质量体系",
    summary: "以 IATF 为导向的过程控制，确保扭矩性能可重复。",
    content: [
      "特澳的质量管理体系围绕 IATF 16949 原则构建，聚焦过程控制、测量系统分析与生产追溯。",
      "每一款阻尼器设计都要在规定的温度范围内完成验证测试，生产批次从原材料到终检全程可追溯。这套系统化方法满足全球主机厂与一级供应商的质量要求。",
    ],
    image: "/images/news/placeholder-2.webp",
    publishedAt: "2026-02-20",
  },
  {
    slug: "torque-requirements-guide",
    category: "engineering",
    categoryLabel: "工程",
    title: "如何定义软性运动所需的扭矩要求",
    summary: "掌握关键参数，加快阻尼器选型与技术报价。",
    content: [
      "明确定义扭矩要求，是为应用选择或设计合适阻尼器的第一步。",
      "关键参数包括：目标扭矩值与公差、阻尼方向（顺时针、逆时针或双向）、工作温度范围、空间包络限制、安装结构、循环寿命要求，以及任何特殊环境条件。",
      "在询盘时提供这些参数，特澳工程团队即可推荐最合适的标准平台，或提出定制设计方案。",
    ],
    image: "/images/news/placeholder-3.webp",
    publishedAt: "2026-01-10",
  },
];
