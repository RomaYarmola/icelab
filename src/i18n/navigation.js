import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Локале-орієнтовані навігаційні API next-intl.
// Ці обгортки автоматично додають префікс мови до внутрішніх посилань
// (наприклад, /ru), тож навігація не втрачає поточну мову. Використовуються
// у компонентах замість next/link та next/navigation для внутрішніх переходів.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
