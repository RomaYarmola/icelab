import Banner from "../../components/main/Contacts/Banner/Banner";
import InfoBlock from "../../components/main/Contacts/InfoBlock/InfoBlock";
import { getTranslations, setRequestLocale } from "next-intl/server";
import JsonLd from "../../components/common/JsonLd";
import { localBusinessSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

// Унікальні, мовозалежні метадані сторінки контактів (раніше успадковувались
// від головної — і title/description, і canonical).
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ContactsBanner" });
  return pageMeta({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/contacts",
    locale,
  });
}

export default async function Contacts({ params }) {
  const { locale } = await params;
  // Вмикаємо статичний рендеринг для поточної локалі.
  setRequestLocale(locale);

  // LocalBusiness ×2 (Київ, Львів) — дані з messages.Contacts.cities.
  const t = await getTranslations({ locale, namespace: "Contacts" });
  const cities = t.raw("cities");
  const businesses = ["kyiv", "lviv"].map((key) =>
    localBusinessSchema({
      name: `IceLab ${cities[key].label}`,
      address: cities[key].address,
      url: "/contacts",
    })
  );

  return (
    <>
      {businesses.map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}
      <Banner />
      <InfoBlock />
    </>
  );
}
