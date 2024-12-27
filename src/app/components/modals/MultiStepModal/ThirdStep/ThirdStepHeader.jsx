import { Button, ModalHeader } from "@nextui-org/react";
import Image from "next/image";

export default function ThirdStepHeader({ handleClose }) {
  return (
    <ModalHeader>
      <Button
        isIconOnly
        className="absolute top-[10px] right-0 bg-transparent p-0 w-[60px]"
        onClick={handleClose}
      >
        <Image
          src="/icons/close-white.svg"
          alt="close icon"
          width={59}
          height={59}
          className="w-full h-auto"
        />
      </Button>
      <div className="absolute h-[251px] top-[-30px] md:top-[150px] right-[-25px] md:right-[230px]">
        <Image
          src="/images/hero/cloud-left.png"
          alt="cloud"
          width={812}
          height={289}
          className="h-full w-full object-cover object-right"
        />
      </div>
      <div className="absolute h-[223px] top-[150px] right-[-228px] md:right-[-254px] opacity-40">
        <Image
          src="/images/hero/cloud-right.png"
          alt="cloud"
          width={812}
          height={289}
          className="h-full w-full object-cover object-right"
        />
      </div>
    </ModalHeader>
  );
}
