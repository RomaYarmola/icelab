"use client";
import Container from "@/utils/Container";
import AccordionComponent from "./AccordionComponent";
import Details from "./Deatails";
import { useIsSafari } from "@/hooks/useIsSafari";

export default function Faq() {
  const isSafari = useIsSafari();
  return (
    <div className={`${isSafari && "faq-safari"}`}>
      <Container>
        <div className="pb-[293px] md:pb-[232px] md:pt-[125px] relative z-[5]">
          <h2 className="text-center text-white-title-gradient text-2xl mb-10">
            Часті питання
          </h2>
          <Details />
          {/* <AccordionComponent /> */}
        </div>
      </Container>
    </div>
  );
}
