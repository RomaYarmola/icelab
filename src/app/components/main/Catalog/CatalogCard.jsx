import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import AddToCartControl from "./AddToCartControl";

// Картка товару в каталозі (стиль сайту icelab). Купівля можлива прямо
// з картки (AddToCartControl), а зображення й назва відкривають сторінку
// товару. Перехід на сторінку товару не обов'язковий для покупки.
export default function CatalogCard({ product }) {
  const t = useTranslations("ProductPage");
  const href = `/catalog/${product.slug}`;
  const isAvailable = product.availability === "in-stock";
  // Реальні фото льоду показуємо на весь кадр; рендери боксів — вписуємо.
  const imgFit = product.category === "ice-box" ? "object-contain" : "object-cover";

  return (
    <li className="group rounded-xl bg-gradient-card shadow-card p-4 l:p-5 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-modal">
      <Link
        href={href}
        className="relative block w-full h-[200px] rounded-lg overflow-hidden"
      >
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
            isAvailable
              ? "bg-white/15 text-white"
              : "bg-[#F31260]/20 text-white"
          }`}
        >
          {isAvailable ? t("inStock") : t("outOfStock")}
        </span>
      </Link>

      <div className="flex flex-col gap-2 flex-1">
        <Link href={href} className="transition-opacity hover:opacity-80">
          <h3 className="text-lg text-white-gradient leading-tight">
            {product.title}
          </h3>
        </Link>
        <p className="font-e-ukraine font-thin not-italic text-white/70 text-sm line-clamp-2">
          {product.shortDescription}
        </p>
        <p className="main-title-gradient text-xl font-medium font-michelin mt-auto pt-1">
          {product.price}&nbsp;{product.unit}
        </p>
      </div>

      <AddToCartControl product={product} variant="card" />
    </li>
  );
}
