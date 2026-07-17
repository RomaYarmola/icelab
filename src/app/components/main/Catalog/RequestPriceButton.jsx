"use client";
import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  Input,
  useDisclosure,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import GradientButton from "@/app/components/common/GradientButton";
import { validateField } from "@/helpers/validation";
import { sendMessage } from "@/utils/sendMessage";

// Кнопка B2B «Отримати оптовий прайс»: НЕ перекидає на /contacts, а відкриває
// модалку із заявкою прямо на сторінці товару. Назва товару додається у
// повідомлення менеджеру.
export default function RequestPriceButton({ label, productTitle }) {
  const t = useTranslations("Modal");
  const tv = useTranslations("Validation");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [form, setForm] = useState({ name: "", phone: "", comment: "" });
  const [phoneError, setPhoneError] = useState("");
  const [sent, setSent] = useState(false);

  const submit = async () => {
    const err = validateField("phone", form.phone, tv);
    setPhoneError(err);
    if (err) return;

    const message = `
💬 Запит прайсу / консультація:
- Товар: ${productTitle}
- Ім'я: ${form.name || "—"}
- Телефон: ${form.phone}
- Повідомлення: ${form.comment || "—"}
`;
    const res = await sendMessage(message);
    if (res?.success) {
      setSent(true);
      setForm({ name: "", phone: "", comment: "" });
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={onOpen}
        className="inline-flex items-center justify-center rounded-full border border-commonBlue/40 px-6 py-3 not-italic font-e-ukraine text-commonBlue hover:bg-commonBlue/10 transition-colors"
      >
        {label}
      </button>

      <Modal
        isOpen={isOpen}
        onOpenChange={(v) => {
          onOpenChange(v);
          if (!v) {
            setSent(false);
            setPhoneError("");
          }
        }}
        placement="center"
        backdrop="blur"
        className="mx-4"
      >
        <ModalContent>
          {() => (
            <ModalBody className="p-6 md:p-8">
              {sent ? (
                <div className="text-center py-6">
                  <p className="text-xl md:text-2xl font-medium main-title-gradient">
                    {t("thanksTitle")}
                  </p>
                  <p className="mt-2 font-e-ukraine not-italic text-commonBlue/70">
                    {t("thanksSubtitle")}
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    submit();
                  }}
                  className="flex flex-col gap-4"
                >
                  <h3 className="text-xl md:text-2xl font-medium main-title-gradient text-center">
                    {label}
                  </h3>
                  <p className="text-center font-e-ukraine not-italic font-thin text-commonBlue/70 text-sm -mt-2">
                    {productTitle}
                  </p>

                  <Input
                    placeholder={t("namePlaceholder")}
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    className="rounded-md contactInput overflow-hidden"
                    classNames={{ input: "font-thin not-italic" }}
                  />

                  <div>
                    <Input
                      isRequired
                      placeholder={t("phonePlaceholder")}
                      value={form.phone}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, phone: e.target.value }))
                      }
                      className="rounded-md contactInput overflow-hidden"
                      classNames={{ input: "font-thin not-italic" }}
                    />
                    {phoneError && (
                      <p className="text-[#F31260] text-[11px] mt-1">
                        {phoneError}
                      </p>
                    )}
                  </div>

                  <textarea
                    placeholder={t("messagePlaceholder")}
                    value={form.comment}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, comment: e.target.value }))
                    }
                    className="contactTextarea block w-full bg-transparent border border-commonBlue rounded-md px-4 py-3 resize-none h-[110px] outline-none font-e-ukraine font-thin not-italic"
                  />

                  <GradientButton type="submit" text={t("submit")} />
                </form>
              )}
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
