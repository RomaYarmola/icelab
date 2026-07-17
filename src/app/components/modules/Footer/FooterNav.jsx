import { routes, footerLinks, infoLinks } from "@/utils/routes";
import { CATEGORIES } from "@/lib/categories";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function FooterNav({ variant = "row" }) {
  const t = useTranslations();
  if (variant === "column") {
    const linkCls =
      "text-[16px] font-e-ukraine not-italic font-[200] hover:text-gray-300 transition-colors";
    const titleCls =
      "hidden md:block text-[12px] font-e-ukraine not-italic font-[200] text-white/70 leading-[180%] mb-5";
    return (
      <div className="flex flex-col gap-10">
        <div>
          <p className={titleCls}>{t("Footer.menuTitle")}</p>
          <ul className="text-white flex flex-col gap-4">
            {routes.map((route) => (
              <li key={route.path}>
                <Link href={route.path} className={linkCls}>
                  {t(`Nav.${route.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Категорії (P1-11) */}
        <div>
          <p className={titleCls}>{t("Footer.categoriesTitle")}</p>
          <ul className="text-white flex flex-col gap-4">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link href={`/catalog/c/${c.slug}`} className={linkCls}>
                  {t(`Categories.${c.msgKey}.h1`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Інформація / EEAT (P1-8/P1-11) */}
        <div>
          <p className={titleCls}>{t("Footer.legalTitle")}</p>
          <ul className="text-white flex flex-col gap-4">
            {infoLinks.map((link) => (
              <li key={link.path}>
                <Link href={link.path} className={linkCls}>
                  {t(`Breadcrumbs.${link.key}`)}
                </Link>
              </li>
            ))}
            {footerLinks.map((link) => (
              <li key={link.path}>
                <Link href={link.path} className={linkCls}>
                  {t(`Footer.links.${link.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
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
