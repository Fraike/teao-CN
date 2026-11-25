import assert from "node:assert/strict";
import test from "node:test";
import {
  getCatalog,
  getCategoryRouteByPath,
  getProductContentByModel,
  getPublicCategories,
} from "./catalog-store";

test("DB catalog keeps five categories and 77 active products", async () => {
  const catalog = await getCatalog();
  const categories = await getPublicCategories();
  assert.equal(categories.length, 5);
  assert.equal(catalog.reduce((sum, category) => sum + category.pages.flatMap(page => page.products).length, 0), 77);
});

test("historical pagination paths keep their original page sizes", async () => {
  const gearSecond = await getCategoryRouteByPath("/gear-damper/index_2.html");
  const gearThird = await getCategoryRouteByPath("/gear-damper/index_3.html");
  const gloveSecond = await getCategoryRouteByPath("/Glove Box Dampers/index_2.html");
  assert.ok(gearSecond && gearThird && gloveSecond);
  assert.equal(gearSecond.page.number, 2);
  assert.equal(gearSecond.page.products.length, 12);
  assert.equal(gearThird.page.number, 3);
  assert.equal(gearThird.page.products.length, 3);
  assert.equal(gloveSecond.page.products.length, 4);
  assert.equal(await getCategoryRouteByPath("/gear-damper/index_4.html"), null);
});

test("model lookup resolves the RD-10 family deterministically", async () => {
  const plain = await getProductContentByModel("RD-10");
  const left = await getProductContentByModel("RD-10L");
  const right = await getProductContentByModel("RD-10R");
  assert.ok(plain && left && right);
  assert.equal(plain.model, "RD-10");
  assert.equal(left.model, "RD-10L");
  assert.equal(right.model, "RD-10R");
  assert.notEqual(plain.path, left.path);
});

test("unknown category paths are not resolved", async () => {
  assert.equal(await getCategoryRouteByPath("/missing-category/"), null);
  assert.equal(await getCategoryRouteByPath("/gear-damper/index_200.html"), null);
});
