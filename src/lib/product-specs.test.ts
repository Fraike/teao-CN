import assert from "node:assert/strict";
import test from "node:test";
import specs from "@/content/live-site/product-specs.json";
import catalog from "@/content/live-site/categories.json";

const entries = Object.entries(specs);
const catalogPaths = catalog.flatMap(category => category.pages.flatMap(page => page.products.map(product => product.path)));

test("every catalog product has an overlay entry", () => {
  assert.equal(entries.length, catalogPaths.length);
  for (const path of catalogPaths) assert.ok(path in specs, path);
});

test("torque and force values are finite with the expected units", () => {
  for (const [path, entry] of entries) {
    if (entry.torque) {
      assert.equal(entry.torque.unit, "gf·cm", path);
      assert.ok(Number.isFinite(entry.torque.min) && Number.isFinite(entry.torque.max), path);
      assert.ok(entry.torque.min <= entry.torque.max, path);
    }
    if (entry.force) {
      assert.equal(entry.force.unit, "N", path);
      assert.ok(Number.isFinite(entry.force.min) && Number.isFinite(entry.force.max), path);
      assert.ok(entry.force.min <= entry.force.max, path);
    }
  }
});

test("overlay coverage matches the English source", () => {
  const torque = entries.filter(([, entry]) => entry.torque).length;
  const force = entries.filter(([, entry]) => entry.force).length;
  assert.equal(torque, 47);
  assert.equal(force, 13);
  assert.equal(entries.length - torque - force, 15);
});

test("kgf·cm values are converted to gf·cm, not relabelled", () => {
  const byModel = (model: string) => entries.find(([, entry]) => entry.model === model)?.[1];
  assert.deepEqual(byModel("RD-V112")?.torque, { min: 10000, max: 40000, unit: "gf·cm" });
  assert.deepEqual(byModel("RD-V107")?.torque, { min: 3000, max: 3000, unit: "gf·cm" });
  assert.deepEqual(byModel("RD-T216")?.torque, { min: 10000, max: 30000, unit: "gf·cm" });
});

test("force falls back to the English Force spec and keeps the sound chip", () => {
  const byModel = (model: string) => entries.find(([, entry]) => entry.model === model)?.[1];
  assert.deepEqual(byModel("RD-15")?.force, { min: 30, max: 30, unit: "N" });
  const latch = byModel("RD-01");
  assert.ok(latch?.force);
  assert.ok(latch?.specs.some((chip: { label: string }) => chip.label === "声音"));
});
