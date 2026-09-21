import localFont from "next/font/local";
import Script from "next/script";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { routing } from "@/i18n/routing";
import { pickClientMessages } from "@/i18n/clientNamespaces";
import { getPriceSettings } from "@/lib/priceSettings";
import { siteGraph } from "@/lib/schema";
import { ROBOTS_INDEXABLE } from "@/lib/seo";
import AnalyticsTags from "../components/common/AnalyticsTags";
import JsonLd from "../components/common/JsonLd";
import TrackingProvider from "../components/common/TrackingProvider";
import { PriceSettingsProvider } from "../components/providers/PriceSettingsProvider";
import Footer from "../components/modules/Footer/Footer";
import Header from "../components/modules/Header/Header";
import QuickContact from "../components/common/QuickContact";
import "../globals.css";

const eUkraine = localFont({
  src: [
    {
      path: "../../../public/fonts/e-ukraine/e-Ukraine-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../../public/fonts/e-ukraine/e-Ukraine-UltraLight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../../public/fonts/e-ukraine/e-Ukraine-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../public/fonts/e-ukraine/e-Ukraine-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../public/fonts/e-ukraine/e-Ukraine-Medium.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../../public/fonts/e-ukraine/e-Ukraine-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-e-ukraine",
  display: "swap",
  // Без preload — свідомо.
  //
  // next/font за замовчуванням ставить <link rel="preload"> на кожне
  // накреслення, і всі вісім опинялись у <head> ПЕРЕД прелоадом
  // LCP-картинки. На Slow 4G це 160 КБ шрифтів попереду 12 КБ хмари:
  // PSI показував «resource load delay 700 ms» при TTFB 20 ms.
  //
  // Для першого кадру шрифти не потрібні — стоїть display: swap, а
  // next/font генерує фолбек із підігнаними метриками (ascent-override,
  // size-adjust), тож підміна не рухає розкладку: CLS на проді 0.
  // Ціна — коротка мить системного шрифту на повільному з'єднанні.
  preload: false,
});

const michelin = localFont({
  src: [
    {
      path: "../../../public/fonts/Michelin-Bold.woff2",
      weight: "700",
      style: "italic",
    },
    {
      path: "../../../public/fonts/Michelin-SemiBold.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../../public/fonts/Michelin-Regular.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  display: "swap",
  // Див. коментар до e-Ukraine вище: прелоад шрифтів відбирав канал у
  // LCP-картинки першого екрана.
  preload: false,
});

// Генеруємо статичні сторінки для кожної локалі (uk, ru).
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Метадані формуються з відповідного словника — для кожної мови окремо.
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });

  return {
    // Базовий домен для абсолютних URL (canonical/hreflang/og).
    // У продакшені задається через змінну оточення NEXT_PUBLIC_SITE_URL.
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    ),
    title: t("title"),
    description: t("description"),
    // Дефолтні preview-директиви для всього сайту (див. lib/seo.js).
    // Сторінки з власним noindex (кошик, /thanks, /delivery) перекривають це
    // на своєму рівні.
    robots: ROBOTS_INDEXABLE,
    // Дефолтні OG/Twitter на рівні сайту — сторінки без власних успадковують.
    // Квадратна картинка 600×600 + card "summary" → у Telegram компактне
    // прев'ю (текст ліворуч, невелике фото праворуч), а не величезний банер.
    openGraph: {
      type: "website",
      siteName: "IceLab",
      locale: locale === "ru" ? "ru_RU" : "uk_UA",
      url: locale === routing.defaultLocale ? "/" : `/${locale}`,
      title: t("title"),
      description: t("description"),
      images: [
        { url: "/og-icelab.jpg", width: 600, height: 600, alt: "IceLab" },
      ],
    },
    twitter: {
      card: "summary",
      title: t("title"),
      description: t("description"),
      images: ["/og-icelab.jpg"],
    },
    manifest: "/site.webmanifest",
    icons: {
      icon: [
        { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
        { url: "/favicon.svg", type: "image/svg+xml" },
      ],
      shortcut: "/favicon.ico",
      apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
    },
    other: {
      "apple-mobile-web-app-title": "ICELAB",
    },
    // hreflang-альтернативи для коректної індексації двох мовних версій.
    // Українська (за замовчуванням) — без префікса, російська — з /ru.
    // Активним джерелом hreflang для пошукових систем є також sitemap.xml.
    alternates: {
      canonical: locale === routing.defaultLocale ? "/" : `/${locale}`,
      languages: {
        uk: "/",
        ru: "/ru",
        "x-default": "/",
      },
    },
  };
}

export default async function RootLayout({ children, params }) {
  const { locale } = await params;

  // Захист від невідомих локалей.
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Вмикаємо статичний рендеринг для поточної локалі.
  setRequestLocale(locale);

  // Повідомлення для клієнтських компонентів — лише потрібні їм неймспейси.
  // Весь словник тут означав би ~52 КБ JSON у кожному документі, які браузер
  // ще й парсить під час гідратації; серверні компоненти беруть переклади
  // напряму й у цьому провайдері не мають потреби.
  const messages = pickClientMessages(await getMessages());

  // Налаштування цін із Sanity (fallback — константи) для калькулятора головної.
  const priceSettings = await getPriceSettings();

  return (
    <html lang={locale} className={`${eUkraine.variable} ${michelin.className}`}>
      <body className="leading-[1.2] italic bg-white">
        {/* Глобальний граф: WebSite + Organization, зв'язані @id (один раз) */}
        <JsonLd data={siteGraph()} />
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-N8KCJMXP"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <AnalyticsTags />
        <NextIntlClientProvider messages={messages}>
          <TrackingProvider />
          <PriceSettingsProvider value={priceSettings}>
            <Header />
            <main>{children}</main>
            <Footer />
            <QuickContact />
          </PriceSettingsProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
