import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Middleware next-intl: визначає локаль із URL та виконує потрібні
// перенаправлення/переписування (uk — без префікса, ru — /ru).
export default createMiddleware(routing);

export const config = {
  // Пропускаємо API-роути, внутрішні шляхи Next.js та статичні файли
  // (усе, що містить крапку, напр. favicon.ico, зображення тощо).
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
