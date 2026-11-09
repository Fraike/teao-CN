import assert from "node:assert/strict";
import test from "node:test";
import { getPilotPage, developmentCategoryPath, liveCategories, liveHref, LIVE_ORIGIN, PILOT_PRODUCT_PATH, getNewsSlug, ABOUT_PATH, CONTACTS_PATH, NEWS_PATH, CONVERT_PATH } from "./live-site";
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

test("quality and faq sections resolve locally, with and without trailing slash", () => {
  assert.equal(getPilotPage(["quality-control"]), "quality");
  assert.equal(getPilotPage(["faq"]), "faq");
  assert.equal(getPilotPage(["quality-control", "x"]), null);
  assert.equal(liveHref("/quality-control/"), "/quality-control/");
  assert.equal(liveHref("/quality-control"), "/quality-control");
  assert.equal(liveHref("/faq/"), "/faq/");
});

test("unknown and near-miss paths still go to the live origin", () => {
  assert.equal(liveHref("/quality/"), LIVE_ORIGIN + "/quality/");
  assert.equal(liveHref("/faqs/"), LIVE_ORIGIN + "/faqs/");
});

test("applications leaves resolve locally with and without trailing slash", () => {
  assert.equal(getPilotPage(["applications"]), "applications");
  assert.equal(getPilotPage(["applications", "automotive-interior"]), "automotive-interior");
  assert.equal(getPilotPage(["applications", "automotive-interior", "internal"]), "interior");
  assert.equal(getPilotPage(["applications", "automotive-interior", "external"]), "exterior");
  assert.equal(getPilotPage(["applications", "home-life"]), "home-life");
  assert.equal(getPilotPage(["applications", "office-equipment"]), "office-equipment");
  assert.equal(getPilotPage(["applications", "industrial-application"]), "industrial-application");
  assert.equal(liveHref("/applications/"), "/applications/");
  assert.equal(liveHref("/applications/automotive-interior/internal/"), "/applications/automotive-interior/internal/");
});

test("applications near-miss, pagination and deep links still go live", () => {
  assert.equal(getPilotPage(["application"]), null);
  assert.equal(getPilotPage(["applications", "automotive-interior", "internal", "article.html"]), null);
  assert.equal(liveHref("/applications/index_2.html"), LIVE_ORIGIN + "/applications/index_2.html");
  assert.equal(liveHref("/applications/automotive-interior/index_2.html"), LIVE_ORIGIN + "/applications/automotive-interior/index_2.html");
});

test("about, contacts and news resolve locally with and without trailing slash", () => {
  assert.equal(getPilotPage(["about-us"]), "about");
  assert.equal(getPilotPage(["contacts"]), "contacts");
  assert.equal(getPilotPage(["news"]), "news");
  assert.equal(liveHref("/about-us/"), "/about-us/");
  assert.equal(liveHref("/contacts/"), "/contacts/");
  assert.equal(liveHref("/news/"), "/news/");
  assert.equal(ABOUT_PATH, "/about-us/");
  assert.equal(CONTACTS_PATH, "/contacts/");
  assert.equal(NEWS_PATH, "/news/");
});

test("known news articles resolve, unknown slugs and pagination do not", () => {
  assert.equal(getPilotPage(["news", "teao-expands-capacity.html"]), "news-article");
  assert.equal(getPilotPage(["news", "torque-requirements-guide.html"]), "news-article");
  assert.equal(getNewsSlug(["news", "teao-expands-capacity.html"]), "teao-expands-capacity");
  assert.equal(getPilotPage(["news", "unknown-article.html"]), null);
  assert.equal(getPilotPage(["news", "index_2.html"]), null);
  assert.equal(getPilotPage(["news", "teao-expands-capacity"]), null);
  assert.equal(getNewsSlug(["news", "index_2.html"]), null);
  assert.equal(liveHref("/news/teao-expands-capacity.html"), "/news/teao-expands-capacity.html");
  assert.equal(liveHref("/news/unknown-article.html"), LIVE_ORIGIN + "/news/unknown-article.html");
});

test("convert resolves locally with and without trailing slash", () => {
  assert.equal(getPilotPage(["convert"]), "convert");
  assert.equal(liveHref("/convert/"), "/convert/");
  assert.equal(liveHref("/convert"), "/convert");
  assert.equal(CONVERT_PATH, "/convert/");
});

test("convert near-misses stay on the live origin", () => {
  assert.equal(getPilotPage(["convert", "x"]), null);
  assert.equal(getPilotPage(["torque-converter"]), null);
  assert.equal(getPilotPage(["zh-hans", "torque", "gear-damper.html"]), null);
  assert.equal(liveHref("/converters/"), LIVE_ORIGIN + "/converters/");
});

test("matched product detail paths resolve locally", () => {
  const plain = "/gear-damper/rd-t036-shiyongyuqicheneishijiayongdianqigongyejixie.html";
  const chinese = "/gear-damper/齿轮阻尼器RD-T021适用于眼镜盒、杯托、家电、智能锁.html";
  const spaced = "/gear-damper/gear-rotary-damper-RD- T011.html";
  assert.equal(getPilotPage(plain.split("/").filter(Boolean)), "product");
  assert.equal(getPilotPage(chinese.split("/").filter(Boolean)), "product");
  assert.equal(getPilotPage(spaced.split("/").filter(Boolean)), "product");
  assert.equal(liveHref(plain), plain);
  assert.equal(liveHref(chinese), chinese);
});

test("encoded product paths resolve like decoded ones", () => {
  const segments = ["gear-damper", encodeURIComponent("齿轮阻尼器RD-T021适用于眼镜盒、杯托、家电、智能锁.html")];
  assert.equal(getPilotPage(segments), "product");
});

test("unmatched product paths and near-misses still go to the live origin", () => {
  const unmatched = "/axial-dampers/rd-v088tongzhouxinshiyongyumatongzuniqizhinengweiyu.html";
  assert.equal(getPilotPage(unmatched.split("/").filter(Boolean)), null);
  assert.equal(liveHref(unmatched), LIVE_ORIGIN + unmatched);
  assert.equal(getPilotPage(["gear-damper", "index_200.html"]), null);
  assert.equal(getPilotPage(["gear-damper", "missing.html"]), null);
});
