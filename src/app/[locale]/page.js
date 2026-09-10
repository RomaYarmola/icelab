import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import NoCompromises from "../components/common/NoCompromises/NoCompromises";
import About from "../components/main/Home/About/About";
import Faq from "../components/main/Home/Faq/Faq";
import Hero from "../components/main/Home/Hero/Hero";
import Products from "../components/main/Home/Products.jsx/Products";
import CatalogCategories from "../components/main/Home/CatalogCategories/CatalogCategories";
import TopProducts from "../components/main/Home/TopProducts/TopProducts";
import CityPickup from "../components/main/Home/CityPickup/CityPickup";
import Reviews from "../components/main/Home/Reviews/Reviews";

// ISR: товари на головній оновлюються з CMS без ребілду (як у каталозі).
export const revalidate = 3600;

// Метадані головної — з неймспейсу Meta (для кожної мови окремо).
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: locale === routing.defaultLocale ? "/" : `/${locale}`,
      languages: { uk: "/", ru: "/ru", "x-default": "/" },
    },
  };
}

// Серверна головна сторінка: увесь контент секцій потрапляє в SSR-HTML
// (клієнтські секції теж рендеряться на сервері). Лоадер прибрано, щоб
// краулери без JS бачили H1, FAQ і назви продуктів.
export default async function Home({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Products />
      <CatalogCategories locale={locale} />
      <TopProducts locale={locale} />
      <CityPickup locale={locale} />
      <About />
      <Reviews locale={locale} />
      <Faq />
      <NoCompromises />
    </>
  );
}
