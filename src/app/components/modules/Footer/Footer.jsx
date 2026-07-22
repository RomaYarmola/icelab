import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import SocLinks from "../../common/SocLinks";
import Messengers from "../../common/Messengers";
import FooterNav from "./FooterNav";

function CreatedBy({ align = "left" }) {
  const t = useTranslations("Footer");
  return (
    <div className={`text-white ${align === "right" ? "ml-auto" : ""}`}>
      <p className="text-[7px] font-e-ukraine not-italic text-white font-[200] leading-[180%] uppercase">
        {t("createdBy")}
      </p>
      <a
        href="https://www.code-site.art/"
        target="_blank"
        rel="noopener noreferrer"
        className={`group flex items-center gap-1.5 ${
          align === "right" ? "justify-end" : ""
        }`}
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
  );
}

export default function Footer() {
  const t = useTranslations("Footer");
  return (
    <footer className="bg-dark-gradient dark:bg-gray-900 relative z-10 overflow-hidden">
      {/* Декоративні картинки (позиціонування додається окремо) */}

      <div className="relative z-10 mx-auto w-full max-w-screen-xl px-4 md:px-10 l:px-20 pt-[63px] pb-[57px] md:pb-[48px]">
        {/* Версія для мобільних та планшетів (до md) */}
        <div className="md:hidden w-[426px] h-[628px] left-[115px] bottom-[-185px] -z-10 absolute pointer-events-none select-none">
          {" "}
          <Image
            src="/images/footer/decor-mob.webp"
            alt="decor-mob"
            aria-hidden="true"
            fill
            // width={851}
            // height={1259}
            className="object-cover"
          />
        </div>

        <div className="hidden md:block absolute left-[140px] xl:left-[240px] bottom-0 -z-10 pointer-events-none select-none w-[718px] h-[347px]">
          {" "}
          <Image
            src="/images/footer/decor-desk.webp"
            alt="decor-desk"
            aria-hidden="true"
            fill
            className="object-cover"
          />
        </div>
        <div className="md:hidden">
          <Link href="/" className="mb-12 flex">
            <Image
              src="/icons/white-logo.svg"
              alt="IceLab логотип"
              width={100}
              height={88}
            />
          </Link>

          <a
            href="https://www.co2lab.pro/"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-5"
          >
            <Image
              src="/icons/co2-logo.svg"
              alt="CO2LAB"
              width={81}
              height={36}
              className="mb-5"
            />
          </a>

          <p className="max-w-[227px] mb-12 font-e-ukraine not-italic text-[14px] font-[200] leading-[1.2] text-white">
            {t("co2Slogan")}
          </p>

          <div className="mb-12">
            <FooterNav variant="column" />
          </div>

          <SocLinks variant="footer" />

          <Messengers className="mb-12 -mt-6" />

          <div className="flex flex-col gap-6">
            <p className="base-text text-white font-[200]">
              © {new Date().getFullYear()} ICELAB
            </p>
            <CreatedBy />
          </div>
        </div>

        {/* Версія для md і більше */}
        <div className="hidden md:block">
          {/* Верхній ряд: бренд ліворуч, CO2LAB праворуч */}
          <div className="flex justify-between gap-6 mb-14">
            <div>
              <Link href="/" className="mb-8 flex">
                <Image
                  src="/icons/white-logo.svg"
                  alt="IceLab логотип"
                  width={100}
                  height={88}
                />
              </Link>
              <SocLinks variant="footer" />
              <Messengers className="mt-6" />
            </div>

            <div className="text-right">
              <a
                href="https://www.co2lab.pro/"
                target="_blank"
                rel="noopener noreferrer"
                className="mb-5 flex justify-end"
              >
                <Image
                  src="/icons/co2-logo.svg"
                  alt="CO2LAB"
                  width={81}
                  height={36}
                />
              </a>
              <p className="max-w-[240px] ml-auto font-e-ukraine not-italic text-[14px] font-[200] leading-[1.2] text-white">
                {t("co2Slogan")}
              </p>
            </div>
          </div>

          {/* Сітка посилань у стовпчики */}
          <FooterNav variant="column" />

          {/* Нижній ряд: копірайт та автор */}
          <div className="flex justify-between items-end gap-6 mt-14 pt-8 border-t border-white/10">
            <p className="base-text text-white font-[200]">
              © {new Date().getFullYear()} ICELAB
            </p>
            <CreatedBy align="right" />
          </div>
        </div>
      </div>
    </footer>
  );
}
