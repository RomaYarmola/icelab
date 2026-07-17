import Image from "next/image";
import Container from "@/utils/Container";

// Спільний макет для юридичних/сервісних та EEAT-сторінок.
// Один <h1>, прямий (не курсивний) шрифт для читабельності довгих текстів.
// breadcrumbs — крошки (P1-4); image — опційне герой-фото { src, alt }.
export default function LegalPage({ title, body, breadcrumbs, image }) {
  return (
    <div className="bg-white">
      <Container>
        <div className="pt-[140px] md:pt-[200px] pb-[80px] md:pb-[120px] max-w-[820px] mx-auto">
          {breadcrumbs}
          <h1 className="not-italic font-e-ukraine font-medium text-[28px] md:text-[40px] leading-tight mb-8 text-black">
            {title}
          </h1>
          {image && (
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-8">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 820px) 100vw, 820px"
                className="object-cover"
              />
            </div>
          )}
          <div className="not-italic font-e-ukraine font-thin text-[16px] md:text-[18px] leading-relaxed text-black/80 whitespace-pre-line">
            {body}
          </div>
        </div>
      </Container>
    </div>
  );
}
