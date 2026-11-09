import assert from "node:assert/strict";
import test from "node:test";
import { TORQUE_UNITS, convertTorque, formatTorqueValue, isTeaoTorqueUnit, normalizeTorqueInput } from "./torque-conversion";

test("input normalization accepts full-width punctuation and comma decimals", () => {
  assert.equal(normalizeTorqueInput(""), "");
  assert.equal(normalizeTorqueInput("."), "0.");
  assert.equal(normalizeTorqueInput(".5"), "0.5");
  assert.equal(normalizeTorqueInput("1,5"), "1.5");
  assert.equal(normalizeTorqueInput("1，5"), "1.5");
  assert.equal(normalizeTorqueInput("1。5"), "1.5");
  assert.equal(normalizeTorqueInput("1．5"), "1.5");
  assert.equal(normalizeTorqueInput("1.234"), "1.234");
});

test("input normalization rejects more than three decimals and malformed values", () => {
  assert.equal(normalizeTorqueInput("1.2345"), null);
  assert.equal(normalizeTorqueInput("1.2.3"), null);
  assert.equal(normalizeTorqueInput("1,234.5"), null);
  assert.equal(normalizeTorqueInput("abc"), null);
});

test("value formatting follows the English tool thresholds", () => {
  assert.equal(formatTorqueValue(0), "0");
  assert.equal(formatTorqueValue(0.0009), "9.000e-4");
  assert.equal(formatTorqueValue(0.5), "0.5000");
  assert.equal(formatTorqueValue(1), "1.000");
  assert.equal(formatTorqueValue(10), "10.00");
  assert.equal(formatTorqueValue(100), "100.0");
  assert.equal(formatTorqueValue(1000), "1,000");
  assert.equal(formatTorqueValue(1234.5), "1,235");
});

test("one gf·cm converts to every unit in source order", () => {
  const results = convertTorque("1", "gf·cm");
  assert.ok(results);
  assert.deepEqual(results.map(result => result.key), TORQUE_UNITS.map(unit => unit.key));
  const byKey = Object.fromEntries(results.map(result => [result.key, result.value]));
  assert.equal(byKey["N·m"], 0.0000981);
  assert.equal(byKey["gf·cm"], 1);
  assert.ok(Math.abs(byKey["mN·m"] - 0.0981) < 1e-12);
  assert.equal(formatTorqueValue(byKey["N·m"]), "9.810e-5");
  assert.equal(formatTorqueValue(byKey["mN·m"]), "0.0981");
});

test("an empty or non-numeric value yields no results", () => {
  assert.equal(convertTorque("", "gf·cm"), null);
  assert.equal(convertTorque("abc", "gf·cm"), null);
});

test("TEAO units are gf·cm and mN·m", () => {
  assert.equal(isTeaoTorqueUnit("gf·cm"), true);
  assert.equal(isTeaoTorqueUnit("mN·m"), true);
  assert.equal(isTeaoTorqueUnit("N·m"), false);
  assert.equal(isTeaoTorqueUnit("lbf·in"), false);
});
