"use client";
import Container from "@/utils/Container";
import GradientButton from "../GradientButton";
import Link from "next/link";

import NoCompromisesBg from "./NoCompromisesBg";
import { useIsSafari } from "@/hooks/useIsSafari";

export default function NoCompromises({ variant = "common" }) {
  const isSafari = useIsSafari();
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
            Не втрачайте час на компроміси!
          </h2>
          <h3 className="text-md-responsive text-white text-center mb-6 md:mb-9">
            Зробіть замовлення вже сьогодні
          </h3>
          <p className="max-w-[432px] mx-auto text-xs-responsive text-white text-center mb-[46px] md:mb-[58px] font-montserrat not-italic">
            Замовляйте сухий лід у{" "}
            <span className="font-michelin"> ICELAB</span> та переконайтеся, як
            легко досягти ваших цілей з нашою допомогою!
          </p>
          <Link
            href={`${variant === "common" ? "#products" : "/#products"}`}
            className="flex w-[279px] mx-auto  relative z-10"
          >
            <GradientButton text={"Замовити"} />
          </Link>
        </div>
      </Container>
    </div>
  );
}
