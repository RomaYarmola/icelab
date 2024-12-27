const validationRules = {
  name: {
    regex: /^[A-Za-zА-Яа-яЁёІіЇїЄєҐґ]+([ ]?[A-Za-zА-Яа-яЁёІіЇїЄєҐґ]+)*$/,
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

export const validateField = (name, value) => {
  const { regex, errorMessage } = validationRules[name] || {};
  if (!value) {
    return `це поле не може бути порожнім`;
  }
  if (regex && !regex.test(value)) {
    return errorMessage;
  }
  return "";
};
