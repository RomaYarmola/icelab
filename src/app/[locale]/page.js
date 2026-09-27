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
      {/* Секції нижче першого екрана браузер не малює, поки до них не дійшли
          (content-visibility: auto, клас cv-auto): менше роботи зі стилями й
          розкладкою до першого кадру і на кожен тап угорі сторінки (INP на
          слабких телефонах). У HTML усе лишається, пошуковики бачать повний
          текст.

          cv-auto — саме на корені секції, НЕ на обгортці. content-visibility
          робить елемент окремим stacking context; обгортка без z-index
          «з'їдала» z-10/z-20 секцій, і декор сусідів малювався поверх них:
          темний градієнт Products (z-3) лягав на заголовок «Каталог за
          категоріями», декор і градієнти About — на відгуки, градієнти
          NoCompromises — на FAQ (27.09.2026). На корені z-index секції
          і контейнер власного шару збігаються. */}
      <CatalogCategories locale={locale} className="cv-auto" />
      <TopProducts locale={locale} className="cv-auto" />
      <HomeNiches locale={locale} className="cv-auto" />
      <CityPickup locale={locale} className="cv-auto" />
      {/* About — без cv-auto: content-visibility обрізає все за межами блока,
          а його хмари, декор і градієнти виходять за межі секції. */}
      <About />
      <Reviews locale={locale} className="cv-auto" />
      <Faq className="cv-auto" />
      {/* NoCompromises — теж без cv-auto: його фон і хмари виходять угору
          за межі секції (top: −165…−667 px). */}
      <NoCompromises />
    </>
  );
}
