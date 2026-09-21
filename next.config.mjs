import createNextIntlPlugin from "next-intl/plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    // Barrel-імпорти @nextui-org/react і react-icons розгортаються у прямі:
    // у бандл потрапляє тільки те, що справді використано.
    optimizePackageImports: ["@nextui-org/react", "react-icons"],
  },
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
