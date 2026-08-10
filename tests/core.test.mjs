import test from "node:test";
import assert from "node:assert/strict";
import { auditScore, sectionScores, priorityActions, maturityLabel } from "../src/core.js";

const items = [
  { label: "Owner", section: "Ownership", status: "yes", weight: 3 },
  { label: "Backup", section: "Ownership", status: "partial", weight: 1 },
  { label: "Version", section: "Documentation", status: "no", weight: 2 },
];

test("audit score is weight-adjusted", () => {
  assert.equal(auditScore(items), 58);
});

test("section summaries preserve section names", () => {
  assert.deepEqual(sectionScores(items), [
    { section: "Ownership", score: 88, completed: 1, total: 2 },
    { section: "Documentation", score: 0, completed: 0, total: 1 },
  ]);
});

test("priority actions put high-weight gaps first", () => {
  assert.equal(priorityActions(items, 1)[0].label, "Version");
});

test("maturity labels cover the score range", () => {
  assert.equal(maturityLabel(90), "Controlled");
  assert.equal(maturityLabel(50), "Developing");
  assert.equal(maturityLabel(20), "Ad hoc");
});
