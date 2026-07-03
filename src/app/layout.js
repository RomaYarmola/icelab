import localFont from "next/font/local";
import Script from "next/script";
import Footer from "./components/modules/Footer/Footer";
import Header from "./components/modules/Header/Header";
import "./globals.css";

const eUkraine = localFont({
  src: [
    {
      path: "../../public/fonts/e-ukraine/e-Ukraine-Thin.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/e-ukraine/e-Ukraine-UltraLight.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/e-ukraine/e-Ukraine-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/e-ukraine/e-Ukraine-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/e-ukraine/e-Ukraine-Medium.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/e-ukraine/e-Ukraine-Bold.otf",
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
      path: "../../public/fonts/Michelin-Bold.ttf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../../public/fonts/Michelin-SemiBold.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/fonts/Michelin-Regular.ttf",
      weight: "400",
      style: "italic",
    },
  ],
});

export const metadata = {
  title: "IceLab",
  description: "Виробництво сухого льоду у Києві та Львові",
};

export default function RootLayout({ children }) {
  return (
    <html lang="uk" className={`${eUkraine.variable} ${michelin.className}`}>
      <head>
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-N8KCJMXP');`}
        </Script>
        {/* End Google Tag Manager */}
        <meta name="description" content={metadata.description} />
        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <meta name="apple-mobile-web-app-title" content="ICELAB" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="leading-[1.2] italic bg-white">
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
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
