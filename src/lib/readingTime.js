// Оцінка часу читання статті за Portable Text (≈200 слів/хв).
// Логіка портована з monopools (спрощено під наш блог без таблиць).
const WORDS_PER_MINUTE = 200;

function collectText(nodes, acc) {
  if (!Array.isArray(nodes)) return;
  for (const n of nodes) {
    if (typeof n === "string") acc.push(n);
    else if (n && n._type === "span" && typeof n.text === "string") acc.push(n.text);
    else if (n && Array.isArray(n.children)) collectText(n.children, acc);
  }
}

export function estimateReadingTime(blocks) {
  if (!Array.isArray(blocks) || blocks.length === 0) return 1;
  const acc = [];
  collectText(blocks, acc);
  const words = acc.join(" ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
