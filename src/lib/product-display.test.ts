import assert from "node:assert/strict";
import test from "node:test";
import { formatTorque, getForceBar, getTorqueBar, niceCeil, parseSpecifications, pickChips } from "./product-display";

test("specifications parse on half-width and full-width colons", () => {
  assert.deepEqual(parseSpecifications(["尺寸:Φ10.4", "Size：Φ16", "无分隔符"]), [
    { label: "尺寸", value: "Φ10.4" },
    { label: "Size", value: "Φ16" },
  ]);
  assert.deepEqual(parseSpecifications([]), []);
});

test("niceCeil rounds up to a 1/2/5/10 step", () => {
  assert.equal(niceCeil(0), 1);
  assert.equal(niceCeil(1), 1);
  assert.equal(niceCeil(1.45), 2);
  assert.equal(niceCeil(3), 5);
  assert.equal(niceCeil(7), 10);
  assert.equal(niceCeil(15), 20);
  assert.equal(niceCeil(145), 200);
  assert.equal(niceCeil(725), 1000);
});

test("torque bar maps min/max onto a nice ceiling scale", () => {
  assert.deepEqual(getTorqueBar({ min: 50, max: 500 }), { scaleMax: 1000, start: 5, width: 45 });
  assert.equal(getTorqueBar(null), null);
});

test("torque bar keeps a minimum visible width", () => {
  assert.deepEqual(getTorqueBar({ min: 1, max: 1 }), { scaleMax: 2, start: 50, width: 6 });
  assert.deepEqual(getForceBar({ min: 6, max: 6 }), { scaleMax: 10, start: 60, width: 6 });
  assert.equal(getForceBar(null), null);
});

test("torque formatting matches the English listing", () => {
  assert.equal(formatTorque({ min: 50, max: 50, unit: "gf·cm" }), "50 gf·cm");
  assert.equal(formatTorque({ min: 20, max: 300, unit: "gf·cm" }), "20 – 300 gf·cm");
});

test("chip selection follows per-category priority and caps at four", () => {
  const chips = [
    { label: "压力角", value: "20°" },
    { label: "模数", value: "0.8" },
    { label: "安装方式", value: "螺钉" },
    { label: "齿数", value: "11" },
    { label: "尺寸", value: "Φ10.4" },
  ];
  const gear = pickChips(chips, "gear-damper");
  assert.deepEqual(gear.chips.map(chip => chip.label), ["尺寸", "齿数", "模数", "安装方式"]);
  assert.equal(gear.accentIndex, 0);

  const latch = pickChips([{ label: "高度", value: "1" }, { label: "操作力", value: "6 N" }, { label: "声音", value: "静音" }], "latch");
  assert.deepEqual(latch.chips.map(chip => chip.label), ["声音", "操作力", "高度"]);
  assert.equal(latch.accentIndex, 0);
});

test("chip selection falls back to remaining chips when priority labels are missing", () => {
  const result = pickChips([{ label: "材质", value: "PA66" }, { label: "孔尺寸", value: "φ4" }], "gear-damper");
  assert.deepEqual(result.chips.map(chip => chip.label), ["材质", "孔尺寸"]);
  assert.equal(result.accentIndex, 0);
});
