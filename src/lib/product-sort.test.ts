import assert from "node:assert/strict";
import test from "node:test";
import { compareModel } from "./product-sort";

test("models sort by prefix, then number, then suffix", () => {
  const models = ["RD-T011", "RD-T001", "RD-T010", "RD-T002", "RD-T010A", "RD-T038A", "RD-T038"];
  assert.deepEqual([...models].sort(compareModel), [
    "RD-T001",
    "RD-T002",
    "RD-T010",
    "RD-T010A",
    "RD-T011",
    "RD-T038",
    "RD-T038A",
  ]);
});

test("lettered series come before plain numeric models, spaces and multi-model strings are handled", () => {
  const models = ["RD-V107", "RD- T019", "RD-10L", "RD-10", "RD-TR02 铰链", "RD-01"];
  assert.deepEqual([...models].sort(compareModel), [
    "RD- T019",
    "RD-TR02 铰链",
    "RD-V107",
    "RD-01",
    "RD-10",
    "RD-10L",
  ]);
});

test("duplicate models keep a stable order", () => {
  const models = ["RD-V088", "RD-T012A", "RD-V088"];
  const sorted = [...models].sort(compareModel);
  assert.equal(sorted[0], "RD-T012A");
  assert.equal(sorted.filter(model => model === "RD-V088").length, 2);
});
