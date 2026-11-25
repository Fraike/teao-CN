import assert from "node:assert/strict";
import test from "node:test";
import { buildProductPatch, isValidProductPath, isValidSlug, slugFromModel } from "./product-admin";

test("slug and path validation", () => {
  assert.equal(slugFromModel("RD-10L"), "rd-10l");
  assert.equal(isValidSlug("rd-t021"), true);
  assert.equal(isValidSlug("RD-T021"), false);
  assert.equal(isValidProductPath("/gear-damper/foo.html"), true);
  assert.equal(isValidProductPath("/gear-damper/foo"), false);
  assert.equal(isValidProductPath("/gear-damper//foo.html"), false);
  assert.equal(isValidProductPath("gear-damper/foo.html"), false);
});

test("partial patch only touches submitted fields", () => {
  const { patch, error } = buildProductPatch({ isActive: false });
  assert.equal(error, undefined);
  assert.deepEqual(Object.keys(patch).sort(), ["isActive", "status"]);
  assert.equal(patch.isActive, 0);
  assert.equal(patch.status, "inactive");
});

test("existing product path is locked", () => {
  const { error } = buildProductPatch({ path: "/gear-damper/other.html" }, "/gear-damper/original.html");
  assert.match(error ?? "", /不可修改/);
});

test("range and variants validation", () => {
  const range = buildProductPatch({ torque: { min: 20, max: 10, unit: "gf·cm" } });
  assert.match(range.error ?? "", /min 不能大于 max/);
  const variants = buildProductPatch({
    variants: { variants: ["A", "B"], rows: [{ param: "齿数", values: ["11"] }] },
  });
  assert.match(variants.error ?? "", /数值数量/);
});

test("images must be local paths", () => {
  const local = buildProductPatch({ images: [{ url: "/images/products/x.webp", alt: "x" }] });
  assert.equal(local.error, undefined);
  const remote = buildProductPatch({ images: [{ url: "https://example.com/x.webp" }] });
  assert.match(remote.error ?? "", /本地路径/);
});
