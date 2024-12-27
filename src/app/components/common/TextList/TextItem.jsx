import Image from "next/image";

export default function TextItem({ text, variant }) {
  return (
    <li className="flex gap-[22px] items-center">
      <Image
        src={`${
          variant === "delivery"
            ? "/icons/dark-circle.svg"
            : "/icons/light-circle.svg"
        }`}
        alt="icon"
        width={28}
        height={28}
      />
      <p
        className={`${
          variant === "delivery" ? "text-commonBlue" : "text-white"
        } font-montserrat text-base md:text-[20px]`}
      >
        {text}
      </p>
    </li>
  );
}
