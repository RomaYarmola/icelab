import { socialContactsLinks, socialLinks } from "@/utils/routes";
import Link from "next/link";

export default function SocLinks({ variant }) {
  const data = variant === "footer" ? socialLinks : socialContactsLinks;

  return (
    <div className={`${variant === "footer" && "mb-12 l:mb-0"}`}>
      {variant === "footer" && (
        <p className="max-w-[270px] text-white not-italic font-e-ukraine text-[16px] mb-5 font-[200] leading-[1.2]">
          Слідкуйте за нами в соціальних мережах
        </p>
      )}

      <div className="flex gap-[14px]">
        {data.map((social) => (
          <Link
            key={social.url}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:drop-shadow-[0_4px_8px_rgba(255,255,255,0.7)] transition-shadow duration-300 ease-in-out"
          >
            <social.icon className="w-8 h-8" />
          </Link>
        ))}
      </div>
    </div>
  );
}
