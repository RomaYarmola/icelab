import { routes } from "@/utils/routes";
import { NavbarMenu, NavbarMenuItem } from "@nextui-org/react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function BurgerMenu({ onClick }) {
  const t = useTranslations("Nav");
  return (
    <NavbarMenu className=" bg-white flex flex-col gap-9 px-4 py-8">
      {routes.map((route) => (
        <NavbarMenuItem key={route.path}>
          <Link
            onClick={onClick}
            className="w-full text-[20px] leading-[1.2] font-e-ukraine font-extralight not-italic text-commonBlue800"
            href={route.path}
            size="lg"
          >
            {t(route.key)}
          </Link>
          <hr className="h-[1.5px] w-full bg-hr-gradient mt-[14px]" />
        </NavbarMenuItem>
      ))}
    </NavbarMenu>
  );
}
