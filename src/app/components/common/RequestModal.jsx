"use client";
import { useState } from "react";
import { Modal, ModalContent, ModalBody, Input } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import GradientButton from "@/app/components/common/GradientButton";
import PhoneInput from "@/app/components/common/PhoneInput";
import { validateField, validateTelegram, telegramLink } from "@/helpers/validation";
import { sendMessage } from "@/utils/sendMessage";

// Перевикористовувана модалка заявки (ім'я / телефон / повідомлення → Telegram).
// title — заголовок; context — необов'язковий рядок-контекст (напр. назва
// товару), який додається у повідомлення менеджеру.
export default function RequestModal({
  isOpen,
  onOpenChange,
  title,
  context,
}) {
  const t = useTranslations("Modal");
  const tv = useTranslations("Validation");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    telegram: "",
    comment: "",
  });
  const [phoneError, setPhoneError] = useState("");
  const [telegramError, setTelegramError] = useState("");
  const [sent, setSent] = useState(false);

  const submit = async () => {
    const err = validateField("phone", form.phone, tv);
    const tgErr = validateTelegram(form.telegram, tv);
    setPhoneError(err);
    setTelegramError(tgErr);
    if (err || tgErr) return;

    const tgLink = telegramLink(form.telegram);
    const message = `
💬 Заявка / консультація:${context ? `\n- ${context}` : ""}
- Ім'я: ${form.name || "—"}
- Телефон: ${form.phone}${tgLink ? `\n- Telegram: ${tgLink}` : ""}
- Повідомлення: ${form.comment || "—"}
`;
    const res = await sendMessage(message);
    if (res?.success) {
      setSent(true);
      setForm({ name: "", phone: "", telegram: "", comment: "" });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) {
          setSent(false);
          setPhoneError("");
          setTelegramError("");
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
                <p className="not-italic font-e-ukraine font-medium text-[22px] md:text-[26px] leading-tight main-title-gradient">
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
                <h3 className="not-italic font-e-ukraine font-medium text-[22px] md:text-[26px] leading-tight main-title-gradient text-center break-words">
                  {title}
                </h3>
                {context && (
                  <p className="text-center font-e-ukraine not-italic font-thin text-commonBlue/70 text-sm -mt-2">
                    {context}
                  </p>
                )}

                <Input
                  placeholder={t("namePlaceholder")}
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="rounded-md contactInput overflow-hidden"
                  classNames={{
                    input:
                      "font-e-ukraine font-thin not-italic placeholder:font-e-ukraine placeholder:not-italic placeholder:font-thin placeholder:text-commonBlue/50",
                  }}
                />

                <div>
                  <PhoneInput
                    isRequired
                    placeholder={t("phonePlaceholder")}
                    value={form.phone}
                    onValueChange={(v) =>
                      setForm((f) => ({ ...f, phone: v }))
                    }
                    onBlur={() =>
                      setPhoneError(validateField("phone", form.phone, tv))
                    }
                    className="rounded-md contactInput overflow-hidden"
                    classNames={{
                      input:
                        "font-e-ukraine font-thin not-italic placeholder:font-e-ukraine placeholder:not-italic placeholder:font-thin placeholder:text-commonBlue/50",
                    }}
                  />
                  {phoneError && (
                    <p className="text-[#F31260] text-[11px] mt-1">
                      {phoneError}
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    placeholder={t("telegramPlaceholder")}
                    value={form.telegram}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, telegram: e.target.value }))
                    }
                    onBlur={() =>
                      setTelegramError(validateTelegram(form.telegram, tv))
                    }
                    className="rounded-md contactInput overflow-hidden"
                    classNames={{
                      input:
                        "font-e-ukraine font-thin not-italic placeholder:font-e-ukraine placeholder:not-italic placeholder:font-thin placeholder:text-commonBlue/50",
                    }}
                  />
                  {telegramError && (
                    <p className="text-[#F31260] text-[11px] mt-1">
                      {telegramError}
                    </p>
                  )}
                </div>

                <textarea
                  placeholder={t("messagePlaceholder")}
                  value={form.comment}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, comment: e.target.value }))
                  }
                  className="contactTextarea block w-full bg-transparent border border-commonBlue rounded-md px-4 py-3 resize-none h-[110px] outline-none font-e-ukraine font-thin not-italic placeholder:font-e-ukraine placeholder:not-italic placeholder:font-thin placeholder:text-commonBlue/50"
                />

                <GradientButton type="submit" text={t("submit")} />
              </form>
            )}
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
}
