import { ModalHeader } from "@nextui-org/react";
import Image from "next/image";

export default function FirstStepHeader({ variant }) {
  return (
    <ModalHeader
      className={`relative overflow-x-clip md:h-[330px] ${
        variant !== "dryIce" && "bg-gradient-to-b from-[#001731] to-[#FFFFFF] "
      }`}
    >
      <div className="absolute h-[402px] w-full top-[141px] right-0">
        <Image
          src="/images/hero/cloud-right.png"
          alt="cloud"
          width={812}
          height={289}
          className="h-full w-full object-cover object-right"
        />
      </div>
      <Image
        src={`${
          variant === "dryIce"
            ? "/images/modal/ice.png"
            : "/images/modal/box.png"
        }`}
        alt="ice"
        width={330}
        height={330}
        className={`${
          variant === "dryIce"
            ? "h-full w-full object-cover object-top md:mt-[-4px]"
            : "h-full w-auto mx-auto "
        }`}
      />
    </ModalHeader>
  );
}
