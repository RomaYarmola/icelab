"use client";
import SocLinks from "@/app/components/common/SocLinks";
import Messengers from "@/app/components/common/Messengers";
import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";

// Структурні (нетекстові) дані міст: карта та телефони. Тексти
// (назва міста, адреса, графік) беруться зі словника "Contacts".
const cities = {
  lviv: {
    mapSrc:
      "https://maps.google.com/maps?q=Icelab%2C%20%D0%B2%D1%83%D0%BB.%20%D0%A3%D1%81%D0%BF%D1%96%D1%88%D0%BD%D0%B0%2C%20%D0%9B%D1%8C%D0%B2%D1%96%D0%B2&output=embed",
    phones: [
      { phone: "+38 (095) 160 68 81", phoneHref: "tel:+380951606881" },
      { phone: "+38 (050) 279 50 31", phoneHref: "tel:+380502795031" },
    ],
  },
  kyiv: {
    mapSrc:
      "https://maps.google.com/maps?q=IceLab%20Kyiv%2C%20%D0%B2%D1%83%D0%BB.%20%D0%AF%D0%B3%D1%96%D0%B4%D0%BD%D0%B0%2C%2022%D0%B0%2C%20%D0%92%D0%B8%D1%88%D0%B3%D0%BE%D1%80%D0%BE%D0%B4&output=embed",
    phones: [
      { phone: "+38 (095) 160 68 81", phoneHref: "tel:+380951606881" },
      { phone: "+38 (050) 279 50 31", phoneHref: "tel:+380502795031" },
    ],
  },
};

export default function ContactsBlock() {
  const t = useTranslations("Contacts");
  const [activeCity, setActiveCity] = useState("lviv");
  const isKyiv = activeCity === "kyiv";
  const city = cities[activeCity];
  const schedule = t.raw(`cities.${activeCity}.schedule`);

  return (
    <div className="rounded-lg bg-commonBlue py-[46px] px-[30px] flex flex-col gap-10 text-white items-center text-center md:w-[48.6%]">
      <div className="w-full">
        <h3 className="text-[20px] l:text-[32px] font-medium mb-5">
          {t("addressTitle")}
        </h3>
        <div className="flex items-center justify-center gap-4 mb-6 font-e-ukraine text-[16px] xl:text-[20px] not-italic">
          <span
            className={`text-md-responsive transition-colors duration-300 ${
              isKyiv ? "text-white/60" : "font-medium text-white"
            }`}
          >
            {t("cities.lviv.label")}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={isKyiv}
            aria-label={t("switchCity")}
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
            {t("cities.kyiv.label")}
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
          {t(`cities.${activeCity}.address`)}
        </p>
      </div>
      <div>
        <h3 className="text-[20px] l:text-[32px] font-medium mb-5">
          {t("contactsTitle")}
        </h3>
        <div className="flex flex-col gap-2">
          {city.phones.map(({ phone, phoneHref }) => (
            <Link
              key={phoneHref}
              href={phoneHref}
              className="font-e-ukraine font-extralight not-italic text-md-responsive"
            >
              {phone}
            </Link>
          ))}
        </div>
        <Messengers className="mt-5 justify-center" />
      </div>
      <div>
        <h3 className="text-[20px] l:text-[32px] font-medium mb-5">
          {t("scheduleTitle")}
        </h3>
        {schedule.map((line) => (
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
