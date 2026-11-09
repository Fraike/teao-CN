import assert from "node:assert/strict";
import test from "node:test";
import { getProductContent, getRelatedProducts } from "./product-content";
import products from "@/content/live-site/products.json";

const paths = Object.keys(products);
const sample = paths.find(path => path.includes("rd-t036"))!;

test("known product paths return their content record", () => {
  const record = getProductContent(sample);
  assert.ok(record);
  assert.equal(record?.model, "RD-T036");
  assert.equal(record?.categoryId, "gear-damper");
  assert.ok(record!.images.length > 0);
});

test("unknown product paths return null", () => {
  assert.equal(getProductContent("/gear-damper/missing.html"), null);
  assert.equal(getProductContent("/axial-dampers/rd-v088-missing.html"), null);
});

test("related products stay in the same category and exclude the current one", () => {
  const related = getRelatedProducts("gear-damper", sample, 4);
  assert.equal(related.length, 4);
  assert.ok(related.every(product => product.path !== sample));
  assert.ok(related.every(product => product.path.startsWith("/gear-damper/")));
});

test("related products shrink to what the category has and never cross categories", () => {
  const latchPath = paths.find(path => path.startsWith("/latches/"))!;
  const related = getRelatedProducts("latch", latchPath, 10);
  assert.equal(related.length, 7);
  assert.ok(related.every(product => product.path.startsWith("/latches/")));
});
