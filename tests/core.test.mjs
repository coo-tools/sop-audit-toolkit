import test from "node:test";
import assert from "node:assert/strict";
import {
  actionPlanMarkdown,
  auditScore,
  maturityLabel,
  normalizeAuditContext,
  priorityActions,
  sectionScores,
} from "../src/core.js";

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

test("audit context trims values for consistent storage", () => {
  assert.deepEqual(normalizeAuditContext({
    processName: "  Customer onboarding ",
    processOwner: " Operations lead  ",
    reviewDate: "2026-09-07",
  }), {
    processName: "Customer onboarding",
    processOwner: "Operations lead",
    reviewDate: "2026-09-07",
  });
});

test("action plan export includes audit context", () => {
  const markdown = actionPlanMarkdown(items, {
    processName: "Customer onboarding",
    processOwner: "Eugene Nosov",
    reviewDate: "2026-09-07",
  });

  assert.match(markdown, /Process: Customer onboarding/);
  assert.match(markdown, /Process owner: Eugene Nosov/);
  assert.match(markdown, /Review date: 2026-09-07/);
  assert.match(markdown, /Overall score: 58% \(Developing\)/);
  assert.match(markdown, /1\. Version — Documentation \(no\)/);
});
