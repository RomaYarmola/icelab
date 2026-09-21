"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { onFirstInteraction } from "./onFirstInteraction";

// GTM (а з ним GA4 і Google Ads) + Microsoft Clarity вантажаться після першої
// дії користувача — скрол, дотик, рух миші, клавіша.
//
// Навіщо: контейнер GTM тягне два gtag.js, разом ~510 КБ і ~0,5 с роботи
// головного потоку. Поки вони виконуються, браузер не малює перший екран —
// це і давало LCP 10,5 с та TBT 750 мс у PageSpeed.
//
// Що це означає для статистики: сесії, у яких людина взагалі нічого не
// зробила (відкрила й одразу закрила), не потраплять у GA4/Ads/Clarity.
// Решта — так, із затримкою у частки секунди від приземлення.
export default function AnalyticsTags() {
  const [ready, setReady] = useState(false);

  useEffect(() => onFirstInteraction(() => setReady(true)), []);

  if (!ready) return null;

  return (
    <>
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-N8KCJMXP');`}
      </Script>

      {/* Google Ads (ремаркетинг), AW-17838270814. Власного <script src>
          немає: gtag.js піднімає GTM, а ця команда лише додає йому ще одне
          призначення — інакше та сама бібліотека качалась би вдруге. */}
      <Script id="google-ads-config" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-17838270814');
        `}
      </Script>

      <Script id="microsoft-clarity" strategy="afterInteractive">
        {`(function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "xnw4p46kh9");`}
      </Script>
    </>
  );
}
