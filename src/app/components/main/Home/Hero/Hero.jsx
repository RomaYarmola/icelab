import Container from "@/utils/Container";
import Image from "next/image";
import GradientButton from "../../../common/GradientButton";
import MessengerButtons from "../../../common/MessengerButtons";
import HeroClouds from "./HeroClouds";
import Link from "next/link";
import { Link as LocaleLink } from "@/i18n/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { getPriceSettings } from "@/lib/priceSettings";
import { mergeTiers } from "@/lib/featured";

// Перший екран головної.
//
// 18.09.2026 (docs/CONVERSIONS-2026-09.md). На телефоні половина відвідувачів
// головної не скролить далі 10 % сторінки, а на підзаголовок і плашку ціни
// нижче тапали як на посилання. Тому в першому екрані тепер:
//  • ціна «від N грн/кг» — посилання на категорію з таблицею цін (N — мінімальна
//    ціна з Price Settings, та сама, що рахує кошик);
//  • кнопки месенджерів — новий відвідувач частіше пише, ніж оформлює кошик;
//  • менший верхній відступ на мобільному; довгий опис — лише з md (текст
//    лишається в HTML для пошуку).
export default async function Hero() {
  const t = await getTranslations("Hero");
  const settings = await getPriceSettings();
  const tiers = mergeTiers(settings.dryIceTiers);
  const minPrice = tiers.length ? Math.min(...tiers.map((x) => x.price)) : null;

  // Російський заголовок довший за український («производителя» — 13 літер),
  // і на частині ширин слово не влазить у рядок, тому переносилось по складах
  // («…ПРОИЗВОДИТЕЛ / Я»). Обмежуємо кегль шириною контейнера (cqi), щоб
  // найдовше слово завжди вміщалось цілком. Українську версію не чіпаємо.
  const isRu = (await getLocale()) === "ru";
  const fitTitle = isRu
    ? "![font-size:min(calc((100cqi_-_16px)/12.1),clamp(32px,6vw,88px))] md:![font-size:min(calc((100cqi_-_16px)/12.1),clamp(58px,8.6vw,96px))]"
    : "";
  return (
    <div className="overflow-x-clip relative h-[864px] ">
      {/* LCP-фон: пріоритетне оптимізоване зображення (preload), а не CSS-фон */}
      <Image
        src="/images/hero/main-bg.webp"
        alt=""
        fill
        priority
        quality={55}
        sizes="100vw"
        className="object-cover object-right"
      />
      {/* Градієнтне перекриття над фото */}
      <div className="absolute inset-0 heroBg" />
      <div className="absolute inset-0">
        <HeroClouds />
      </div>
      <Container>
        <div className="pt-[150px] md:pt-[200px] z-[9999] [container-type:inline-size]">
          <h1
            className={`text-3xl md:text-4xl ${fitTitle} main-title-gradient text-center mb-6 md:mb-[22px] relative z-[1] md:z-[3] px-2 break-words`}
          >
            {t("title")}
          </h1>
          <p className="text-lg-extended text-blue-gradient text-center mb-5 md:mb-8 max-w-[98%] sm:max-w-[66%] mx-auto relative z-10">
            {t("subtitle")}
          </p>
          {minPrice && (
            <div className="flex justify-center mb-6 md:mb-8 relative z-10">
              <LocaleLink
                href="/catalog/c/suhyi-lid"
                className="inline-flex items-center gap-2 h-10 px-5 rounded-full border border-commonBlue/30 bg-white/70 backdrop-blur-sm not-italic font-e-ukraine font-medium text-[14px] hover:bg-white transition-colors"
              >
                <span className="text-blue-gradient font-michelin">
                  {t("priceFrom", { price: minPrice })}
                </span>
                <span className="text-commonBlue">
                  {t("priceLink")} →
                </span>
              </LocaleLink>
            </div>
          )}
          <p className="hidden md:block font-e-ukraine font-thin not-italic text-sm-responsive text-center mb-12 sm:max-w-[41.7%] mx-auto relative z-10">
            {t("description")}
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-6 relative z-10">
            <Link href="#products" className="flex w-[279px] max-w-full">
              <GradientButton text={t("quickOrder")} />
            </Link>
            <LocaleLink href="/catalog" className="flex w-[279px] max-w-full">
              <GradientButton variant="outline" text={t("catalog")} />
            </LocaleLink>
          </div>
          <MessengerButtons
            label={t("writeUs")}
            tone="light"
            className="relative z-10 mb-[52px]"
          />
        </div>
      </Container>
    </div>
  );
}
