#!/usr/bin/env node
// Перевірка, що /sitemap.xml — валідний XML і не порожній.
//
// Навіщо: у липні–серпні 2026 sitemap шість тижнів був невалідним XML через
// голий `&` в URL картинок Sanity. Google показував «Помилка розбору» і
// знаходив 0 сторінок, Ahrefs — 106 сторінок «не в sitemap». Помилку не було
// видно ні в білді, ні на сайті — тільки в GSC. Цей скрипт ловить її за секунду.
//
// Використання:
//   node scripts/check-sitemap.mjs                      # http://localhost:3000
//   node scripts/check-sitemap.mjs https://icelab.com.ua
//   npm run check:sitemap

const base = (
  process.argv[2] ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "http://localhost:3000"
).replace(/\/$/, "");

const url = `${base}/sitemap.xml`;

const fail = (msg) => {
  console.error(`FAIL  ${msg}`);
  process.exitCode = 1;
};

// Мінімальний сканер well-formedness: ловить саме ті класи помилок, які
// реально ламають парсери sitemap — неекранований `&`, неекранований `<`
// у тексті, незакриті теги. Повного XML-парсера тут свідомо немає, щоб не
// тягнути залежність у проєкт без тестового фреймворку.
function checkWellFormed(xml) {
  const problems = [];

  // 1. Голий `&`, який не починає коректну entity.
  const entity = /&(?:[a-zA-Z][a-zA-Z0-9]*|#\d+|#x[0-9a-fA-F]+);/;
  let idx = 0;
  while ((idx = xml.indexOf("&", idx)) !== -1) {
    if (!entity.test(xml.slice(idx, idx + 12))) {
      const line = xml.slice(0, idx).split("\n").length;
      problems.push(
        `рядок ${line}: неекранований "&" → ${JSON.stringify(
          xml.slice(Math.max(0, idx - 40), idx + 40)
        )}`
      );
      if (problems.length > 5) break;
    }
    idx += 1;
  }

  // 2. Баланс тегів.
  const stack = [];
  const tag = /<\/?([A-Za-z_][\w.:-]*)([^>]*?)(\/?)>/g;
  let m;
  while ((m = tag.exec(xml)) !== null) {
    const [full, name, , selfClose] = m;
    if (full.startsWith("<?") || full.startsWith("<!")) continue;
    if (full.startsWith("</")) {
      const open = stack.pop();
      if (open !== name) {
        problems.push(`очікували </${open}>, отримали </${name}>`);
        break;
      }
    } else if (!selfClose) {
      stack.push(name);
    }
  }
  if (stack.length) problems.push(`не закриті теги: ${stack.join(", ")}`);

  return problems;
}

const res = await fetch(url).catch((e) => {
  fail(`не вдалося отримати ${url}: ${e.message}`);
  return null;
});
if (!res) process.exit(1);

if (!res.ok) {
  fail(`${url} віддав HTTP ${res.status}`);
  process.exit(1);
}

const type = res.headers.get("content-type") || "";
if (!/xml/.test(type)) fail(`Content-Type "${type}" — очікували xml`);

const xml = await res.text();
const problems = checkWellFormed(xml);
problems.forEach(fail);

const urls = (xml.match(/<loc>/g) || []).length;
const alternates = (xml.match(/<xhtml:link/g) || []).length;
const images = (xml.match(/<image:image>/g) || []).length;

if (urls === 0) fail("у sitemap жодного <loc>");

console.log(`${url}`);
console.log(`  URL          ${urls}`);
console.log(`  hreflang     ${alternates}`);
console.log(`  image:image  ${images}`);
console.log(`  розмір       ${(xml.length / 1024).toFixed(1)} КБ`);
console.log(process.exitCode ? "\nsitemap НЕВАЛІДНИЙ" : "\nsitemap валідний");
