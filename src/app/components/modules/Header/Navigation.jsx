import { routes } from "@/utils/routes";
import { NavbarContent, NavbarItem } from "@nextui-org/react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function Navigation() {
  const t = useTranslations("Nav");
  return (
    // Шість пунктів не вміщуються поруч із логотипом і кошиком на планшеті,
    // тож до l (989px) — бургер; до xl «Головна» ховаємо (її дублює логотип).
    <NavbarContent className="hidden l:flex gap-5 xl:gap-6" justify="end">
      {routes.map((route) => (
        <NavbarItem
          key={route.path}
          className={route.key === "home" ? "hidden xl:list-item" : undefined}
        >
          <Link
            className="font-e-ukraine font-extralight text-base xl:text-lg text-commonBlue not-italic whitespace-nowrap"
            href={route.path}
          >
            {t(route.key)}
          </Link>
        </NavbarItem>
      ))}
    </NavbarContent>
  );
}
