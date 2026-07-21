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

// Правила Telegram-ніка: 5–32 символи, лише латиниця, цифри та підкреслення.
const TELEGRAM_REGEX = /^[A-Za-z0-9_]{5,32}$/;

// Нормалізує введений телеграм-нік: прибирає пробіли, @ та домен t.me / повне
// посилання, лишаючи лише сам нік (напр. "@user", "t.me/user",
// "https://t.me/user" → "user").
export const normalizeTelegram = (value = "") => {
  let v = String(value).trim();
  if (!v) return "";
  v = v.replace(/^https?:\/\//i, "").replace(/^(?:www\.)?t(?:elegram)?\.me\//i, "");
  v = v.replace(/^@/, "");
  return v.trim();
};

// Опціональне поле: порожнє значення валідне. Якщо заповнене — перевіряємо формат.
export const validateTelegram = (value, t) => {
  const nick = normalizeTelegram(value);
  if (!nick) return "";
  if (!TELEGRAM_REGEX.test(nick)) {
    return t ? t("telegram") : "Невірний формат Telegram-ніка";
  }
  return "";
};

// Клікабельне посилання для повідомлення менеджеру. Telegram автоматично робить
// звичайні URL у тексті клікабельними, тому parse_mode не потрібен.
export const telegramLink = (value) => {
  const nick = normalizeTelegram(value);
  return nick ? `https://t.me/${nick}` : "";
};

// Телефон у чистому вигляді +380XXXXXXXXX (без пробілів і дужок) — саме такий формат
// Telegram робить тапабельним у чаті. На вхід приймає масковане значення
// "+38 (098) 998 25 25" → "+380989982525".
export const phoneLink = (value) => {
  const digits = String(value).replace(/\D/g, "");
  return digits ? `+${digits}` : "";
};
