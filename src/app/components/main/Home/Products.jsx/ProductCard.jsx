"use client";

import Image from "next/image";
import OrderBtn from "./OrderBtn";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

// Картинка й плашка ціни ведуть у категорію з таблицею цін: на головній на них
// тапали як на посилання (Clarity, 18.09.2026), а вони нікуди не вели.
const CATEGORY = {
  dryIce: "/catalog/c/suhyi-lid",
  iceBox: "/catalog/c/korobka-z-suhym-lodom",
};

export default function ProductCard({ img, sizes, variant }) {
  const t = useTranslations("Products");
  const isIceBox = variant === "iceBox";
  const name = t(isIceBox ? "iceBoxName" : "dryIceName");
  const title = t.raw(isIceBox ? "iceBoxTitle" : "dryIceTitle");
  const price = t(isIceBox ? "iceBoxPrice" : "dryIcePrice");

  return (
    <li className="rounded-md bg-gradient-card min-w-[328px] lg:w-[550px] px-4 l:px-[34px] py-8 shadow-card relative flex flex-col gap-7">
      <Link
        href={CATEGORY[variant]}
        aria-label={name}
        className="absolute right-[-3%] md:right-0 l:right-[-4%] lg:right-[-1%] top-[-68px] l:top-[-117px] w-[160px] l:w-[50%]"
      >
        <Image
          src={img}
          alt={name}
          width={308}
          height={298}
          className="w-full h-auto"
        />
      </Link>

      <h3
        className="text-xl text-white-gradient max-w-[58%]"
        dangerouslySetInnerHTML={{ __html: title }}
      />
      <ul className="flex gap-3">
        {sizes.map((size, index) => (
          <li key={index} className="text-white text-base font-medium">
            {size}
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-3 md:flex-row-reverse md:justify-end md:gap-[22px]">
        <Link
          href={CATEGORY[variant]}
          className="w-full md:w-[243px] h-10 flex justify-center items-center gap-2 border-white-gradient-rounded hover:bg-white/10 transition-colors"
        >
          <span className="main-title-gradient text-xs-responsive font-medium font-michelin">
            {price}
          </span>
          <span aria-hidden="true" className="text-commonBlue text-sm">→</span>
        </Link>
        <OrderBtn variant={variant} sizes={sizes} />
      </div>
    </li>
  );
}
