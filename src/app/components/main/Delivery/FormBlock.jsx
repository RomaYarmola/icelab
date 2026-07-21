import { validateField, validateTelegram } from "@/helpers/validation";
import PhoneInput from "@/app/components/common/PhoneInput";
import { Input, Switch } from "@nextui-org/react";
import { useTranslations } from "next-intl";

export default function FormBlock({
  handleSubmit,
  formData,
  formErrors,
  setFormData,
  setFormErrors,
  touchedFields,
  setTouchedFields,
  isPickup,
  handlePickupChange,
}) {
  const t = useTranslations("DeliveryForm");
  const tv = useTranslations("Validation");
  const handleBlur = (field) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
    const error =
      field === "telegram"
        ? validateTelegram(formData[field], tv)
        : validateField(field, formData[field], tv);
    setFormErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const { name, phone, telegram, email, city, address } = formData;

  return (
    <div className="md:w-[48%]">
      <h3 className="mb-8 text-xl-heading font-medium main-title-gradient text-center ">
        {t("heading")}
      </h3>
      <div className="mb-4 flex justify-end xs:w-[90%]  sm:max-w-[448px] sm:w-full mx-auto">
        <Switch
          isSelected={isPickup}
          onChange={handlePickupChange}
          color="default"
        >
          {t("pickup")}
        </Switch>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="flex flex-col gap-5 w-full mx-auto xs:w-[90%]  sm:max-w-[448px] sm:w-full font-e-ukraine font-thin not-italic"
      >
        <div className="relative">
          <Input
            isRequired
            classNames={{ input: "font-thin" }}
            className={`block w-full mb-1 rounded-md custom-input overflow-hidden required-field`}
            placeholder={t("namePlaceholder")}
            name="name"
            value={name}
            onChange={handleChange}
            onBlur={() => handleBlur("name")}
          />
          {formErrors.name && touchedFields.name && (
            <p className="text-[#F31260] text-[10px] absolute top-[100%]">
              {formErrors.name}
            </p>
          )}
        </div>

        <div className="relative">
          <PhoneInput
            isRequired
            classNames={{ input: "font-thin" }}
            className={`block w-full mb-1 rounded-md custom-input overflow-hidden required-field`}
            placeholder={t("phonePlaceholder")}
            name="phone"
            value={phone}
            onValueChange={(v) =>
              setFormData((prev) => ({ ...prev, phone: v }))
            }
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
            classNames={{ input: "font-thin" }}
            className={`block w-full mb-1 rounded-md custom-input overflow-hidden`}
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

        <Input
          classNames={{ input: "font-thin" }}
          className={`block w-full mb-1 rounded-md custom-input overflow-hidden`}
          placeholder={t("emailPlaceholder")}
          name="email"
          value={email}
          onChange={handleChange}
        />

        {!isPickup && (
          <>
            <div className="relative">
              <Input
                isRequired
                classNames={{ input: "font-thin" }}
                className={`block w-full mb-1 rounded-md custom-input overflow-hidden required-field
            `}
                placeholder={t("cityPlaceholder")}
                name="city"
                value={city}
                onChange={handleChange}
                onBlur={() => handleBlur("city")}
              />
              {formErrors.city && touchedFields.city && (
                <p className="text-[#F31260] text-[10px] absolute top-[100%]">
                  {formErrors.city}
                </p>
              )}
            </div>

            <div className="relative">
              <Input
                isRequired
                classNames={{ input: "font-thin" }}
                className={`block w-full mb-1 rounded-md custom-input overflow-hidden required-field
            `}
                placeholder={t("addressPlaceholder")}
                name="address"
                value={address}
                onChange={handleChange}
                onBlur={() => handleBlur("address")}
              />
              {formErrors.address && touchedFields.address && (
                <p className="text-[#F31260] text-[10px] absolute top-[100%]">
                  {formErrors.address}
                </p>
              )}
            </div>
          </>
        )}
      </form>
    </div>
  );
}
