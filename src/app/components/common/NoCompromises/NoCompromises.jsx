"use client";
import Container from "@/utils/Container";
import GradientButton from "../GradientButton";
import Link from "next/link";
import { Link as LocaleLink } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

import NoCompromisesBg from "./NoCompromisesBg";
import { useIsSafari } from "@/hooks/useIsSafari";

export default function NoCompromises({ variant = "common" }) {
  const isSafari = useIsSafari();
  const t = useTranslations("NoCompromises");
  // Для головної (common) — якір на цій же сторінці, для інших — перехід на
  // головну з якорем: тут потрібне локале-залежне посилання.
  const LinkComp = variant === "common" ? Link : LocaleLink;
  return (
    <div
      className={`overflow-x-clip relative ${
        isSafari && "nocompromises-safari"
      }`}
    >
      <NoCompromisesBg />

      <Container>
        <div className="pb-[216px] md:pb-[231px] relative z-10">
          <h2 className="text-white-title-gradient text-center text-2xl max-w-[623px] mb-3 mx-auto">
            {t("title")}
          </h2>
          <p className="text-md-responsive text-white text-center mb-6 md:mb-9">
            {t("subtitle")}
          </p>
          <p className="max-w-[432px] mx-auto text-xs-responsive text-white text-center mb-[46px] md:mb-[58px] font-e-ukraine font-thin not-italic">
            {t("descriptionStart")}
            <span className="font-e-ukraine font-thin not-italic">ICELAB</span>
            {t("descriptionEnd")}
          </p>
          <LinkComp
            href={`${variant === "common" ? "#products" : "/#products"}`}
            className="flex w-[279px] mx-auto  relative z-10"
          >
            <GradientButton text={t("order")} />
          </LinkComp>
        </div>
      </Container>
    </div>
  );
}
