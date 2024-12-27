import { ModalBody, ModalContent } from "@nextui-org/react";
import Image from "next/image";
import ThirdStepHeader from "./ThirdStepHeader";

export default function ThirdStep({ handleClose }) {
  return (
    <ModalContent className="relative third-modal-bg overflow-x-clip">
      <ThirdStepHeader handleClose={handleClose} />
      <ModalBody className="relative z-[1] pt-[82px] pb-[73px] px-5 md:px-0 max-w-[287px] mx-auto flex flex-col items-center gap-0">
        <div className="w-[268px]">
          <Image
            src="/images/modal/heart.png"
            alt="close icon"
            width={203}
            height={196}
            className="w-full h-auto"
          />
        </div>
        <h3 className="font-medium text-[24px] leading-[1.3] md:leading-[0.9] text-center text-white-title-gradient mt-[14px]">
          Дякуємо за замовлення!
        </h3>
        <p className="font-montserrat text-[16px] md:text-[20px] mt-[18px] text-white-title-gradient text-center  ">
          Очікуйте на повідомлення від менеджера!
        </p>
      </ModalBody>
    </ModalContent>
  );
}
