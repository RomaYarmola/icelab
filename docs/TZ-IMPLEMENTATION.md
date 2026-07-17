# ТЗ на реализацию: SEO / Technical / CRO / AI-SEO для IceLab

> **Кому:** исполнителю (Claude Code).
> **Проект:** IceLab — Next.js 15 (App Router), next-intl (uk — без префикса, ru — `/ru`), Sanity CMS, Tailwind, NextUI, Zustand. Продажа/доставка сухого льда, пищевого льда, термобоксов. Города: Киев, Львов.
> **Цель:** топ-1 в Google Украина по коммерческим запросам + попадание в ответы AI (ChatGPT, Perplexity, AI Overviews).
> **Полный аудит-обоснование:** `docs/SEO-AUDIT-ROADMAP.md`. Здесь — только задачи к исполнению.
>
> **НЕ входит в это ТЗ (пока нет данных):** настройка боевого домена и все правки, связанные с реальным доменом; отзывы/рейтинги и `aggregateRating` в Product schema. Эти пункты пропускаем — код писать так, чтобы их легко добавить позже.

---

## 0. Правила работы и самопроверка (читать обязательно)

1. **Двуязычность.** Любой новый текстовый ключ добавляется И в `messages/uk.json`, И в `messages/ru.json`. Ключи должны совпадать 1:1. Если добавил ключ только в один файл — это ошибка.
2. **Не хардкодить текст в JSX.** Весь видимый текст — через `next-intl` (`useTranslations` / `getTranslations`). Исключение — технические строки в JSON-LD.
3. **Не ломать существующую логику** цен (`resolvePrice`), Sanity-fallback, i18n-роутинг.
4. **Порядок выполнения — строго по разделам:** сначала весь P0, потом P1, потом P2. Внутри раздела — по номерам.
5. **После каждой задачи** выполнить её блок «✅ Проверка» (в конце задачи). После каждого раздела — прогнать `npm run build` и убедиться, что сборка проходит без ошибок и новых warning.
6. **Не создавать дубли компонентов/страниц.** Перед созданием файла проверь, нет ли уже похожего.
7. **Каждый коммит — по одной задаче**, сообщение вида `seo(P0-1): server-render homepage`.
8. **В конце всей работы** заполнить итоговый чек-лист (раздел 5) — отметить каждый пункт как выполненный и указать изменённые файлы.

**Глобальный self-check после всех работ (обязательный прогон):**
- [ ] `npm run build` — зелёный, без ошибок.
- [ ] На каждой странице ровно **один `<h1>`**. Нет пропусков уровней (h1→h3 без h2).
- [ ] Нет ссылок на несуществующие страницы (проверить футер, меню, перелинковку).
- [ ] У каждого `<Image>` осмысленный `alt` (не «icon», не «about-one»).
- [ ] JSON-LD валиден (проверить структуру вручную по разделу 4).
- [ ] Служебные страницы (`/basket`, `/thanks`) отдают `noindex`.
- [ ] Все новые ключи есть в обоих `messages/*.json`.

---

# P0 — Критично (до релиза)

## P0-1. Сделать главную страницу серверной (убрать `withLoader`)

**Проблема:** `src/app/[locale]/page.js` помечена `"use client"` и обёрнута в `withLoader`. На сервере `isLoading=true` → в HTML попадает только `<Loader/>`, весь контент рендерится на клиенте. Краулеры без JS (AI-боты) видят пустую страницу.

**Задачи:**
1. В `src/app/[locale]/page.js`:
   - Убрать `"use client"` и `withLoader`. Сделать компонент серверным (`async function`).
   - Добавить `setRequestLocale(locale)` и `generateMetadata` (см. значения ниже).
   - Оставить рендер секций: `<Hero/> <Products/> <About/> <Faq/> <NoCompromises/>`.
2. Секции, которым нужен клиент (`useIsSafari`, framer-motion, `usePriceSettings`), оставить `"use client"` — они уже такие. Серверная страница может их импортировать; контент при этом попадёт в SSR-HTML (клиентские компоненты рендерятся на сервере тоже — важно лишь, что мы больше не прячем их за `isLoading`).
3. `withLoader` со страниц удалить. Если он больше нигде не используется — удалить файл `src/helpers/withLoader.js` и компонент `Loader`, если он не нужен. **Сначала проверь** `grep -r withLoader src`.
4. Значения `generateMetadata` для главной берём из namespace `Meta` (см. P1-1, где мы улучшаем эти тексты).

**✅ Проверка:** `npm run build`, затем открыть исходный HTML главной (`curl` или View Source) — в нём должны присутствовать текст H1 «Сухий лід», вопросы FAQ и названия продуктов **без выполнения JS**. Лоадер не мигает.

---

## P0-2. Исправить иерархию заголовков и добавить недостающие H1

**Проблема (подтверждено по коду):**
- `/contacts`, `/payment-and-delivery`, `/delivery` — **нет `<h1>`**, заглавие баннера сделано `<h2>`.
- Главная: Hero `h1→h3` (пропуск h2); секция Products без `h2`, а карточки — `h3`; About идёт `h3 → h2("ICELAB") → h4 → h5×4` (порядок нарушен, «ICELAB» как заголовок бесполезен).

**Задачи:**

1. **`src/app/components/main/Contacts/Banner/Banner.jsx:11`** — заменить `<h2>` на `<h1>` (заголовок «Контакти»). Это единственный H1 страницы контактов.
2. **`src/app/components/main/PaymentAndDelivery/Banner/Banner.jsx:11`** — заменить `<h2>` на `<h1>`.
3. **`/delivery`** (`src/app/components/main/Delivery/...`) — убедиться, что есть один `<h1>`; если заголовок — `h2/h3`, повысить до `h1`. (Если `/delivery` удаляется в P0-4 — пропустить.)
4. **Hero** (`src/app/components/main/Home/Hero/Hero.jsx:20`) — подзаголовок сейчас `<h3>`. Заменить на `<p>` (это не заголовок, а слоган). H1 остаётся один.
5. **Products (главная):** в `src/app/components/main/Home/Products.jsx/Products.jsx` добавить заголовок секции `<h2>` перед списком (текст из нового ключа `Products.sectionTitle`, значение ниже). Если по дизайну заголовок не нужен визуально — сделать его визуально скрытым, но доступным: `<h2 className="sr-only">`. Тогда карточки-`h3` получат родителя.
6. **About** (`src/app/components/main/Home/About/About.jsx`):
   - Строка 40: `<h3>{t("subtitle")}</h3>` («Про нас») → сделать **`<h2>`** (это заголовок секции About).
   - Строки 43–45: `<h2>ICELAB</h2>` → заменить на `<p>` или `<span>` (бренд-надпись, не заголовок).
   - Строка 48: tagline `<h4>` → `<p>` (это слоган, не заголовок).
   - Строки 64,73,89,115: заголовки блоков `<h5>` → **`<h3>`** (они логически подчинены h2 «Про нас»).

**Значения ключей (добавить в оба `messages/*.json`, namespace `Products`):**
- `uk.json` → `"sectionTitle": "Наша продукція"`
- `ru.json` → `"sectionTitle": "Наша продукция"`

**✅ Проверка:** на каждой странице ровно один `<h1>`; порядок уровней без пропусков (h1→h2→h3). Прогнать глазами структуру главной: `h1`(Hero) → `h2`(Products) → `h3`(карточки) → `h2`(About «Про нас») → `h3`(блоки) → `h2`(FAQ) → `h2`(NoCompromises).

---

## P0-3. Юридические и сервисные страницы + починка футера (убрать 404)

**Проблема:** `src/utils/routes.js` → `footerLinks` ведут на `/privacy-policy` и `/terms`, которых нет → 404 на каждой странице.

**Задачи:**

1. Создать страницы (серверные, с `generateMetadata`, `setRequestLocale`, один `<h1>`, хлебные крошки — см. P1-4):
   - `src/app/[locale]/privacy-policy/page.jsx` — Політика конфіденційності.
   - `src/app/[locale]/terms/page.jsx` — Публічна оферта.
   - `src/app/[locale]/payment/page.jsx` — Оплата.
   - `src/app/[locale]/returns/page.jsx` — Гарантії та повернення.
2. Контент вынести в namespace `messages/*.json` (см. ключи ниже). Тексты — заготовки, помеченные комментарием `<!-- TODO: юридическая вычитка -->`; структуру и H1/meta задать сразу.
3. Обновить `src/utils/routes.js`:
   - `footerLinks` перевести на i18n-ключи (не хардкод «Privacy Policy»): каждый пункт `{ key, path }`, `key` из namespace `Footer.links`.
   - Пути: `/privacy-policy`, `/terms`, `/payment`, `/returns`.
4. Добавить эти пути в `src/app/sitemap.js` → массив `staticPaths`.
5. Проверить `FooterNav.jsx` — рендерит ли он `footerLinks`; если да, обновить под новую структуру ключей.

**Ключи (оба файла), namespace `LegalPages` — задать H1 и meta:**
```
uk.json:
"LegalPages": {
  "privacy":  { "h1": "Політика конфіденційності", "metaTitle": "Політика конфіденційності | IceLab", "metaDescription": "Як IceLab обробляє та захищає ваші персональні дані." },
  "terms":    { "h1": "Публічна оферта",           "metaTitle": "Публічна оферта | IceLab",            "metaDescription": "Умови продажу та доставки продукції IceLab." },
  "payment":  { "h1": "Оплата",                    "metaTitle": "Оплата — способи оплати | IceLab",     "metaDescription": "Готівка, термінал, оплата на рахунок, договір для бізнесу." },
  "returns":  { "h1": "Гарантії та повернення",    "metaTitle": "Гарантії та повернення | IceLab",      "metaDescription": "Гарантії якості сухого льоду та умови повернення." }
}
ru.json: те же ключи, значения на русском.
```
**`Footer.links` (оба файла):** `"links": { "privacy": "Політика конфіденційності", "terms": "Публічна оферта", "payment": "Оплата", "returns": "Гарантії та повернення" }` (ru — на русском).

**✅ Проверка:** клик по каждой ссылке футера открывает страницу (не 404). Все 4 пути есть в `/sitemap.xml`. У каждой страницы один `<h1>` и уникальные title/description.

---

## P0-4. Закрыть служебные страницы от индексации + robots.txt

**Задачи:**
1. `src/app/[locale]/basket/page.jsx` и `src/app/[locale]/thanks/page.jsx` — добавить
   `export const metadata = { robots: { index: false, follow: false } };`
2. `src/app/robots.js` — расширить:
   - `disallow: ["/basket", "/thanks", "/ru/basket", "/ru/thanks"]` в общем правиле.
   - Оставить `sitemap`.
   - Добавить явные правила для AI-ботов (см. P1-6, делаем вместе). Пока минимум — не блокировать их.

**✅ Проверка:** meta-роботы на `/basket`, `/thanks` = `noindex, nofollow`. `/robots.txt` содержит `Disallow` для корзины и `Sitemap:`.

---

## P0-5. Ревизия дублирующих роутов `/delivery` vs `/payment-and-delivery`

**Проблема:** две страницы о доставке; `/delivery` не в меню и не в sitemap → потенциальная каннибализация/дубль.

**Задачи (выбрать по факту контента):**
1. Определить, что каноническая — `/payment-and-delivery` (она в меню).
2. Если `/delivery` дублирует контент — удалить страницу и добавить 301-редирект `/delivery → /payment-and-delivery` (и `/ru/delivery → /ru/payment-and-delivery`) через `redirects()` в `next.config.mjs`.
3. Если контент уникален (форма заказа) — оставить, но задать уникальные H1/meta и добавить в sitemap; развести интенты, чтобы не пересекались с `/payment-and-delivery`.
4. Зафиксировать решение комментарием в коде.

**✅ Проверка:** нет двух страниц с одинаковым контентом и пересекающимися ключами. Если редирект — он 301 и работает для обеих локалей.

---

# P1 — Обязательно

## P1-1. Улучшить метатеги (title/description) по всем страницам

**Проблема:** `Meta.title = "IceLab"` (без ключевиков), `Meta.description` короткая.

**Задачи:** обновить значения в `messages/uk.json` и `messages/ru.json`.

**`Meta` (главная):**
```
uk: "title": "Сухий лід у Києві та Львові — купити від виробника | IceLab",
    "description": "Сухий лід від виробника IceLab: гранули 3/8/16 мм, термобокси, доставка по Україні Новою Поштою та самовивіз у Києві та Львові. Власне виробництво, стабільна якість."
ru: "title": "Сухой лёд в Киеве и Львове — купить от производителя | IceLab",
    "description": "Сухой лёд от производителя IceLab: гранулы 3/8/16 мм, термобоксы, доставка по Украине Новой Почтой и самовывоз в Киеве и Львове. Собственное производство, стабильное качество."
```
**`Catalog.metaTitle/metaDescription`** — уже есть, оставить или усилить ключами «купити/ціна».
**`Blog.metaTitle/metaDescription`** — оставить.
Для категорий и новых страниц meta задаётся в их задачах.

**Правило длины:** title ≤ 60 симв., description 140–160 симв. Не переспамливать (вредит и в AI).

**✅ Проверка:** у каждой индексируемой страницы уникальные title и description; длины в пределах; ключевые слова присутствуют естественно.

---

## P1-2. Система микроразметки Schema.org (JSON-LD)

**Проблема:** микроразметки нет вообще (0 совпадений `ld+json`).

**Задачи:**
1. Создать `src/lib/schema.js` с чистыми функциями-билдерами, возвращающими JS-объекты:
   - `organizationSchema()` — Organization.
   - `localBusinessSchema(city)` — LocalBusiness (Киев/Львов), данные из `messages.Contacts.cities`.
   - `productSchema(product)` — Product + offers (**без `aggregateRating` — отзывов пока нет**).
   - `breadcrumbSchema(items)` — BreadcrumbList.
   - `faqSchema(items)` — FAQPage.
   - `articleSchema(post)` — BlogPosting.
2. Создать компонент `src/app/components/common/JsonLd.jsx`:
   ```jsx
   export default function JsonLd({ data }) {
     return <script type="application/ld+json"
       dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
   }
   ```
3. Разместить разметку:
   - **Organization** — в `src/app/[locale]/layout.js` (глобально, один раз).
   - **LocalBusiness ×2** — на `/contacts` (Киев и Львов).
   - **Product** — на `/catalog/[slug]` (из объекта `product`).
   - **BreadcrumbList** — на всех вложенных страницах (вместе с P1-4).
   - **FAQPage** — на главной (секция FAQ) и на будущей странице `/faq` (P1-5).
   - **BlogPosting** — на `/blog/[slug]`.
4. Данные брать из существующих источников (Sanity `product`, `messages.Contacts`, `messages.Faq`, `post.publishedAt`). **Дублировать контент запрещено** — только ссылки на уже имеющиеся данные.
5. Домен для абсолютных URL брать из `process.env.NEXT_PUBLIC_SITE_URL` (как уже делается в sitemap). Точные примеры структуры — в разделе 4 этого ТЗ.

**✅ Проверка:** на каждой целевой странице в HTML есть `<script type="application/ld+json">`; JSON парсится; типы соответствуют разделу 4; в Product нет `aggregateRating`; URL абсолютные.

---

## P1-3. Категорийные посадочные страницы каталога

**Проблема:** плоский каталог; нет URL под «сухий лід купити», «харчовий лід», «термобокс купити».

**Задачи:**
1. Роут: `src/app/[locale]/catalog/c/[category]/page.jsx` (префикс `/c/` — чтобы не конфликтовать с `/catalog/[slug]` товара).
2. Категории (ключи уже есть в Sanity `category->key`): `dry-ice`, `food-ice`, `ice-box`.
   URL-слаги: `suhyi-lid`, `harchovyi-lid`, `termoboksy`. Сделать маппинг `slug↔categoryKey` в коде.
3. `generateStaticParams` — по списку категорий (обе локали).
4. `generateMetadata` — title/description из namespace `Categories` (значения ниже).
5. Контент страницы категории:
   - один `<h1>` (из `Categories.<cat>.h1`);
   - SEO-текст 300–500 слов (`Categories.<cat>.intro` — заготовка, помечена TODO для копирайта; структуру задать сразу);
   - список товаров категории (переиспользовать `CatalogList`/`CatalogCard`, фильтр `getProducts` по категории);
   - блок FAQ по категории (`faqSchema`);
   - хлебные крошки (P1-4);
   - перелинковка: ссылки на другие категории + на pillar «Застосування» (P1-5).
6. В `getProducts` (или новой `getProductsByCategory(locale, categoryKey)`) добавить фильтрацию по категории (GROQ или на клиенте фильтр по `product.category`).
7. Добавить категории в `sitemap.js` (3 категории × альтернативы uk/ru).
8. Добавить ссылки на категории в меню/каталог-хаб `/catalog` (сделать `/catalog` хабом категорий + общий список).

**Ключи (оба файла), namespace `Categories`:**
```
uk.json:
"Categories": {
  "dryIce":   { "h1": "Сухий лід", "metaTitle": "Сухий лід купити — ціна від виробника | IceLab", "metaDescription": "Сухий лід у гранулах 3/8/16 мм від виробника. Доставка по Україні, самовивіз у Києві та Львові. Опт і роздріб.", "intro": "TODO: SEO-текст 300–500 слів про сухий лід, застосування, фасування, доставку." },
  "foodIce":  { "h1": "Харчовий лід", "metaTitle": "Харчовий лід купити — кубики, лід для напоїв | IceLab", "metaDescription": "Харчовий лід: кубики та лід для коктейлів і напоїв. Доставка по Україні.", "intro": "TODO: SEO-текст про харчовий лід." },
  "iceBox":   { "h1": "Термобокси для льоду", "metaTitle": "Термобокс для сухого льоду купити | IceLab", "metaDescription": "Термобокси та термоконтейнери для зберігання і транспортування сухого льоду. Розміри 15 та 33 кг.", "intro": "TODO: SEO-текст про термобокси." }
}
ru.json: те же ключи, значения на русском.
```

**✅ Проверка:** открываются `/catalog/c/suhyi-lid`, `/catalog/c/harchovyi-lid`, `/catalog/c/termoboksy` (и `/ru/...`); один H1; список товаров категории верный; страницы в sitemap; нет конфликта роутинга с `/catalog/[slug]`.

---

## P1-4. Хлебные крошки (UI + BreadcrumbList schema)

**Задачи:**
1. Компонент `src/app/components/common/Breadcrumbs.jsx`: принимает `items = [{ name, href }]`, рендерит навигацию (`<nav aria-label="breadcrumb">`) + подключает `JsonLd` с `breadcrumbSchema(items)`.
2. Разместить на: `/catalog`, `/catalog/c/[category]`, `/catalog/[slug]`, `/blog`, `/blog/[slug]`, всех статических (about/production/certificates/faq/payment/returns/terms/privacy/contacts/payment-and-delivery).
3. Первый элемент всегда «Головна» → `/`. Тексты — через i18n (namespace `Breadcrumbs`: `home`, и остальные брать из заголовков страниц/названий товаров).

**✅ Проверка:** крошки видны и кликабельны; в HTML есть `BreadcrumbList` JSON-LD; последний элемент — текущая страница без ссылки.

---

## P1-5. Отдельная страница FAQ + контент-хаб «Застосування»

**Задачи:**
1. **Страница `/[locale]/faq`** (`src/app/[locale]/faq/page.jsx`):
   - серверная, один `<h1>`, `generateMetadata`, крошки, `FAQPage` schema;
   - контент — из `messages.Faq.items`, **расширить с 4 до 15–20 вопросов** (добавить: безпека для дітей/тварин; перевезення в авто/літаком; утилізація; відмінність гранул 3/8/16 мм; мінімальне замовлення; опт; скільки льоду потрібно на N годин; чи можна їсти/торкатись; зберігання без термобоксу). Формулировки — как реальные запросы.
   - На главной оставить топ-5 вопросов + ссылка «Всі питання» → `/faq`.
   - **Избежать дубля:** на главной и на `/faq` FAQPage-schema не должна полностью повторять один и тот же полный набор дважды; на главной — подмножество, на `/faq` — полный. Это ок (разные наборы).
2. **Pillar `/[locale]/zastosuvannia-suhogo-lodu`** + опционально под-страницы:
   - H1 «Застосування сухого льоду», разделы: охолодження/логістика, спецефекти (весілля/сцена/туман), криобластинг/очищення, медицина/біоматеріали, HoReCa.
   - Каждый раздел — извлекаемый блок: прямой ответ в первых 40–60 словах + деталь.
   - Перелинковка на категории (P1-3) и товары.
   - meta из namespace `Applications`.
3. Тексты новых разделов — в `messages/*.json` (namespace `Faq.itemsFull` для полного FAQ, `Applications` для pillar), заготовки помечать TODO, но H1/meta/структуру задать сразу.

**✅ Проверка:** `/faq` и `/zastosuvannia-suhogo-lodu` открываются (обе локали), один H1, крошки, FAQPage/Article schema; на главной — 5 вопросов + рабочая ссылка на `/faq`.

---

## P1-6. AI-боты в robots + `llms.txt` + `pricing.md`

**Задачи:**
1. `src/app/robots.js` — добавить в массив `rules` явные разрешения для AI-краулеров (отдельными объектами `{ userAgent, allow: "/" }`): `GPTBot`, `ChatGPT-User`, `OAI-SearchBot`, `PerplexityBot`, `ClaudeBot`, `anthropic-ai`, `Google-Extended`, `Bingbot`. Общее правило `*` оставить, `Disallow` служебных из P0-4 сохранить.
2. Создать `public/llms.txt` (Markdown, 20–40 осмысленных ссылок с описаниями): краткое описание IceLab (кто, города, что продаём, УТП), затем ссылки: главная, категории (3), FAQ, застосування, доставка/оплата, контакти, ключевые статьи блога. Каждая ссылка с 1 предложением-описанием. **Не** дампить весь sitemap.
3. Создать `public/pricing.md` — тарифная сетка сухого льда (из `constants.js` / Price Settings): диапазоны веса и цена/кг + цены боксов 15/33 кг. Формат — простой Markdown-список, парсится без JS.

**Пример `pricing.md` (значения из `DRY_ICE_PRICING`):**
```
# Прайс IceLab — сухий лід
- 5–30 кг — 75 грн/кг
- 31–100 кг — 60 грн/кг
- 101–300 кг — 60 грн/кг
- 301–500 кг — 55 грн/кг
## Термобокси
- Бокс 15 кг — 500 грн
- Бокс 33 кг — 650 грн
Доставка: Нова Пошта по Україні; самовивіз — Київ, Львів.
```
(Синхронизировать с актуальными ценами из `messages.Products` / Price Settings.)

**✅ Проверка:** `/robots.txt` содержит правила для AI-ботов; `/llms.txt` и `/pricing.md` доступны и валидны; ссылки в llms.txt рабочие.

---

## P1-7. Усилить карточку товара (коммерческие факторы)

**Проблема:** карточка = картинка + цена + характеристики + кнопка. Нет доверия и аргументов.

**Задачи (файл `src/app/[locale]/catalog/[slug]/page.jsx` + новые под-компоненты):**
1. **Хлебные крошки** (P1-4): Головна → Каталог → Категорія → Товар.
2. **Блок «Доставка та оплата»** (переиспользовать тексты из `messages.UkraineDelivery` / `SelfDelivery`): Нова Пошта, самовивіз Київ/Львів, сроки, примечание про сублимацию −10%/добу.
3. **Блок «Способи оплати»**: готівка / термінал / рахунок / договір (B2B).
4. **Блок «Чому IceLab» (УТП)**: сухість CO₂, стабільна гранула, власне виробництво, наявність у пік сезону. Ключи из нового namespace `Usp`.
5. **Cross-sell «З цим купують»**: к сухому льду — термобокс/рукавиці; блок «Схожі товари» (та же категория). Данные — `getProducts` с фильтром по категории, исключая текущий.
6. **Второй CTA** для B2B: «Отримати прайс» (открывает форму/модалку) рядом с «Додати в кошик».
7. **Product schema** (P1-2) — уже подключается здесь.
8. Хлебные крошки и блоки — через i18n (namespaces `Usp`, `ProductPage`).

**Ключи `Usp` (оба файла):**
```
uk: "Usp": { "title": "Чому IceLab", "items": ["Суха вуглекислота — максимальний ефект навіть у літню спеку","Стабільна якість гранули з циклу в цикл","Власне виробництво до 400 кг/год і склад сировини 60 т","Наявність продукту навіть у пікові періоди"] }
ru: аналогично на русском.
```

**✅ Проверка:** на странице товара присутствуют крошки, блоки доставки/оплаты/УТП, cross-sell, два CTA; Product schema в HTML; все тексты локализованы (uk/ru).

---

## P1-8. Страницы EEAT: «Про компанію», «Виробництво», «Сертифікати»

**Задачи:**
1. Создать серверные страницы: `src/app/[locale]/about/page.jsx`, `/production/page.jsx`, `/certificates/page.jsx`. Один `<h1>`, `generateMetadata`, крошки.
2. Контент:
   - **About**: история, миссия, цифры (400 кг/год, склад 60 т, 2 города) — переиспользовать тексты из `messages.About`, расширить.
   - **Production**: оборудование, мощности, контроль качества (заготовка + место под фото/видео).
   - **Certificates**: сетка сертификатов (заготовка под изображения; TODO — реальные файлы).
3. meta — namespace `Pages` (about/production/certificates).
4. Добавить страницы в футер-меню и sitemap.
5. Связать с Organization schema (`about` как `Organization.url`/`sameAs` не нужно; просто внутренняя перелинковка).

**Ключи `Pages` (оба файла):** `about/production/certificates` → `{ h1, metaTitle, metaDescription, intro(TODO) }`.

**✅ Проверка:** 3 страницы открываются (uk/ru), один H1, в sitemap и в футере, крошки, уникальные meta.

---

## P1-9. OpenGraph/Twitter: дефолты и fallback-картинка

**Проблема:** в `src/lib/seo.js` `openGraph.images: []` если у товара/статьи нет своей og-картинки.

**Задачи:**
1. В `src/lib/seo.js`: задать fallback og-image (брендовый дефолт из `public/`), `openGraph.siteName = "IceLab"`, `openGraph.locale` (uk_UA / ru_RU), `openGraph.url` (абсолютный canonical).
2. В `layout.js` `generateMetadata` — добавить дефолтные `openGraph`/`twitter` на уровень сайта (siteName, type=website, дефолтная картинка), чтобы страницы без своих og наследовали.
3. Twitter card оставить `summary_large_image`, добавить fallback image.

**✅ Проверка:** у товара/статьи без своей картинки в HTML всё равно есть `og:image`, `og:site_name`, `og:locale`.

---

## P1-10. Core Web Vitals: приоритеты, alt, CLS

**Задачи:**
1. **LCP:** после P0-1 задать `priority` LCP-элементу главной (фон/картинка Hero) и `preload` шрифта, если нужен для первого экрана.
2. **CLS:** проверить сдвиги от локальных шрифтов (Michelin italic на `<html>`), Hero-облаков и картинок без размеров. Всем декоративным `Image fill` задать контейнер с фиксированной высотой (частично уже есть). Для шрифтов рассмотреть `adjustFontFallback`/`size-adjust`.
3. **alt:** заменить бессмысленные alt на осмысленные:
   - `Footer.jsx`: `alt="logo"` → «IceLab логотип», `alt="co2"` → «CO2LAB», `alt="decor-mob"/"decor-desk"` → оставить декоративными: `alt=""` + `aria-hidden` (уже частично).
   - `About.jsx`: `alt="about-one/two/decor"`, карусель `carousel-one..four` → осмысленные («Виробництво сухого льоду», «Гранули сухого льоду» и т.п.).
   - `Details.jsx`: `alt="icon"` → `alt=""` (декоративная иконка) либо осмысленно.
4. **INP:** уменьшить клиентский JS — секции, где анимация чисто декоративна, перевести на CSS, не тянуть framer-motion без необходимости. (Не ломать существующее — только явные случаи.)
5. Прогнать Lighthouse (mobile) после правок; зафиксировать цифры LCP/CLS/INP в комментарии PR. Цели: LCP < 2.5s, CLS < 0.1, INP < 200ms.

**✅ Проверка:** нет `alt` вида «icon/about-one/decor» у смысловых картинок; декоративные — `alt=""`; Lighthouse mobile Performance ≥ 85; CLS < 0.1.

---

## P1-11. Внутренняя перелинковка

**Задачи:**
1. **Товар → категория** (через крошки, уже в P1-4/P1-7).
2. **Категория → pillar/применения и другие категории** (P1-3).
3. **Блог-статья → релевантные категории/товары** (использовать `internalLink` в Portable Text — механизм уже есть в `queries.js`).
4. **Главная**: секция FAQ → ссылка на `/faq`; секция Products → ссылки на категории; About → `/about`.
5. Добавить в футер блок ссылок на категории и ключевые страницы (About/FAQ/Доставка/Оплата/Гарантії).

**✅ Проверка:** от главной до любого товара ≤ 3 клика; у каждой категории есть входящие ссылки; нет «висячих» страниц без внутренних ссылок.

---

# P2 — Желательно

## P2-1. ISR / ревалидация (свежесть без ребилда)
**Проблема:** товары/статьи/sitemap собираются на build-time; новый товар в CMS не появится без пересборки.
**Задачи:** добавить `export const revalidate = 3600;` на списковые/детальные страницы каталога и блога и в `sitemap.js`; при возможности — on-demand revalidation по вебхуку Sanity (route `src/app/api/revalidate/route.js`).
**✅ Проверка:** новый товар в Sanity появляется на сайте и в sitemap без ребилда (в пределах revalidate).

## P2-2. Гео-лендинги «Сухий лід Київ» / «Сухий лід Львів»
**Задачи:** `/[locale]/suhyi-lid-kyiv`, `/suhyi-lid-lviv`; уникальный контент (не копия), адрес, карта, условия доставки/самовывоза в городе, LocalBusiness schema, крошки, meta. Добавить в sitemap и перелинковку.
**✅ Проверка:** 2 страницы, уникальный текст, LocalBusiness по городу, в sitemap.

## P2-3. Cross-sell / upsell в корзине
**Задачи:** в `src/app/components/main/Basket/Basket.jsx` — блок «З цим купують» (термобокс, рукавиці) и апселл по фасовке (більший обсяг — нижча ціна/кг).
**✅ Проверка:** в корзине показываются релевантные допы; добавление работает.

## P2-4. Пересмотреть тотальный `italic` для читаемых зон
**Проблема:** `<body className="... italic">` + Michelin italic как дефолт → длинные тексты (блог, характеристики, FAQ, юр-страницы) трудночитаемы.
**Задачи:** оставить italic как акцент для hero/заголовков; тело блога, характеристики, FAQ, юридические/сервисные страницы рендерить прямым `e-Ukraine` (`not-italic`, шрифт уже подключён). Проверить контраст (WCAG AA).
**✅ Проверка:** длинные тексты не курсивные; контраст ≥ 4.5:1.

## P2-5. Карта Google на контактах и гео-лендингах
**Задачи:** встроить Google Maps (iframe, lazy) с метками Киев/Львов на `/contacts` и гео-лендингах. Телефоны — `tel:`, email — `mailto:`, мессенджеры — ссылки.
**✅ Проверка:** карта грузится лениво, метки верные, контакты кликабельны.

## P2-6. Устранить дубли namespaces/данных
**Задачи:** `Order` и `Basket` в `messages/*.json` дублируют `empty/total/submit` — свести к одному namespace или переиспользовать. Проверить прочие дубли ключей. `AccordionComponent.jsx` (закомментирован в `Faq.jsx`) — удалить, если не используется.
**✅ Проверка:** нет неиспользуемого/дублирующего кода и ключей; сборка чистая.

---

# 4. Приложение: точные структуры JSON-LD (для P1-2)

Домен: `const SITE = process.env.NEXT_PUBLIC_SITE_URL`.

**Organization (layout, глобально):**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "IceLab",
  "url": "{SITE}",
  "logo": "{SITE}/icons/white-logo.svg",
  "sameAs": ["https://instagram.com/icelabua", "https://www.co2lab.pro/"]
}
```
**LocalBusiness (contacts, ×2 — данные из `messages.Contacts.cities`):**
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "IceLab Київ",
  "address": { "@type": "PostalAddress", "streetAddress": "вул. Ягідна, 22а", "addressLocality": "Вишгород", "addressRegion": "Київська обл.", "addressCountry": "UA" },
  "openingHours": "Mo-Fr 09:00-17:00",
  "areaServed": "UA",
  "url": "{SITE}/contacts"
}
```
**Product (`/catalog/[slug]`, БЕЗ aggregateRating):**
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "{product.title}",
  "image": ["{product.gallery...}"],
  "description": "{product.description}",
  "brand": { "@type": "Brand", "name": "IceLab" },
  "offers": {
    "@type": "Offer",
    "price": "{product.price}",
    "priceCurrency": "UAH",
    "availability": "{in-stock → https://schema.org/InStock, иначе OutOfStock}",
    "url": "{SITE}/catalog/{product.slug}"
  }
}
```
**BreadcrumbList:** `itemListElement[]` с `position`, `name`, `item` (абсолютный URL); последний — без `item`.
**FAQPage:** `mainEntity[]` из `{ "@type":"Question","name":question,"acceptedAnswer":{"@type":"Answer","text":answer} }`. `text` — очищенный от HTML (в `messages.Faq` есть теги `<br>`, `<b>` — вырезать перед подстановкой).
**BlogPosting (`/blog/[slug]`):** `headline`, `image`, `datePublished` (`post.publishedAt`), `dateModified`, `author` (`{"@type":"Organization","name":"IceLab"}`), `mainEntityOfPage`.

---

# 5. Итоговый чек-лист (заполнить в конце)

**P0**
- [ ] P0-1 Главная серверная, контент в SSR-HTML без JS. Файлы: `page.js`, (удалён?) `withLoader.js`.
- [ ] P0-2 Один H1 на страницу; добавлены H1 на contacts/payment; иерархия главной исправлена.
- [ ] P0-3 Созданы privacy/terms/payment/returns; футер без 404; страницы в sitemap.
- [ ] P0-4 `noindex` на basket/thanks; robots закрывает служебные.
- [ ] P0-5 Разрулены `/delivery` vs `/payment-and-delivery` (301 или уникализация).

**P1**
- [ ] P1-1 Обновлены Meta/страничные title+description (uk+ru).
- [ ] P1-2 `schema.js` + `JsonLd`; Organization/LocalBusiness/Product/Breadcrumb/FAQ/BlogPosting размещены.
- [ ] P1-3 Категории `/catalog/c/{suhyi-lid,harchovyi-lid,termoboksy}` + тексты + sitemap.
- [ ] P1-4 Хлебные крошки везде + BreadcrumbList.
- [ ] P1-5 Страница `/faq` (15–20 вопросов) + pillar «Застосування»; на главной 5 + ссылка.
- [ ] P1-6 robots для AI-ботов + `llms.txt` + `pricing.md`.
- [ ] P1-7 Усилена карточка товара (крошки, доставка, оплата, УТП, cross-sell, 2 CTA).
- [ ] P1-8 Страницы about/production/certificates + sitemap + футер.
- [ ] P1-9 OG/Twitter дефолты + fallback-картинка.
- [ ] P1-10 CWV: priority/preload, осмысленные alt, CLS < 0.1, Lighthouse ≥ 85.
- [ ] P1-11 Перелинковка: ≤3 клика до товара, нет висячих страниц.

**P2**
- [ ] P2-1 ISR/revalidate. [ ] P2-2 Гео-лендинги. [ ] P2-3 Cross-sell в корзине. [ ] P2-4 Italic пересмотрен. [ ] P2-5 Карта+контакты. [ ] P2-6 Дубли ключей/кода убраны.

**Глобально**
- [ ] `npm run build` зелёный. [ ] Все новые ключи в обоих `messages/*.json`. [ ] JSON-LD валиден. [ ] Один H1/страница. [ ] Нет 404 во внутренних ссылках.

_Указать список всех изменённых/созданных файлов._
