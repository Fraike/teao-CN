import assert from "node:assert/strict";
import test from "node:test";
import { INQUIRY_STATUSES, inquiryStatusLabel, isInquiryStatus } from "./inquiry-store";

test("inquiry status validation accepts only known statuses", () => {
  assert.deepEqual(INQUIRY_STATUSES, ["new", "contacted", "closed"]);
  assert.equal(isInquiryStatus("new"), true);
  assert.equal(isInquiryStatus("contacted"), true);
  assert.equal(isInquiryStatus("closed"), true);
  assert.equal(isInquiryStatus("deleted"), false);
  assert.equal(isInquiryStatus(null), false);
});

test("inquiry status labels are readable", () => {
  assert.equal(inquiryStatusLabel("new"), "新询盘");
  assert.equal(inquiryStatusLabel("contacted"), "已联系");
  assert.equal(inquiryStatusLabel("closed"), "已关闭");
  assert.equal(inquiryStatusLabel("unknown"), "新询盘");
});
