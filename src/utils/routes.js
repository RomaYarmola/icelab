import { FaFacebook, FaInstagram } from "react-icons/fa";
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
