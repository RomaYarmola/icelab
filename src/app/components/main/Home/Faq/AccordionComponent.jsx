"use client";

import { Accordion, AccordionItem } from "@nextui-org/react";
import { data } from "./data";
import Image from "next/image";

export default function AccordionComponent() {
  return (
    <Accordion className="accordion" defaultExpandedKeys={["0"]}>
      {data.map(({ question, answer }, index) => (
        <AccordionItem
          textValue={question}
          key={index}
          indicator={({ isOpen }) => (
            <Image
              src="/icons/expand-more.svg"
              alt="icon"
              width={32}
              height={32}
              className={isOpen ? "rotate-[90deg]" : "rotate-[180deg]"}
            />
          )}
          className=" accordion-item px-4 md:px-8 py-7 rounded-[18px] mb-5 bg-commonBlue"
          title={
            <h4 className="text-md-responsive text-white font-medium font-michelin">
              {question}
            </h4>
          }
        >
          <p className="text-white text-xs-responsive font-montserrat not-italic pt-[8px]">
            {answer}
          </p>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
