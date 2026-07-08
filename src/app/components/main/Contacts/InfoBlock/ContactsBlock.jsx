"use client";
import SocLinks from "@/app/components/common/SocLinks";
import Link from "next/link";
import { useState } from "react";

const cities = {
  lviv: {
    label: "Львів",
    mapSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2563.680289870587!2d23.93320777620378!3d49.75718587148944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x473b0c8b8e7a0c61%3A0xf5b84a1c13048c57!2zNDnCsDQ1JzI1LjkiTiAyM8KwNTYnMDMuNSJF!5e0!3m2!1sen!2sua!4v1699969402823!5m2!1sen!2sua",
    address: "Львівська\u00A0обл., с.\u00A0Годовиця",
    phone: "+38 (095) 16 06 881",
    phoneHref: "tel:+380951606881",
    schedule: ["Пн - Пт : 09.00 - 17.00"],
  },
  kyiv: {
    label: "Київ",
    mapSrc:
      "https://maps.google.com/maps?q=IceLab%20Kyiv%2C%20%D0%B2%D1%83%D0%BB.%20%D0%AF%D0%B3%D1%96%D0%B4%D0%BD%D0%B0%2C%2022%D0%B0%2C%20%D0%92%D0%B8%D1%88%D0%B3%D0%BE%D1%80%D0%BE%D0%B4&output=embed",
    address: "вул.\u00A0Ягідна, 22а, Вишгород, Київська\u00A0обл.",
    phone: "+38 (050) 381 19 30",
    phoneHref: "tel:+380503811930",
    schedule: ["Пн - Пт : 09.00 - 17.00"],
  },
};

export default function ContactsBlock() {
  const [activeCity, setActiveCity] = useState("lviv");
  const isKyiv = activeCity === "kyiv";
  const city = cities[activeCity];

  return (
    <div className="rounded-lg bg-commonBlue py-[46px] px-[30px] flex flex-col gap-10 text-white items-center text-center md:w-[48.6%]">
      <div className="w-full">
        <h3 className="text-[20px] l:text-[32px] font-medium mb-5">Адреса</h3>
        <div className="flex items-center justify-center gap-4 mb-6 font-e-ukraine text-[16px] xl:text-[20px] not-italic">
          <span
            className={`text-md-responsive transition-colors duration-300 ${
              isKyiv ? "text-white/60" : "font-medium text-white"
            }`}
          >
            Львів
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={isKyiv}
            aria-label="Перемкнути місто"
            onClick={() => setActiveCity(isKyiv ? "lviv" : "kyiv")}
            className="relative w-[62px] h-[32px] rounded-full transition-colors duration-300 shrink-0 bg-[#3B8CF5]"
          >
            <span
              className={`absolute top-1/2 -translate-y-1/2 w-[26px] h-[26px] rounded-full bg-white shadow-md transition-all duration-300 ${
                isKyiv ? "left-[33px]" : "left-[3px]"
              }`}
            />
          </button>
          <span
            className={`text-md-responsive transition-colors duration-300 ${
              isKyiv ? "font-medium text-white" : "text-white/60"
            }`}
          >
            Київ
          </span>
        </div>
        <div className="w-full h-[150px] md:h-[250px] rounded-lg overflow-hidden">
          <iframe
            key={activeCity}
            src={city.mapSrc}
            className="w-full h-full border-0"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        <p className="font-e-ukraine font-extralight not-italic text-md-responsive mt-5">
          {city.address}
        </p>
      </div>
      <div>
        <h3 className="text-[20px] l:text-[32px] font-medium mb-5">Контакти</h3>
        <Link
          href={city.phoneHref}
          className="font-e-ukraine font-extralight not-italic text-md-responsive"
        >
          {city.phone}
        </Link>
      </div>
      <div>
        <h3 className="text-[20px] l:text-[32px] font-medium mb-5">
          Графік роботи
        </h3>
        {city.schedule.map((line) => (
          <p
            key={line}
            className="font-e-ukraine font-extralight not-italic text-md-responsive mb-4"
          >
            {line}
          </p>
        ))}
      </div>
      <SocLinks />
    </div>
  );
}
