"use client";
import { useDisclosure } from "@nextui-org/react";
import RequestModal from "@/app/components/common/RequestModal";

// Кнопка B2B «Отримати оптовий прайс»: відкриває модалку заявки прямо на
// сторінці товару (без переходу). Назва товару йде у повідомлення менеджеру.
export default function RequestPriceButton({ label, productTitle }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <button
        type="button"
        onClick={onOpen}
        className="inline-flex items-center justify-center rounded-full border border-commonBlue/40 px-6 py-3 not-italic font-e-ukraine text-commonBlue hover:bg-commonBlue/10 transition-colors"
      >
        {label}
      </button>

      <RequestModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title={label}
        context={productTitle ? `Товар: ${productTitle}` : undefined}
      />
    </>
  );
}
