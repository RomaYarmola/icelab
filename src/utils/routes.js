import {
  FaFacebook,
  FaInstagram,
  FaTelegramPlane,
  FaWhatsapp,
  FaViber,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

// Основные ссылки для хедера, бургера и других общих компонентов.
// key — ключ перевода из неймспейса "Nav" (messages/*.json).
export const routes = [
  { key: "home", path: "/" },
  { key: "catalog", path: "/catalog" },
  { key: "paymentAndDelivery", path: "/payment-and-delivery" },
  { key: "blog", path: "/blog" },
  { key: "contacts", path: "/contacts" },
];

// Ссылки, которые используются только в футере (юридические/сервисные страницы).
// key — ключ перевода из неймспейса "Footer.links" (messages/*.json).
export const footerLinks = [
  { key: "privacy", path: "/privacy-policy" },
  { key: "terms", path: "/terms" },
  { key: "payment", path: "/payment" },
  { key: "returns", path: "/returns" },
];

// Інформаційні/EEAT сторінки для футера (P1-8/P1-11).
// key — ключ перекладу з неймспейсу "Breadcrumbs".
export const infoLinks = [
  { key: "about", path: "/about" },
  { key: "production", path: "/production" },
  { key: "faq", path: "/faq" },
  { key: "applications", path: "/zastosuvannia-suhogo-lodu" },
];

// Соц.сети

export const socialLinks = [
  {
    name: "Instagram",
    url: "https://instagram.com/icelabua",
    icon: FaInstagram,
  },
  // { name: "Facebook", url: "https://facebook.com", icon: FaFacebook },
];

export const socialContactsLinks = [
  {
    name: "Instagram",
    url: "https://instagram.com/icelabua",
    icon: FaInstagram,
  },
  // { name: "Twitter", url: "https://twitter.com", icon: FaXTwitter },
  // { name: "Facebook", url: "https://facebook.com", icon: FaFacebook },
];

// Єдине джерело контактного номера (без пробілів/дужок — для tel:/wa.me/viber).
export const CONTACT_PHONE = "+380951606881";

// Месенджери для звʼязку (контакти, футер, плаваюча кнопка). color — фірмовий
// колір месенджера для кружечків у плаваючій кнопці.
export const messengers = [
  {
    name: "Telegram",
    url: "https://t.me/romanyarmola",
    icon: FaTelegramPlane,
    color: "#229ED9",
  },
  {
    name: "WhatsApp",
    url: `https://wa.me/${CONTACT_PHONE.replace(/\D/g, "")}`,
    icon: FaWhatsapp,
    color: "#25D366",
  },
  {
    name: "Viber",
    url: `viber://chat?number=${encodeURIComponent(CONTACT_PHONE)}`,
    icon: FaViber,
    color: "#7360F2",
  },
];
