import Container from "@/utils/Container";
import NicheLinks from "@/app/components/common/NicheLinks";
import { NICHE_LABELS, liveNiches } from "@/lib/niches";

// На мобільному — три ніші з найбільшим побутовим попитом (весілля,
// гендер-паті, коктейлі), решта за кнопкою «Дивитись усі».
const POPULAR = [
  "vazhkyi-dym-na-vesillia",
  "suhyi-lid-dlia-gender-pati",
  "suhyi-lid-dlia-koktejliv",
];

// «Для яких задач беруть сухий лід» на головній: картки всіх живих ніш.
// Головна — найсильніша сторінка сайту; без цього блоку нішеві посадкові
// не отримували з неї жодного посилання. Нова ніша зі status "live"
// з'являється тут сама.
export default function HomeNiches({ locale }) {
  const L = NICHE_LABELS[locale] || NICHE_LABELS.uk;
  const all = liveNiches();
  const niches = [
    ...POPULAR.map((slug) => all.find((n) => n.slug === slug)).filter(Boolean),
    ...all.filter((n) => !POPULAR.includes(n.slug)),
  ];
  return (
    <section className="bg-[#F5F8FC] relative z-10">
      <Container>
        <div className="py-16 md:py-20">
          <NicheLinks
            locale={locale}
            title={L.sectionTitle}
            text={L.sectionText}
            niches={niches}
            mobileLimit={3}
          />
        </div>
      </Container>
    </section>
  );
}
