import Container from "@/utils/Container";
import NicheLinks from "@/app/components/common/NicheLinks";
import { NICHE_LABELS } from "@/lib/niches";

// «Для яких задач беруть сухий лід» на головній: картки всіх живих ніш.
// Головна — найсильніша сторінка сайту; без цього блоку нішеві посадкові
// не отримували з неї жодного посилання. Нова ніша зі status "live"
// з'являється тут сама.
export default function HomeNiches({ locale }) {
  const L = NICHE_LABELS[locale] || NICHE_LABELS.uk;
  return (
    <section className="bg-[#F5F8FC] relative z-10">
      <Container>
        <div className="py-16 md:py-20">
          <NicheLinks
            locale={locale}
            title={L.sectionTitle}
            text={L.sectionText}
          />
        </div>
      </Container>
    </section>
  );
}
