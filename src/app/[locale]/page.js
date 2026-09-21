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
import HomeNiches from "../components/main/Home/HomeNiches/HomeNiches";
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
      {/* 21.09.2026: cv-auto розширено вгору — на телефоні перший екран
          закінчується на 823 px, а Hero має висоту 864 px, тож і категорії,
          і топ-товари гарантовано за межами видимого. Style & Layout до
          першого кадру — 650 мс, і саме розкладка цих двох секцій (сітки
          карток із зображеннями) у ньому найважча. */}
      <div className="cv-auto">
        <CatalogCategories locale={locale} />
      </div>
      <div className="cv-auto">
        <TopProducts locale={locale} />
      </div>
      {/* Нижні секції головної браузер не малює, поки до них не дійшли
          (content-visibility: auto): менше роботи зі стилями й розкладкою на
          кожен тап угорі сторінки — це напряму зменшує INP на слабких
          телефонах. У HTML усе лишається, пошуковики бачать повний текст. */}
      <div className="cv-auto">
        <HomeNiches locale={locale} />
      </div>
      <div className="cv-auto">
        <CityPickup locale={locale} />
      </div>
      {/* About — без cv-auto: його декор звисає на 73 px у наступну секцію,
          а content-visibility обрізає все за межами блока. */}
      <About />
      <div className="cv-auto">
        <Reviews locale={locale} />
      </div>
      <div className="cv-auto">
        <Faq />
      </div>
      {/* NoCompromises — теж без cv-auto: його фон і хмари виходять угору
          за межі секції (top: −165…−667 px). */}
      <NoCompromises />
    </>
  );
}
