import Container from "@/utils/Container";

// Спільний макет для юридичних/сервісних сторінок (privacy, terms, payment, returns).
// Один <h1>, прямий (не курсивний) шрифт для читабельності довгих текстів.
// Хлібні крошки підключаються через проп `breadcrumbs` (P1-4).
export default function LegalPage({ title, body, breadcrumbs }) {
  return (
    <div className="bg-white">
      <Container>
        <div className="pt-[140px] md:pt-[200px] pb-[80px] md:pb-[120px] max-w-[820px] mx-auto">
          {breadcrumbs}
          <h1 className="not-italic font-e-ukraine font-medium text-[28px] md:text-[40px] leading-tight mb-8 text-black">
            {title}
          </h1>
          <div className="not-italic font-e-ukraine font-thin text-[16px] md:text-[18px] leading-relaxed text-black/80 whitespace-pre-line">
            {body}
          </div>
        </div>
      </Container>
    </div>
  );
}
