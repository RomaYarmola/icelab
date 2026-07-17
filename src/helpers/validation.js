const validationRules = {
  name: {
    regex: /^[A-Za-zА-Яа-яЁёІіЇїЄєҐґ]+([ ]?[A-Za-zА-Яа-яЁёІіЇїЄєҐґ]+)*$/,
    // Резервне повідомлення (укр.) на випадок виклику без перекладача.
    errorMessage: "Ім'я повинно містити принаймні дві літери",
  },
  phone: {
    regex: /^(\+?38)?\s?\(?0\d{2}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/,
    errorMessage: "Невірний формат номера телефону",
  },
  city: {
    regex: /^[A-Za-zА-Яа-яЁёІіЇїЄєҐґ\s\-]+$/,
    errorMessage: "Місто повинно містити лише літери, пробіли та дефіси",
  },
  address: {
    regex: /^[A-Za-zА-Яа-яЁёІіЇїЄєҐґ0-9\s,\-\/]+$/,
    errorMessage:
      "Адреса повинна містити лише літери, цифри, пробіли, коми, дефіси та косі риски",
  },
};

// t — перекладач next-intl зі скоупом "Validation" (useTranslations("Validation")).
// Якщо переданий, повертає локалізоване повідомлення; інакше — резервне укр.
export const validateField = (name, value, t) => {
  const { regex, errorMessage } = validationRules[name] || {};
  if (!value) {
    return t ? t("empty") : "це поле не може бути порожнім";
  }
  if (regex && !regex.test(value)) {
    return t ? t(name) : errorMessage;
  }
  return "";
};
