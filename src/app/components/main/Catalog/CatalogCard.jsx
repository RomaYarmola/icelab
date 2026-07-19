import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import AddToCartControl from "./AddToCartControl";
import { formatPrice } from "@/utils/pricing";

// Категорії, товари яких — рендери/предмети на світлі (вписуємо, не обрізаємо).
const CONTAIN_CATEGORIES = ["ice-box", "krioblasting"];

// Картка товару. Уся картка клікабельна (розтягнуте посилання), а покупка
// можлива прямо з картки через AddToCartControl (він над посиланням і не
// викликає перехід). data-product-card використовує анімація «фото в кошик».
export default function CatalogCard({ product }) {
  const t = useTranslations("ProductPage");
  const href = `/catalog/${product.slug}`;
  const isAvailable = product.availability === "in-stock";
  // Реальні фото льоду показуємо на весь кадр; рендери боксів/апаратів — вписуємо.
  const imgFit = CONTAIN_CATEGORIES.includes(product.category)
    ? "object-contain"
    : "object-cover";

  return (
    <li
      data-product-card
      className="group relative rounded-xl bg-gradient-card shadow-card p-4 l:p-5 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-modal"
    >
      {/* Розтягнуте посилання — робить усю картку клікабельною */}
      <Link
        href={href}
        aria-label={product.title}
        className="absolute inset-0 z-[1] rounded-xl"
      />

      {/* Зображення */}
      <div className="relative z-0 block w-full h-[200px] rounded-lg overflow-hidden">
        {product.mainImage && (
          <Image
            src={product.mainImage}
            alt={product.mainImageAlt || product.title}
            fill
            className={`${imgFit} transition-transform duration-300 group-hover:scale-105`}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        )}
        <span
          className={`absolute top-2 left-2 rounded-full px-3 py-1 text-[11px] font-e-ukraine not-italic backdrop-blur-sm ${
            isAvailable ? "bg-white/15 text-white" : "bg-[#F31260]/20 text-white"
          }`}
        >
          {isAvailable ? t("inStock") : t("outOfStock")}
        </span>
        {product.badge && (
          <span className="absolute top-2 right-2 rounded-full px-3 py-1 text-[11px] font-e-ukraine not-italic bg-commonBlue text-white backdrop-blur-sm">
            {product.badge}
          </span>
        )}
      </div>

      {/* Текстова інформація */}
      <div className="relative z-0 flex flex-col gap-2 flex-1">
        <h3 className="text-lg text-white-gradient leading-tight">
          {product.title}
        </h3>
        <p className="font-e-ukraine font-thin not-italic text-white/70 text-sm line-clamp-2">
          {product.shortDescription}
        </p>
        <p className="mt-auto pt-1 font-e-ukraine not-italic font-bold text-white text-[26px] leading-none">
          {formatPrice(product.price)}
          <span className="text-[16px] font-medium text-white/80 ml-1">
            {product.unit}
          </span>
        </p>
      </div>

      {/* Купівля — над розтягнутим посиланням */}
      <div className="relative z-[2]">
        <AddToCartControl product={product} variant="card" />
      </div>
    </li>
  );
}
