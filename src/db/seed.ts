import { db } from "./index";
import { categories, products } from "./schema";

async function seed() {
  console.log("Seeding database...");

  // Clear existing
  await db.delete(products).all();
  await db.delete(categories).all();

  // 5 categories with Chinese names
  await db.insert(categories).values([
    { slug: "gear-damper", name: "齿轮阻尼器", description: "旋转阻尼控制，适用于杯托、眼镜盒、储物盒等汽车内饰开合结构。", image: "/images/products/gear-damper/GearDamperCategory.webp", sortOrder: 1 },
    { slug: "axial-damper", name: "轴向阻尼器", description: "线性缓冲，推拉手感控制方案。适用于拉手、滑动门等场景。", image: "/images/products/axial-damper/AxialDamperCategory.webp", sortOrder: 2 },
    { slug: "glove-box-damper", name: "手套箱阻尼器", description: "汽车杂物箱专用缓降阻尼器，解决打开过快、末端撞击和异响问题。", image: "/images/products/glove-box-damper/GloveBoxDamperCategory.webp", sortOrder: 3 },
    { slug: "latch", name: "Push-Push 锁扣", description: "汽车内饰锁止释放机构，可与阻尼结构配合使用。", image: "/images/products/latch/LatchCategory.webp", sortOrder: 4 },
    { slug: "other", name: "定制零部件", description: "非标开发 · 模具自制 · 按图打样。定制缓冲机构和收纳机构。", image: "/images/products/other/OthersCategory.webp", sortOrder: 5 },
  ]);

  // 5 initial products with Chinese names
  await db.insert(products).values([
    {
      slug: "trd-25-rotary-gear-damper", model: "TRD-25", name: "TRD-25 齿轮阻尼器",
      category: "gear-damper",
      summary: "高扭矩旋转阻尼器，适用于汽车内饰杯托、储物盒等开合机构。",
      description: "TRD-25 系列提供平稳可控的旋转阻尼运动。支持多扭矩范围定制和安装方式定制。紧凑设计适配狭小空间，全温区稳定扭矩输出。",
      image: "/images/products/gear-damper/GearDamperSingle.webp",
      specifications: JSON.stringify({ "扭矩范围": "0.5 – 4.0 N·m", "工作温度": "-30°C ～ +80°C", "材料": "POM / PA66 + GF", "阻尼方向": "顺时针 / 逆时针 / 双向", "使用寿命": ">50,000 次" }),
      features: JSON.stringify(["紧凑设计适配狭小空间", "全温区稳定扭矩输出", "支持定制扭矩值", "低噪音运行"]),
      applications: JSON.stringify(["汽车内饰", "储物盒"]),
      isActive: 1, sortOrder: 1,
    },
    {
      slug: "rd-t015", model: "RD-T015", name: "齿轮阻尼器 RD-T015",
      category: "gear-damper",
      summary: "紧凑型旋转齿轮阻尼器，SOC-free硅油提供稳定扭矩输出。",
      description: "RD-T015 是紧凑型旋转齿轮阻尼器，专为汽车内饰杯托、储物盒、门把手和辅助手柄等应用设计。SOC-free硅油在全温度范围内提供一致的扭矩输出。",
      image: "/images/product-list/Gear-damper/RD-T015/RD-T015-product-01.webp",
      specifications: JSON.stringify({ "扭矩范围": "50 – 500 gf·cm", "工作温度": "-30°C ～ +80°C", "安装方式": "螺丝固定", "阻尼方向": "双向" }),
      features: JSON.stringify(["SOC-free 硅油", "紧凑设计", "螺丝安装", "无角度限制"]),
      applications: JSON.stringify(["汽车杯托", "储物盒", "眼镜盒"]),
      isActive: 1, sortOrder: 2,
    },
    {
      slug: "tad-18", model: "TAD-18", name: "轴向阻尼器 TAD-18",
      category: "axial-damper",
      summary: "圆筒形轴向阻尼器，适用于推拉运动场景的线性缓冲控制。",
      description: "TAD-18 轴向阻尼器提供平稳的推拉阻尼力，适用于汽车内饰拉手、滑动门、家电盖板等线性运动场景。",
      image: "/images/products/axial-damper/AxialDamperCategory.webp",
      specifications: JSON.stringify({ "阻尼力范围": "10 – 100 N", "工作温度": "-30°C ～ +80°C", "材料": "POM / PA66" }),
      features: JSON.stringify(["推拉双向阻尼", "多规格可选", "安装灵活"]),
      applications: JSON.stringify(["汽车拉手", "滑动门", "家电盖板"]),
      isActive: 1, sortOrder: 3,
    },
    {
      slug: "tgd-30", model: "TGD-30", name: "手套箱阻尼器 TGD-30",
      category: "glove-box-damper",
      summary: "汽车杂物箱专用缓降阻尼器，静音设计消除末端撞击。",
      description: "TGD-30 专为汽车手套箱设计，提供平滑的缓降控制，消除打开时的撞击声和异响，提升内饰质感。",
      image: "/images/products/glove-box-damper/GloveBoxDamperCategory.webp",
      specifications: JSON.stringify({ "适用车型": "乘用车手套箱", "工作温度": "-30°C ～ +80°C", "特点": "静音设计、缓降控制" }),
      features: JSON.stringify(["静音缓降", "消除撞击", "耐久设计"]),
      applications: JSON.stringify(["汽车手套箱", "扶手箱"]),
      isActive: 1, sortOrder: 4,
    },
    {
      slug: "tl-12", model: "TL-12", name: "Push-Push 锁扣 TL-12",
      category: "latch",
      summary: "汽车内饰锁止释放机构，手感可调，可与阻尼配合使用。",
      description: "TL-12 Push-Push 锁扣提供可靠的锁止和释放功能，广泛应用于汽车内饰储物格、杯托盖板等开合机构。",
      image: "/images/products/latch/LatchCategory.webp",
      specifications: JSON.stringify({ "类型": "Push-Push 锁止释放", "材料": "POM / 工程塑料", "特点": "手感可调、结构配套" }),
      features: JSON.stringify(["锁止释放", "结构配套", "手感可调"]),
      applications: JSON.stringify(["汽车储物格", "杯托盖板"]),
      isActive: 1, sortOrder: 5,
    },
  ]);

  console.log("Seed complete: 5 categories, 5 products");
}

seed().catch(console.error).finally(() => process.exit(0));
