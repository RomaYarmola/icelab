import Image from "next/image";

export default function Loader() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-[200px] animate-pulse">
        <Image
          src="/icons/logo.svg"
          alt="logo"
          width={100}
          height={100}
          // Поки лоадер на екрані, лого — єдиний контент, тож Chrome рахує
          // LCP-елементом саме його. Без priority воно lazy й приходить
          // пізно: /basket 82 -> 76 балів. На CLS не впливає — зсув давала
          // різна висота лоадера й контенту, це полагоджено у withLoader.
          priority
          className=" w-full h-auto"
        />
      </div>
    </div>
  );
}
