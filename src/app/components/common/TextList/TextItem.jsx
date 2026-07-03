export default function TextItem({ text, variant, bulletVariant = "blue" }) {
  return (
    <li className="flex gap-3 items-center">
      <div
        className={`size-3 rounded-full shrink-0 ${
          bulletVariant === "white" ? "bg-white" : "bg-[#A0D3FE]"
        }`}
      />
      <p
        dangerouslySetInnerHTML={{ __html: text }}
        className={`${
          variant === "delivery" ? "text-commonBlue" : "text-white"
        } font-e-ukraine text-[14px] not-italic font-thin`}
      ></p>
    </li>
  );
}
