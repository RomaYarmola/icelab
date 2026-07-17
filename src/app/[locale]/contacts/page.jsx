import Banner from "../../components/main/Contacts/Banner/Banner";
import InfoBlock from "../../components/main/Contacts/InfoBlock/InfoBlock";
import { getTranslations, setRequestLocale } from "next-intl/server";
import JsonLd from "../../components/common/JsonLd";
import { localBusinessSchema } from "@/lib/schema";

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
