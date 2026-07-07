import Image from "next/image";
import Link from "next/link";
import SocLinks from "../../common/SocLinks";
import FooterNav from "./FooterNav";

export default function Footer() {
  return (
    <footer className="bg-dark-gradient dark:bg-gray-900 relative z-10">
      <div className="mx-auto w-full max-w-screen-xl px-4 l:px-20 pt-[63px] pb-[57px] l:pb-[42px] ">
        {/* Логотип */}
        <Link href="/" className="mb-12 flex">
          <Image
            src="/icons/white-logo.svg"
            alt="logo"
            width={100}
            height={88}
          />
        </Link>

        {/* Лого CO2 */}
        <a
          href="https://www.co2lab.pro/"
          target="_blank"
          rel="noopener noreferrer"
          className="mb-5"
        >
          <Image
            src="/icons/co2-logo.svg"
            alt="co2"
            width={81}
            height={36}
            className="mb-5"
          />
        </a>

        <p className="max-w-[227px] mb-12 font-e-ukraine not-italic text-[14px] font-[200] leading-[1.2] text-white">
          Наші CO₂-рішення повного циклу — від джерела до використання
        </p>

        {/* Ссылки футера */}
        <FooterNav />

        <div className="relative">
          <p className="hidden l:block base-text text-white absolute bottom-0 left-0 font-[200]">
            © {new Date().getFullYear()} ICELAB
          </p>

          <SocLinks variant="footer" />
          <p className="hidden l:block base-text text-white absolute bottom-0 right-0 font-[200]">
            Сайт розробили - cyanidium.dev
          </p>
        </div>

        <div className="flex flex-col  gap-6 l:hidden">
          <p className="base-text text-white font-[200]">
            © {new Date().getFullYear()} ICELAB
          </p>
          <div className="text-white">
            <p className="text-[7px] font-e-ukraine not-italic text-white font-[200] leading-[180%] uppercase">
              Created by
            </p>
            <a
              href="https://www.code-site.art/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5"
            >
              <p className="font-e-ukraine not-italic text-[14px] text-white font-[200] leading-[180%] uppercase">
                Code-site.art
              </p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="17"
                viewBox="0 0 18 17"
                fill="none"
                aria-label="tag icon"
                className="mb-1.5 xl:group-hover:text-gray-300 transition duration-300 ease-in-out"
              >
                <path
                  d="M7.68896 16.8631L11.1946 3.83789H12.3289L8.46228 16.8631H7.68896Z"
                  fill="currentColor"
                />
                <path
                  d="M13.3845 16.2845V14.9225L17.2266 12.087L13.36 9.25152L13.3845 8.03516L17.9998 11.2995V13.02L13.3845 16.2845Z"
                  fill="currentColor"
                />
                <path
                  d="M5.60229 16.2123V14.8502L1.76025 12.0147L5.62683 9.17925L5.60229 7.96289L0.98698 11.2272V12.9478L5.60229 16.2123Z"
                  fill="currentColor"
                />
                <path
                  d="M13.5259 4.90279C12.9866 5.44202 11.0095 5.80151 11.0095 5.80151C11.0095 5.80151 10.1107 3.6446 10.2905 2.92563C10.4702 2.20666 11.0095 1.66743 11.0095 1.66743C11.9314 0.692502 12.6645 0.47509 14.0651 0.229492C14.3267 2.09834 14.0651 4.36357 13.5259 4.90279Z"
                  fill="currentColor"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
