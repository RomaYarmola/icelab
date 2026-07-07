import { routes } from "@/utils/routes";
import Link from "next/link";

export default function FooterNav() {
  return (
    <ul className="text-white flex flex-col sm:flex-row gap-6 sm:gap-10 justify-center mb-12 l:mb-[62px]">
      {routes.map((route) => (
        <li key={route.path}>
          <Link
            href={route.path}
            className="text-[16px] font-e-ukraine not-italic font-[200]"
          >
            {route.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
