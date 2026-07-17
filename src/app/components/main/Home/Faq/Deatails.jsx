import Image from "next/image";
import { useTranslations } from "next-intl";

export default function Details() {
  const t = useTranslations("Faq");
  // На головній показуємо топ-N питань (повний список — на /faq).
  const homeCount = t.raw("homeCount") || 5;
  const data = t.raw("items").slice(0, homeCount);
  return (
    <div className="flex flex-col gap-5">
      {data.map(({ question, answer }, index) => (
        <details
          key={index}
          className=" text-white text-xs-responsive font-e-ukraine not-italic rounded-[18px] bg-commonBlue cursor-pointer px-4 md:px-8 py-7"
        >
          <summary className="  questionBlock flex justify-between font-michelin">
            <p className="text-md-responsive text-white font-medium font-michelin">
              {question}
            </p>
            <Image
              src="/icons/expand-more.svg"
              alt=""
              aria-hidden="true"
              width={32}
              height={32}
              className="svg rotate-180"
            />
          </summary>
          <p
            className="mt-4 font-e-ukraine font-[100]"
            dangerouslySetInnerHTML={{ __html: answer }}
          />
        </details>
      ))}
    </div>
  );
}
