import { Button, ModalHeader } from "@nextui-org/react";
import Image from "next/image";

export default function SecondStepHeader({ handleClose }) {
  return (
    <ModalHeader className="px-[70px] pt-[70px] md:pt-[77px] pb-2 md:pb-7 justify-center relative">
      <h3 className="main-title-gradient text-[24px] leading-[1.08] font-medium text-center">
        Залишити заявку
      </h3>
      <Button
        isIconOnly
        className="absolute top-[10px] right-0 bg-transparent p-0 w-[60px]"
        onClick={handleClose}
      >
        <Image
          src="/icons/close.svg"
          alt="close icon"
          width={59}
          height={59}
          className="w-full h-auto"
        />
      </Button>
    </ModalHeader>
  );
}
