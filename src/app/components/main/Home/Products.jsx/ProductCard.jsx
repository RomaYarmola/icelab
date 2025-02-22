"use client";

import Image from "next/image";
import OrderBtn from "./OrderBtn";

export default function ProductCard({ img, title, sizes, variant }) {
  return (
    <li className="rounded-md bg-gradient-card min-w-[328px] lg:w-[550px] px-4 l:px-[34px] py-8 shadow-card relative flex flex-col gap-7">
      <div className="absolute right-[-3%] md:right-0 l:right-[-4%] lg:right-[-1%] top-[-68px] l:top-[-117px] w-[160px] l:w-[50%]">
        <Image
          src={img}
          alt={title}
          width={308}
          height={298}
          className="w-full h-auto"
        />
      </div>

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
        <div className="w-full md:w-[243px] h-10 flex justify-center items-center border-white-gradient-rounded cursor-auto">
          <p className="main-title-gradient text-xs-responsive font-medium font-michelin">
            {variant === "iceBox" ? "300 грн/шт" : "Від 60 грн/кг"}
          </p>
        </div>
        <OrderBtn variant={variant} sizes={sizes} />
      </div>
    </li>
  );
}
