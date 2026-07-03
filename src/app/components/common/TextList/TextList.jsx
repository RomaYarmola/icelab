import TextItem from "./TextItem";

export default function TextList({ data, variant, bulletVariant }) {
  return (
    <ul className="flex flex-col gap-3.5">
      {data.map(({ text }, index) => (
        <TextItem
          key={index}
          text={text}
          variant={variant}
          bulletVariant={bulletVariant}
        />
      ))}
    </ul>
  );
}
