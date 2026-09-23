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
          // priority тут НЕ ставити. Перевірено 23.09.2026: лого тоді встигає
          // намалюватись, лоадер стає видимим, і наступна підміна його на
          // контент кошика рахується зсувом — CLS на /basket 0,01 -> 0,312.
          // LCP при цьому виграє лише 0,6 с, обмін невигідний.
          className=" w-full h-auto"
        />
      </div>
    </div>
  );
}
