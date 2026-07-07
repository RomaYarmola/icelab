import { routes } from "@/utils/routes";
import Link from "next/link";

export default function FooterNav({ variant = "row" }) {
  if (variant === "column") {
    return (
      <div>
        <p className="text-[12px] font-e-ukraine not-italic font-[200] text-white leading-[180%] uppercase mb-5">
          Меню
        </p>
        <ul className="text-white flex flex-col gap-4">
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
      </div>
    );
  }

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
