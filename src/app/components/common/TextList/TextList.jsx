import TextItem from "./TextItem";

export default function TextList({
  data,
  variant,
  bulletVariant,
  textSize,
  textClassName,
  listClassName = "",
}) {
  return (
    <ul className={`flex flex-col gap-3.5 ${listClassName}`}>
      {data.map(({ text }, index) => (
        <TextItem
          key={index}
          text={text}
          variant={variant}
          bulletVariant={bulletVariant}
          textSize={textSize}
          textClassName={textClassName}
        />
      ))}
    </ul>
  );
}
