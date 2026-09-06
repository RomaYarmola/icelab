#!/usr/bin/env node
// Перевірка інтеграції з Google Таблицею: чи є змінні, чи валідний ключ,
// чи має сервісний акаунт доступ до таблиці. Нічого в таблицю не пише.
//
// Локально:
//   node --env-file=.env.local scripts/check-sheets.mjs
// Зі змінними з Vercel:
//   vercel env pull .env.vercel && node --env-file=.env.vercel scripts/check-sheets.mjs
//
// Секрети не друкуються — тільки довжини й перші символи.

import { createSign } from "node:crypto";

const TOKEN_URI = "https://oauth2.googleapis.com/token";

function normalizePrivateKey(raw) {
  let key = String(raw || "").trim();
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }
  return key.replace(/\\n/g, "\n").trim();
}

const SHEET_ID = process.env.GOOGLE_SHEETS_ID;
const SA_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const RAW_KEY = process.env.GOOGLE_PRIVATE_KEY;
const SA_KEY = normalizePrivateKey(RAW_KEY);
const TAB = process.env.GOOGLE_SHEETS_TAB || "Аркуш1";

let failed = false;
const fail = (m) => {
  console.error(`FAIL  ${m}`);
  failed = true;
};
const ok = (m) => console.log(`ok    ${m}`);

console.log("1. Змінні оточення");
if (!SHEET_ID) fail("GOOGLE_SHEETS_ID не заданий");
else ok(`GOOGLE_SHEETS_ID = ${SHEET_ID}`);

if (!SA_EMAIL) fail("GOOGLE_SERVICE_ACCOUNT_EMAIL не заданий");
else ok(`GOOGLE_SERVICE_ACCOUNT_EMAIL = ${SA_EMAIL}`);

if (!RAW_KEY) {
  fail("GOOGLE_PRIVATE_KEY не заданий");
} else {
  const hadQuotes = RAW_KEY.trim() !== SA_KEY && /^["']/.test(RAW_KEY.trim());
  if (hadQuotes) {
    console.log("      (значення було в лапках — зняли; у полі Vercel лапки не потрібні)");
  }
  if (!SA_KEY.startsWith("-----BEGIN")) {
    fail(`GOOGLE_PRIVATE_KEY не схожий на PEM, починається з ${JSON.stringify(SA_KEY.slice(0, 20))}`);
  } else if (!SA_KEY.includes("\n")) {
    fail("у GOOGLE_PRIVATE_KEY немає переносів рядків — потрібні або справжні, або \\n");
  } else {
    ok(`GOOGLE_PRIVATE_KEY — PEM, ${SA_KEY.split("\n").length} рядків`);
  }
}
console.log(`ok    аркуш: ${TAB}`);

if (failed) process.exit(1);

console.log("\n2. Токен сервісного акаунта");
const now = Math.floor(Date.now() / 1000);
const b64url = (b) =>
  Buffer.from(b).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
const claim = b64url(
  JSON.stringify({
    iss: SA_EMAIL,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: TOKEN_URI,
    exp: now + 3600,
    iat: now,
  })
);

let assertion;
try {
  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claim}`);
  assertion = `${header}.${claim}.${b64url(signer.sign(SA_KEY))}`;
  ok("JWT підписано");
} catch (e) {
  fail(`не вдалося підписати JWT: ${e.message}`);
  console.error("      найчастіша причина — зайві лапки або зіпсовані переноси в ключі");
  process.exit(1);
}

const tokenRes = await fetch(TOKEN_URI, {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion,
  }),
});
const token = await tokenRes.json();
if (!tokenRes.ok) {
  fail(`Google не видав токен (${tokenRes.status}): ${token.error_description || token.error}`);
  process.exit(1);
}
ok(`токен отримано, дійсний ${token.expires_in} с`);

console.log("\n3. Доступ до таблиці");
const metaRes = await fetch(
  `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}?fields=properties.title,sheets.properties.title`,
  { headers: { Authorization: `Bearer ${token.access_token}` } }
);
const meta = await metaRes.json();
if (!metaRes.ok) {
  fail(`${metaRes.status}: ${meta?.error?.message}`);
  console.error(`      дайте ${SA_EMAIL} права «Редактор» на таблицю`);
  process.exit(1);
}
ok(`таблиця «${meta.properties.title}»`);

const tabs = meta.sheets.map((s) => s.properties.title);
if (!tabs.includes(TAB)) {
  fail(`аркуша «${TAB}» немає. Є: ${tabs.join(", ")}`);
  console.error("      задайте GOOGLE_SHEETS_TAB з правильною назвою");
  process.exit(1);
}
ok(`аркуш «${TAB}» знайдено`);

console.log("\nІнтеграція налаштована коректно.");
