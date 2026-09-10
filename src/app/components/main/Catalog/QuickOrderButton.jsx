"use client";
import { useDisclosure } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import RequestModal from "@/app/components/common/RequestModal";
import { formatPrice } from "@/utils/pricing";

// «Швидке замовлення» — друга кнопка в картці товару поруч із «У кошик».
//
// НАВІЩО. Частина покупців не хоче проходити кошик і оформлення: їм швидше
// лишити телефон і щоб передзвонили. Раніше такий сценарій був лише на
// головній (модалка калькулятора) і на сторінці товару (оптовий прайс), а в
// каталозі — ні: єдиною дією було «Додати в кошик».
//
// Назва товару й ціна йдуть у контекст заявки, тож менеджер одразу бачить,
// що саме замовляють (Telegram + Google Таблиця, див. RequestModal).
export default function QuickOrderButton({ product, tone = "dark" }) {
  const t = useTranslations("ProductPage");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const onDark = tone === "dark";
  const context = `${product.title} — ${formatPrice(product.price)} ${product.unit}`;

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
        className={`w-full h-[40px] rounded-md border-[1.5px] px-2 not-italic font-e-ukraine text-[11px] font-medium transition-colors ${
          onDark
            ? "border-white/40 text-white hover:bg-white/10 active:bg-white/15"
            : "border-commonBlue text-commonBlue hover:bg-commonBlue/[0.06]"
        }`}
      >
        {t("quickOrder")}
      </button>

      <RequestModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title={t("quickOrderTitle")}
        context={context}
      />
    </>
  );
}
