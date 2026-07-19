import { routes, footerLinks, infoLinks } from "@/utils/routes";
import { CATEGORIES } from "@/lib/categories";
import { CITIES } from "@/lib/cities";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";

// Група посилань футера (один стовпчик).
function FooterGroup({ title, items }) {
  return (
    <div>
      <p className="text-[12px] font-e-ukraine not-italic font-[200] text-white/60 leading-[180%] mb-4 uppercase tracking-wide">
        {title}
      </p>
      <ul className="text-white flex flex-col gap-3">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-[15px] font-e-ukraine not-italic font-[200] hover:text-gray-300 transition-colors"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function FooterNav({ variant = "column" }) {
  const t = useTranslations();
  const locale = useLocale();

  // Групи посилань — розкладаються у стовпчики (сітка), а не одним полотном.
  const groups = [
    {
      title: t("Footer.menuTitle"),
      items: routes.map((r) => ({ href: r.path, label: t(`Nav.${r.key}`) })),
    },
    {
      title: t("Footer.categoriesTitle"),
      items: CATEGORIES.map((c) => ({
        href: `/catalog/c/${c.slug}`,
        label: t(`Categories.${c.msgKey}.h1`),
      })),
    },
    {
      title: t("Footer.legalTitle"),
      items: infoLinks.map((l) => ({
        href: l.path,
        label: t(`Breadcrumbs.${l.key}`),
      })),
    },
    {
      title: t("Footer.docsTitle"),
      items: footerLinks.map((l) => ({
        href: l.path,
        label: t(`Footer.links.${l.key}`),
      })),
    },
  ];

  // row-варіант (в бургері тощо) — простий вертикальний список меню.
  if (variant === "row") {
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

  // column-варіант: сітка стовпчиків (2 колонки на мобільних, 4 — на десктопі)
  // + окремий ряд гео-перелінковки «сухий лід по містах».
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 lg:gap-x-10 gap-y-10">
        {groups.map((g) => (
          <FooterGroup key={g.title} title={g.title} items={g.items} />
        ))}
      </div>
      <div className="mt-10 pt-8 border-t border-white/10">
        <p className="text-[12px] font-e-ukraine not-italic font-[200] text-white/60 leading-[180%] mb-3 uppercase tracking-wide">
          {t("Footer.citiesTitle")}
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {CITIES.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/${c.slug}`}
                className="text-[14px] font-e-ukraine not-italic font-[200] text-white/85 hover:text-gray-300 transition-colors"
              >
                {(c[locale] || c.uk).city}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
