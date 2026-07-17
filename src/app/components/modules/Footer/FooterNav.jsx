import { routes } from "@/utils/routes";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function FooterNav({ variant = "row" }) {
  const t = useTranslations();
  if (variant === "column") {
    return (
      <div>
        <p className="hidden md:block text-[12px] font-e-ukraine not-italic font-[200] text-white leading-[180%] mb-5">
          {t("Footer.menuTitle")}
        </p>
        <ul className="text-white flex flex-col gap-4">
          {routes.map((route) => (
            <li key={route.path}>
              <Link
                href={route.path}
                className="text-[16px] font-e-ukraine not-italic font-[200]"
              >
                {t(`Nav.${route.key}`)}
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
            {t(`Nav.${route.key}`)}
          </Link>
        </li>
      ))}
    </ul>
  );
}
