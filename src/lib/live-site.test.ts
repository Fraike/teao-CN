import assert from "node:assert/strict";
import test from "node:test";
import { getPilotPage, developmentCategoryPath, liveCategories, liveHref, LIVE_ORIGIN, PILOT_PRODUCT_PATH } from "./live-site";
import { getCategoryRoute } from "./live-catalog";

test("original category and html detail resolve without renaming", () => {
  assert.equal(getPilotPage(["gear-damper"]), "category");
  assert.equal(getPilotPage(["gear-damper", "gear-rotary-damper-rd-t038-v038.html"]), "product");
  assert.equal(liveHref(PILOT_PRODUCT_PATH), PILOT_PRODUCT_PATH);
  assert.equal(liveHref("/gear-damper/"), "/gear-damper/");
});

test("unknown products and case variants are not the sample product", () => {
  assert.equal(getPilotPage(["gear-damper", "missing.html"]), null);
  assert.equal(getPilotPage(["gear-damper", "index_200.html"]), null);
  assert.equal(getPilotPage(["gear-damper", "gear-rotary-damper-RD-T038-V038.html"]), null);
  assert.equal(getPilotPage(["wrong", "gear-rotary-damper-rd-t038-v038.html"]), null);
});

test("unported links keep original spelling, Chinese, spaces, nested slashes and extensions", () => {
  for (const path of ["/gear-damper/gear-rotary-damper- RD-T038A/V038A.html", "/齿轮/中文 产品.html", "/index.php/products/gear-damper.html"]) {
    assert.equal(liveHref(path), LIVE_ORIGIN + path);
  }
});

test("all five Header categories resolve to local original URLs with their own contents", () => {
  assert.equal(liveCategories.length, 5);
  for (const category of liveCategories) {
    const segments = category.path.split("/").filter(Boolean);
    const route = getCategoryRoute(segments);
    assert.ok(route, category.path);
    assert.equal(route.category.path, category.path);
    assert.ok(route.page.products.length > 0, category.path);
    assert.equal(liveHref(category.path), category.path);
  }
});

test("obsolete development links point to original categories and preserve the space-bearing category", () => {
  assert.equal(developmentCategoryPath("axial-damper"), "/axial-dampers/");
  assert.equal(developmentCategoryPath("glove-box-damper"), "/Glove Box Dampers/");
  assert.equal(developmentCategoryPath("custom"), "/qitaqichelingbujian/");
  assert.equal(developmentCategoryPath("unknown"), null);
  assert.equal(getCategoryRoute(["glove box dampers"]), null);
});

test("original pagination has separate product contents and rejects nonexistent pages", () => {
  const first = getCategoryRoute(["gear-damper"]);
  const second = getCategoryRoute(["gear-damper", "index_2.html"]);
  assert.ok(first && second);
  assert.notEqual(first.page.products[0].path, second.page.products[0].path);
  assert.equal(liveHref("/gear-damper/index_2.html"), "/gear-damper/index_2.html");
  assert.equal(getCategoryRoute(["latches", "index_2.html"]), null);
});

test("local anchors stay on the local pilot and arbitrary origins are rejected", () => {
  assert.equal(liveHref("/gear-damper/#products"), "/gear-damper/#products");
  assert.throws(() => liveHref("//other.example/path"));
  assert.throws(() => liveHref("https://other.example/path"));
});

test("encoded metadata segments resolve like decoded page segments without double decoding", () => {
  for (const segments of [["Glove%20Box%20Dampers"], ["Glove%20Box%20Dampers", "index_2.html"]]) {
    assert.equal(getPilotPage(segments), "category");
    assert.ok(getCategoryRoute(segments));
  }
  for (const segments of [["Glove%2520Box%2520Dampers"], ["gear-damper%2Findex_2.html"], ["bad%"]]) {
    assert.equal(getPilotPage(segments), null);
    assert.equal(getCategoryRoute(segments), null);
  }
});
