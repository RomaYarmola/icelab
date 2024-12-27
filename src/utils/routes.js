import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

// Основные ссылки для хедера, бургера и других общих компонентов
export const routes = [
  { name: "Головна", path: "/" },
  { name: "Доставка та оплата", path: "/payment-and-delivery" },
  { name: "Контакти", path: "/contacts" },
];

// Ссылки, которые используются только в футере
export const footerLinks = [
  { name: "Privacy Policy", path: "/privacy-policy" },
  { name: "Terms & Conditions", path: "/terms" },
];

// Соц.сети

export const socialLinks = [
  { name: "Instagram", url: "https://instagram.com", icon: FaInstagram },
  { name: "Facebook", url: "https://facebook.com", icon: FaFacebook },
];

export const socialContactsLinks = [
  { name: "Instagram", url: "https://instagram.com", icon: FaInstagram },
  { name: "Twitter", url: "https://twitter.com", icon: FaXTwitter },
  { name: "Facebook", url: "https://facebook.com", icon: FaFacebook },
];
