import Image from "next/image";

export default function DeliveryBg() {
  return (
    <>
      <div className="absolute w-[2447px] radial-white-gradient min-h-[716px] xs:min-h-[600px] md:min-h-[395px] md:max-h-[395px] top-[312px]  md:top-[483px] left-1/2 transform -translate-x-1/2 z-[1] md:blur-[72px]" />
      <div className=" absolute h-[415px] md:h-[539.18px]  top-[-267px] md:top-[49px] right-[-38px] md:right-0 z-[1]">
        <Image
          src="/images/payment-and-delivery/left-bg.png"
          alt="ice"
          width={385}
          height={539}
          className="bg-blend-hard-light h-full w-full object-cover"
          quality={100}
        />
      </div>
      <div className=" absolute h-[220px] md:h-[351px] bottom-0 md:bottom-[244px] left-0  z-[1]">
        <Image
          src="/images/payment-and-delivery/right-bg.png"
          alt="ice"
          width={385}
          height={539}
          className="bg-blend-hard-light h-full w-full object-cover"
          quality={100}
        />
      </div>
    </>
  );
}
