import assert from "node:assert/strict";
import test from "node:test";
import { buildCategoryPatch, isValidCategoryPath, isValidCategorySlug } from "./category-admin";

test("category slug and path validation", () => {
  assert.equal(isValidCategorySlug("gear-damper"), true);
  assert.equal(isValidCategorySlug("Gear Damper"), false);
  assert.equal(isValidCategoryPath("/gear-damper/"), true);
  assert.equal(isValidCategoryPath("/gear-damper"), false);
  assert.equal(isValidCategoryPath("/gear//damper/"), false);
});

test("reserved system paths are rejected", () => {
  const { error } = buildCategoryPatch({ path: "/news/" });
  assert.match(error ?? "", /系统页面占用/);
});

test("existing category path and pageSize are locked", () => {
  const pathChange = buildCategoryPatch({ path: "/changed/" }, { path: "/original/" });
  assert.match(pathChange.error ?? "", /路径不可修改/);
  const sizeChange = buildCategoryPatch({ pageSize: 20 }, { pageSize: 12 });
  assert.match(sizeChange.error ?? "", /每页产品数不可修改/);
});

test("valid category patch passes", () => {
  const { patch, error } = buildCategoryPatch({ name: "新分类", sortOrder: 3 });
  assert.equal(error, undefined);
  assert.equal(patch.name, "新分类");
  assert.equal(patch.sortOrder, 3);
});
