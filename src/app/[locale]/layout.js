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
import { getPriceSettings } from "@/lib/priceSettings";
import { siteGraph } from "@/lib/schema";
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
      path: "../../../public/fonts/e-ukraine/e-Ukraine-Thin.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../../public/fonts/e-ukraine/e-Ukraine-UltraLight.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../../public/fonts/e-ukraine/e-Ukraine-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../public/fonts/e-ukraine/e-Ukraine-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../public/fonts/e-ukraine/e-Ukraine-Medium.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../../public/fonts/e-ukraine/e-Ukraine-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-e-ukraine",
  display: "swap",
});

const michelin = localFont({
  src: [
    {
      path: "../../../public/fonts/Michelin-Bold.ttf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../../../public/fonts/Michelin-SemiBold.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../../public/fonts/Michelin-Regular.ttf",
      weight: "400",
      style: "italic",
    },
  ],
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

  // Повідомлення для клієнтських компонентів.
  const messages = await getMessages();

  // Налаштування цін із Sanity (fallback — константи) для калькулятора головної.
  const priceSettings = await getPriceSettings();

  return (
    <html lang={locale} className={`${eUkraine.variable} ${michelin.className}`}>
      <body className="leading-[1.2] italic bg-white">
        {/* Глобальний граф: WebSite + Organization, зв'язані @id (один раз) */}
        <JsonLd data={siteGraph()} />
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-N8KCJMXP');`}
        </Script>
        {/* End Google Tag Manager */}
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
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17838270814"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17838270814');
          `}
        </Script>
        {/* Microsoft Clarity */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "xnw4p46kh9");`}
        </Script>
        {/* End Microsoft Clarity */}
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
