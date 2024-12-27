import { routes } from "@/utils/routes";
import { NavbarContent, NavbarItem } from "@nextui-org/react";
import Link from "next/link";

export default function Navigation() {
  return (
    <NavbarContent className="hidden sm:flex gap-6" justify="end">
      {routes.map((route) => (
        <NavbarItem key={route.path}>
          <Link
            className="font-montserrat text-lg text-commonBlue not-italic"
            href={route.path}
          >
            {route.name}
          </Link>
        </NavbarItem>
      ))}
    </NavbarContent>
  );
}
