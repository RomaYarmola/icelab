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
          // Поки лоадер на екрані, лого — єдиний контент, тож саме його
          // Chrome рахує LCP-елементом (видно на /basket).
          priority
          className=" w-full h-auto"
        />
      </div>
    </div>
  );
}
