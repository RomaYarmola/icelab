"use client";
import GradientButton from "@/app/components/common/GradientButton";
import { validateField, validateTelegram, telegramLink } from "@/helpers/validation";
import { sendMessage } from "@/utils/sendMessage";
import { Input } from "@nextui-org/react";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function Form() {
  const t = useTranslations("ContactForm");
  const tv = useTranslations("Validation");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    telegram: "",
    comment: "",
  });

  const [formErrors, setFormErrors] = useState({
    phone: "",
    telegram: "",
  });

  const [touchedFields, setTouchedFields] = useState({
    phone: false,
    telegram: false,
  });

  const [buttonText, setButtonText] = useState(t("submit"));

  const handleSubmit = async () => {
    const errors = {
      phone: validateField("phone", formData.phone, tv),
      telegram: validateTelegram(formData.telegram, tv),
    };

    setFormErrors(errors);
    // Показуємо помилки навіть якщо поле ще не «торкали» — інакше при сабміті
    // з невалідним телефоном користувач не бачить причини.
    setTouchedFields({ phone: true, telegram: true });

    if (!errors.name && !errors.phone && !errors.telegram) {
      const tgLink = telegramLink(formData.telegram);
      const message = `
        ❓ Заявка:
        - Ім'я: ${formData.name}
        - Телефон: ${formData.phone}${tgLink ? `\n        - Telegram: ${tgLink}` : ""}
        - Повідомлення: ${formData.comment}
      `;
      console.log(message);
      const result = await sendMessage(message);

      if (result.success) {
        setButtonText(t("success"));
        setTimeout(() => setButtonText(t("submit")), 2000);
      }

      setFormData({
        name: "",
        phone: "",
        telegram: "",
        comment: "",
      });
      setFormErrors({
        phone: "",
        telegram: "",
      });
      setTouchedFields({
        phone: false,
        telegram: false,
      });
    } else {
      console.log("Помилки валідації:", errors);
    }
  };

  const handleBlur = (field) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
    const error =
      field === "telegram"
        ? validateTelegram(formData[field], tv)
        : validateField(field, formData[field], tv);
    setFormErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
  };

  const handleFormDataChange = (field, value) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, [field]: value };

      return updatedData;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    handleFormDataChange(name, value);
  };

  const { name, phone, telegram, comment } = formData;

  return (
    <div className="">
      <h3 className="mb-[52px] text-xl-heading font-medium main-title-gradient text-center ">
        {t("headingLine1")}
        <br /> {t("headingLine2")}
      </h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="flex flex-col gap-5 w-full mx-auto xs:w-[90%]  sm:max-w-[448px] sm:w-full font-e-ukraine font-thin not-italic"
      >
        <Input
          classNames={{
            input: "font-thin",
            inputWrapper:
              "group-data-[focus-visible=true]:ring-0 group-data-[focus-visible=true]:ring-offset-0 xl:h-full xl:min-h-full",
          }}
          className="block w-full mb-1 rounded-md contactInput overflow-hidden xl:!h-[54px]"
          placeholder={t("companyPlaceholder")}
          name="name"
          value={name}
          onChange={handleChange}
        />
        <div className="relative">
          <Input
            classNames={{
              input: "font-thin",
              inputWrapper:
                "group-data-[focus-visible=true]:ring-0 group-data-[focus-visible=true]:ring-offset-0 xl:h-full xl:min-h-full",
            }}
            isRequired
            className={`block w-full mb-1 rounded-md contactInput overflow-hidden xl:!h-[54px] ${
              phone === "" && "required-field"
            }`}
            placeholder={t("phonePlaceholder")}
            name="phone"
            value={phone}
            onChange={handleChange}
            onBlur={() => handleBlur("phone")}
          />
          {formErrors.phone && touchedFields.phone && (
            <p className="text-[#F31260] text-[10px] absolute top-[100%]">
              {formErrors.phone}
            </p>
          )}
        </div>
        <div className="relative">
          <Input
            classNames={{
              input: "font-thin",
              inputWrapper:
                "group-data-[focus-visible=true]:ring-0 group-data-[focus-visible=true]:ring-offset-0 xl:h-full xl:min-h-full",
            }}
            className="block w-full mb-1 rounded-md contactInput overflow-hidden xl:!h-[54px]"
            placeholder={t("telegramPlaceholder")}
            name="telegram"
            value={telegram}
            onChange={handleChange}
            onBlur={() => handleBlur("telegram")}
          />
          {formErrors.telegram && touchedFields.telegram && (
            <p className="text-[#F31260] text-[10px] absolute top-[100%]">
              {formErrors.telegram}
            </p>
          )}
        </div>
        <textarea
          className="contactTextarea block w-full bg-transparent border border-commonBlue rounded-md px-5 py-[17px] mb-4 resize-none h-[145px] outline-none font-e-ukraine font-thin not-italic"
          placeholder={t("messagePlaceholder")}
          name="comment"
          value={comment}
          onChange={(e) => handleFormDataChange("comment", e.target.value)}
        />
        <GradientButton type="submit" text={buttonText} />
      </form>
    </div>
  );
}
