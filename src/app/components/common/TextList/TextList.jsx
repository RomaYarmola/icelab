import TextItem from "./TextItem";

export default function TextList({ data, variant }) {
  return (
    <ul className="flex flex-col gap-[26px]">
      {data.map(({ text }, index) => (
        <TextItem key={index} text={text} variant={variant} />
      ))}
    </ul>
  );
}
