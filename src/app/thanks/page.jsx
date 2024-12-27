import Container from "@/utils/Container";
import Image from "next/image";

export default function Thanks() {
  return (
    <div className="third-modal-bg h-screen">
      <Container>
        <div className="md:pt-[187px]  pt-[82px] pb-[73px] px-5 md:px-0 max-w-[287px] mx-auto flex flex-col items-center gap-0">
          <h3 className="font-medium text-[24px] text-center text-white-title-gradient mt-[14px]">
            Дякуємо за замовлення!
          </h3>
          <div className="w-[268px]">
            <Image
              src="/images/modal/heart.png"
              alt="close icon"
              width={203}
              height={196}
              className="w-full h-auto"
            />
          </div>
          <p className="font-montserrat text-[16px] md:text-[20px] mt-[18px] text-white-title-gradient text-center  ">
            Очікуйте на повідомлення від менеджера!
          </p>
        </div>
      </Container>
    </div>
  );
}
