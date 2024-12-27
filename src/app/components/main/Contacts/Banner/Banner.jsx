import Container from "@/utils/Container";

export default function Banner() {
  return (
    <div className="overflow-x-clip relative bannerContactsBg ">
      <div className="absolute radial-white-gradient w-[2447px] max-h-[375px] top-[418px] left-1/2 transform -translate-x-1/2 z-[1]" />
      <Container>
        <div className="pt-[204px] relative z-[3]">
          <h2 className="text-3xl text-white-title-gradient text-center mb-[10px]">
            Контакти
          </h2>
          <p className="text-lg-extended text-white-title-gradient text-center">
            Залиш нам повідомлення
          </p>
        </div>
      </Container>
    </div>
  );
}
