// TEAO 中文站 — 应用案例数据
// 基于英文站 src/content/automotive-applications.ts 与 applications 首页本地化

export interface ApplicationCard {
  key: "automotive" | "home" | "office" | "industrial";
  title: string;
  description: string;
  image: string; // /images/applications/*.webp
  href: string;  // 本地叶子 URL
}

export interface SimpleApplication {
  key: "home" | "office" | "industrial";
  title: string;
  description: string;
  image: string; // /images/applications/*.webp
}

export interface SceneProductGroup {
  title: string;        // 组标题(齿轮阻尼器 / 轴向阻尼器 / 手套箱阻尼器 / 同步器),链接分类页
  categoryPath: string; // 组标题链接的分类路径
  models: string[];     // 组内型号文字列表
}

export interface ApplicationScene {
  id: string;
  no: string;
  title: string;
  description: string;
  gif: string; // /images/applications/applications-gif/*.gif
  groups: SceneProductGroup[];
}

const GIF = "/images/applications/applications-gif";

export const applicationCards: ApplicationCard[] = [
  { key: "automotive", title: "汽车内外饰", description: "手套箱、扶手、杯托、充电口盖、车内储物格与拉手。", image: "/images/applications/automotive.webp", href: "/applications/automotive-interior/" },
  { key: "home", title: "家居", description: "马桶盖阻尼、淋浴门缓冲、柜门缓闭与卫浴运动控制。", image: "/images/applications/bathroom.webp", href: "/applications/home-life/" },
  { key: "office", title: "办公设备", description: "打印机盖、显示器支架、扫描仪盖板、工作站抽屉与受控开合面板。", image: "/images/applications/office.webp", href: "/applications/office-equipment/" },
  { key: "industrial", title: "工业设备", description: "检修门、设备外壳、维护面板、自动售货机机构与特殊运动模块。", image: "/images/applications/home-appliances.webp", href: "/applications/industrial-application/" },
];

export const automotiveInteriorScenes: ApplicationScene[] = [
  {
    id: "center-console-lid", no: "01", title: "中控扶手箱盖",
    description: "中控储物盖的软开、软关与防撞击控制。",
    gif: `${GIF}/Center console lid.gif`,
    groups: [{ title: "轴向阻尼器", categoryPath: "/axial-dampers/", models: ["RD-T013B", "RD-T012C"] }],
  },
  {
    id: "glove-box", no: "02", title: "手套箱 / 杂物箱",
    description: "受控下降,降低乘客车内储物的冲击与噪音。",
    gif: `${GIF}/Glove box.gif`,
    groups: [
      { title: "手套箱阻尼器", categoryPath: "/Glove Box Dampers/", models: ["RD-V109", "RD-V107", "RD-V129"] },
      { title: "同步器", categoryPath: "/qitaqichelingbujian/", models: ["RD-T180"] },
    ],
  },
  {
    id: "inner-door-handle", no: "03", title: "内门把手",
    description: "带回弹阻尼,让内门把手操作更安静、更稳定。",
    gif: `${GIF}/Door handle.gif`,
    groups: [
      { title: "齿轮阻尼器", categoryPath: "/gear-damper/", models: ["RD-T021", "RD-T015", "RD-T029"] },
      { title: "轴向阻尼器", categoryPath: "/axial-dampers/", models: ["TAD-18", "RD-V109"] },
    ],
  },
  {
    id: "grab-handle", no: "04", title: "顶棚拉手",
    description: "回弹缓冲,消除车顶拉手的回弹撞击噪音。",
    gif: `${GIF}/safty handle.gif`,
    groups: [{ title: "轴向阻尼器", categoryPath: "/axial-dampers/", models: ["RD-T012A", "RD-T012C", "RD-T013B"] }],
  },
  {
    id: "overhead-console", no: "05", title: "顶棚控制台 / 眼镜盒",
    description: "顶棚储物格与眼镜盒的软开、软关。",
    gif: `${GIF}/glasses box.gif`,
    groups: [{ title: "轴向阻尼器", categoryPath: "/axial-dampers/", models: ["RD-T013B", "RD-T013C"] }],
  },
  {
    id: "sunshade", no: "06", title: "遮阳板",
    description: "遮阳板与翻转机构的旋转阻尼,动作更顺滑。",
    gif: `${GIF}/glasses box.gif`,
    groups: [{ title: "轴向阻尼器", categoryPath: "/axial-dampers/", models: ["RD-T013B", "RD-T013C"] }],
  },
];

export const automotiveExteriorScenes: ApplicationScene[] = [
  {
    id: "exterior-door-handle", no: "01", title: "外门把手",
    description: "平嵌式与常规外门把手的伸出、回位与手感控制。",
    gif: `${GIF}/Door handle.gif`,
    groups: [{ title: "齿轮·定制模块", categoryPath: "/gear-damper/", models: ["RD-T015", "RD-T021"] }],
  },
  {
    id: "charging-port-cover", no: "02", title: "充电口盖",
    description: "新能源汽车充电口盖的软开、软关与防撞击。",
    gif: `${GIF}/outlet cover.gif`,
    groups: [
      { title: "齿轮阻尼器", categoryPath: "/gear-damper/", models: ["RD-T023"] },
      { title: "轴向阻尼器", categoryPath: "/axial-dampers/", models: ["RD-T013C"] },
    ],
  },
];

export const simpleApplications: SimpleApplication[] = [
  { key: "home", title: "家居", description: "马桶盖阻尼、淋浴门缓冲、柜门缓闭与卫浴运动控制。", image: "/images/applications/bathroom.webp" },
  { key: "office", title: "办公设备", description: "打印机盖、显示器支架、扫描仪盖板、工作站抽屉与受控开合面板。", image: "/images/applications/office.webp" },
  { key: "industrial", title: "工业设备", description: "检修门、设备外壳、维护面板、自动售货机机构与特殊运动模块。", image: "/images/applications/home-appliances.webp" },
];
