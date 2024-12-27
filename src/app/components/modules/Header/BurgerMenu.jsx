import { routes } from "@/utils/routes";
import { NavbarMenu, NavbarMenuItem } from "@nextui-org/react";
import Link from "next/link";

export default function BurgerMenu({ onClick }) {
  return (
    <NavbarMenu className=" bg-white flex flex-col gap-9 px-4 py-8">
      {routes.map((route) => (
        <NavbarMenuItem key={route.path}>
          <Link
            onClick={onClick}
            className="w-full text-[20px] leading-[1.2] font-montserrat not-italic text-commonBlue800"
            href={route.path}
            size="lg"
          >
            {route.name}
          </Link>
          <hr className="h-[1.5px] w-full bg-hr-gradient mt-[14px]" />
        </NavbarMenuItem>
      ))}
    </NavbarMenu>
  );
}
