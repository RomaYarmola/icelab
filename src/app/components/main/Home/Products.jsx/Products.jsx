"use client";
import Container from "@/utils/Container";
import { data } from "./data";
import ProductCard from "./ProductCard";
import { useIsSafari } from "@/hooks/useIsSafari";

export default function Products() {
  const isSafari = useIsSafari();
  return (
    <div
      id="products"
      className={`overflow-x-clip relative ${
        isSafari && "dark-gradient-safari"
      }`}
    >
      {/* gradient */}
      {!isSafari && (
        <div className="w-[1981px] h-[768px] md:h-[717px] radial-dark-gradient absolute bottom-[-238px] md:bottom-[-280px] left-1/2 transform -translate-x-1/2 z-[3] 2xl:w-[2900px]" />
      )}

      {/* /gradient */}
      <Container>
        <ul className="pt-[111px] pb-[124px] l:pt-[122px] 2xl:pt-[200px] l:pb-[112px] relative z-[4] flex flex-col md:flex-row gap-[88.6px] md:gap-5 items-center justify-center">
          {data.map(({ img, title, sizes, variant }, index) => (
            <ProductCard
              key={index}
              img={img}
              title={title}
              sizes={sizes}
              variant={variant}
            />
          ))}
        </ul>
      </Container>
    </div>
  );
}
