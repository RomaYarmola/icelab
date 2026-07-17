import createNextIntlPlugin from "next-intl/plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    // Дозволяємо зображення з Sanity CDN.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

// Підключаємо плагін next-intl і вказуємо шлях до конфігурації запиту.
const withNextIntl = createNextIntlPlugin("./src/i18n/request.js");

export default withNextIntl(nextConfig);
