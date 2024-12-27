import Image from "next/image";
import Link from "next/link";
import SocLinks from "../../common/SocLinks";
import FooterNav from "./FooterNav";

export default function Footer() {
  return (
    <footer className="bg-dark-gradient dark:bg-gray-900 relative z-10">
      <div className="mx-auto w-full max-w-screen-xl px-4 l:px-20 pt-[63px] pb-[57px] l:pb-[42px] ">
        {/* Логотип */}
        <Link href="/" className="mb-9 flex justify-center">
          <Image
            src="/icons/white-logo.svg"
            alt="logo"
            width={101}
            height={88}
          />
        </Link>

        {/* Ссылки футера */}
        <FooterNav />

        <div className="relative">
          <p className="hidden l:block base-text text-white absolute bottom-0 left-0">
            © {new Date().getFullYear()} ICELAB
          </p>

          <SocLinks variant="footer" />
          <p className="hidden l:block base-text text-white absolute bottom-0 right-0">
            Сайт розробили - cyanidium.dev
          </p>
        </div>

        <div className="flex items-center flex-col  gap-6 l:hidden">
          <p className="base-text text-white">
            © {new Date().getFullYear()} ICELAB
          </p>
          <p className="base-text text-white">Сайт розробили - cyanidium.dev</p>
        </div>
      </div>
    </footer>
  );
}
