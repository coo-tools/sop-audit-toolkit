export const STATUS_SCORE = { yes: 1, partial: 0.5, no: 0, unanswered: 0 };

export function auditScore(items) {
  const totalWeight = items.reduce((sum, item) => sum + (Number(item.weight) || 1), 0);
  if (!totalWeight) return 0;
  const earned = items.reduce((sum, item) => {
    const weight = Number(item.weight) || 1;
    return sum + weight * (STATUS_SCORE[item.status] ?? 0);
  }, 0);
  return Math.round((earned / totalWeight) * 100);
}

export function sectionScores(items) {
  const groups = Object.groupBy(items, (item) => item.section);
  return Object.entries(groups).map(([section, sectionItems]) => ({
    section,
    score: auditScore(sectionItems),
    completed: sectionItems.filter((item) => item.status === "yes").length,
    total: sectionItems.length,
  }));
}

export function priorityActions(items, limit = 5) {
  return items
    .filter((item) => item.status !== "yes")
    .map((item) => ({ ...item, priority: (Number(item.weight) || 1) * (1 - (STATUS_SCORE[item.status] ?? 0)) }))
    .sort((a, b) => b.priority - a.priority || a.label.localeCompare(b.label))
    .slice(0, limit);
}

export function maturityLabel(score) {
  if (score >= 85) return "Controlled";
  if (score >= 65) return "Repeatable";
  if (score >= 40) return "Developing";
  return "Ad hoc";
}

export function normalizeAuditContext(context = {}) {
  const clean = (value) => String(value ?? "").trim();
  return {
    processName: clean(context.processName),
    processOwner: clean(context.processOwner),
    reviewDate: clean(context.reviewDate),
  };
}

export function actionPlanMarkdown(items, context = {}) {
  const normalized = normalizeAuditContext(context);
  const score = auditScore(items);
  const actions = priorityActions(items, items.length);
  const valueOrFallback = (value) => value || "Not specified";

  return [
    "# SOP Audit Action Plan",
    "",
    `Process: ${valueOrFallback(normalized.processName)}`,
    `Process owner: ${valueOrFallback(normalized.processOwner)}`,
    `Review date: ${valueOrFallback(normalized.reviewDate)}`,
    "",
    `Overall score: ${score}% (${maturityLabel(score)})`,
    "",
    "## Priority actions",
    "",
    ...(actions.length
      ? actions.map((item, index) => `${index + 1}. ${item.label} — ${item.section} (${item.status})`)
      : ["No open actions. Schedule the next review."]),
  ].join("\n");
}
