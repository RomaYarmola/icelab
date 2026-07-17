import { routes } from "@/utils/routes";
import { NavbarContent, NavbarItem } from "@nextui-org/react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function Navigation() {
  const t = useTranslations("Nav");
  return (
    <NavbarContent className="hidden sm:flex gap-6" justify="end">
      {routes.map((route) => (
        <NavbarItem key={route.path}>
          <Link
            className="font-e-ukraine font-extralight text-lg text-commonBlue not-italic"
            href={route.path}
          >
            {t(route.key)}
          </Link>
        </NavbarItem>
      ))}
    </NavbarContent>
  );
}
