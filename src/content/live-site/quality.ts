// TEAO 中文站 — 质量控制页数据
// 基于英文站 src/app/quality/page.tsx 本地化;图片复用英文站 public/images/company/

export const inspectionCards = [
  {
    badge: "100% 扭矩检测",
    title: "每件必测,无一例外",
    image: "/images/company/visual-inspection-2.webp",
    points: [
      "出货前对每一件产品进行 100% 扭矩检测",
      "支持单向、双向及定制扭矩曲线",
      "在 -40°C ~ +110°C 环境下扭矩稳定",
      "实时数据记录,支持完整批次追溯",
    ],
  },
  {
    badge: "100% 外观检测",
    title: "每个表面,逐件检查",
    image: "/images/company/visual-inspection.webp",
    points: [
      "100% 外观检测,确认表面质量与一致性",
      "缺陷分类:毛边、缩痕、色差、尺寸",
      "标准化作业指导书与明确接收标准",
      "高分辨率光学检测 + 培训后人工复核",
    ],
  },
];

export const engineeringCapabilities = [
  { title: "小体积大扭矩", description: "在紧凑、受限空间内实现高扭矩输出。" },
  { title: "长寿命设计", description: "通过材料与结构优化延长产品使用寿命。" },
  { title: "宽温域稳定", description: "-40°C ~ +110°C 环境温度下保持稳定阻尼性能。" },
  { title: "单向阻尼", description: "单方向精确控制阻尼——顺开、紧合。" },
  { title: "定制调校", description: "按目标扭矩、速度与手感要求调校阻尼曲线。" },
  { title: "低温度敏感性", description: "黏度稳定的硅油配方,降低温度循环下的性能漂移。" },
];

export const labGroups = [
  {
    label: "力学检测",
    items: [
      { equipment: "数显推拉力计", range: "0.25 ~ 500N", accuracy: "±0.25N" },
      { equipment: "扭矩计", range: "10g ~ 6000g", accuracy: "±0.1g" },
      { equipment: "扭矩测试仪", range: "1 ~ 100 圈", accuracy: "内部标准" },
    ],
  },
  {
    label: "环境检测",
    items: [
      { equipment: "环境试验箱", range: "-40°C ~ +110°C", accuracy: "±1°C" },
      { equipment: "高温试验箱", range: "-40°C ~ +110°C", accuracy: "±1°C" },
      { equipment: "温度计", range: "-40°C ~ +110°C", accuracy: "±1°C" },
    ],
  },
  {
    label: "耐久与检验",
    items: [
      { equipment: "寿命测试机", range: "长寿命循环", accuracy: "内部标准" },
      { equipment: "光学投影仪", range: "X200mm × Y100mm", accuracy: "0.001mm" },
      { equipment: "橡胶硬度计", range: "0 ~ 100A", accuracy: "±1A" },
    ],
  },
  {
    label: "精密测量",
    items: [
      { equipment: "数显卡尺 / 高度尺", range: "0 ~ 150mm", accuracy: "0.01mm" },
      { equipment: "电子天平", range: "0.000001 ~ 150kg", accuracy: "0.000001kg" },
      { equipment: "黏度测试仪", range: "0.1 ~ 60 圈", accuracy: "1mPa" },
    ],
  },
];

export const iatfNote = {
  title: "IATF 16949 认证质量管理体系",
  description:
    "特澳以 IATF 16949 汽车行业质量管理体系运行,覆盖从设计、原材料采购到生产、检测与售后服务的全产品生命周期。通过客户反馈、内部审核与定期管理评审持续改进。",
  ctaLabel: "查看认证资质",
  ctaHref: "/about-us/",
};
