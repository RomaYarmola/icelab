import Container from "@/utils/Container";
import GradientButton from "../../../common/GradientButton";
import HeroClouds from "./HeroClouds";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="overflow-x-clip relative heroBg h-[864px] ">
      <div className="absolute inset-0">
        <HeroClouds />
      </div>
      <Container>
        <div className="pt-[218px] md:pt-[200px] z-[9999]">
          <h1 className="text-4xl main-title-gradient text-center mb-[53px] md:mb-[22px] relative z-[1] md:z-[3]">
            Сухий лід
          </h1>
          <h3 className="text-lg-extended text-blue-gradient text-center mb-8 md:mb-12 max-w-[98%] sm:max-w-[66%] mx-auto relative z-10">
            Сухий лід для будь-яких потреб - завжди в наявності
          </h3>
          <p className="font-montserrat text-sm-responsive text-center mb-8 md:mb-12 max-w-[86%] sm:max-w-[41.7%] mx-auto relative z-10">
            Охолоджуйте, створюйте ефекти й зберігайте свіжість з нашим якісним
            сухим льодом
          </p>
          <Link
            href="#products"
            className="flex w-[279px] mx-auto mb-[73px] md:mb-[52px] relative z-10"
          >
            <GradientButton text={"Замовити"} />
          </Link>
        </div>
      </Container>
    </div>
  );
}
