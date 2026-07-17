import Banner from "../../components/main/Contacts/Banner/Banner";
import InfoBlock from "../../components/main/Contacts/InfoBlock/InfoBlock";
import { setRequestLocale } from "next-intl/server";

export default async function Contacts({ params }) {
  const { locale } = await params;
  // Вмикаємо статичний рендеринг для поточної локалі.
  setRequestLocale(locale);
  return (
    <>
      <Banner />
      <InfoBlock />
    </>
  );
}
