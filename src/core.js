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
