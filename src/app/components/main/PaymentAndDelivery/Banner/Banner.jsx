import Container from "@/utils/Container";

export default function Banner() {
  return (
    <div className="overflow-x-clip relative bannerPaymentBg ">
      <div className="absolute radial-white-gradient w-[1615px] md:w-[3130px] top-[332px] left-1/2 transform -translate-x-1/2 md:z-[2]" />
      <Container>
        <div className="pt-[202px] md:pt-[176px] relative z-[3]">
          <h2 className="text-3xl text-violet-gradient text-center mb-[10px]">
            Доставка
            <br /> та оплата
          </h2>
          <p className="text-lg-extended text-blue-gradient text-center">
            Замовляй та оплачуй безпечно
          </p>
        </div>
      </Container>
    </div>
  );
}
