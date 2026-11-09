// 英文产品数据的受控词表 —— 应用场景 8 个、属性标签 12 个、零件 21 个、材质 18 个。

const APPLICATIONS = {
  "Automotive Interior & Exterior": "汽车内外饰",
  "Office Equipment": "办公设备",
  "Home Appliances": "家用电器",
  "Automotive Components": "汽车零部件",
  "Industrial Equipment": "工业设备",
  "Automotive Interior": "汽车内饰",
  "Glove Box": "手套箱",
  "Smart Home": "智能家居",
};

const PARTS = {
  "Lower Housing": "下座",
  "Upper Cover": "上盖",
  Shaft: "轴芯",
  Gear: "齿轮",
  "O-Ring": "O 型圈",
  Clip: "卡簧",
  "Rack Shaft": "齿条轴",
  "Lower Cover": "下盖",
  Housing: "外壳",
  "Outer Diameter of Gear": "齿外径",
  "Torsional Spring": "扭簧",
  "Pull Rod Sleeve": "拉杆套",
  "Pull Rod": "拉杆",
  Spring: "弹簧",
  "Pull Cord": "拉绳",
  "Metal Shaft": "金属轴",
  Metal: "金属件",
  "Lock Core": "锁芯",
  "Lock Block": "锁块",
  "Steel Pin": "钢销",
  "Latch Bolt": "锁舌",
};

const MATERIALS = {
  Silicone: "硅胶",
  "Stainless Steel": "不锈钢",
  "Hardened Steel": "淬火钢",
  Aramid: "芳纶",
  Metal: "金属",
};

// 这些值被错误地放进了材质字段,直接丢弃。
const INVALID_MATERIALS = new Set(["阻尼器", "固定", "轴芯", "按压力", "总高"]);

const VARIANT_PARAMS = {
  Teeth: "齿数",
  "Outer Diameter of Gear": "齿外径",
  "Gear Height": "齿高",
  "Total Height": "总高",
  Modulus: "模数",
  "Pressure Angle": "压力角",
};

const ASSEMBLY = [
  [/screw/i, "螺钉"],
  [/snap|clip/i, "卡扣"],
  [/bolt/i, "螺栓"],
  [/press|insert/i, "压入"],
];

const SOUND = { audible: "有声", silent: "无声" };
const DIRECTION = { Bidirectional: "双向", Unidirectional: "单向" };

export function translateApplication(value) {
  return APPLICATIONS[value] ?? value;
}

export function translateCharacteristic(value) {
  const gear = String(value).match(/^Gear\s+(\d+)T$/i);
  if (gear) return `${gear[1]} 齿`;
  const map = {
    Bidirectional: "双向",
    Unidirectional: "单向",
    "Compact Design": "紧凑设计",
    "Snap-fit": "卡扣",
    "Screw Fixing": "螺钉",
  };
  return map[value] ?? value;
}

export function translatePart(value) {
  return PARTS[value] ?? value;
}

export function translateMaterial(value) {
  if (INVALID_MATERIALS.has(value)) return null;
  return MATERIALS[value] ?? value;
}

export function translateVariantParam(value) {
  return VARIANT_PARAMS[value] ?? value;
}

export function translateAssembly(value) {
  if (!value) return null;
  for (const [pattern, label] of ASSEMBLY) if (pattern.test(value)) return label;
  return value;
}

export function translateSound(value) {
  return SOUND[value] ?? null;
}

export function translateDirection(value) {
  return DIRECTION[value] ?? null;
}
