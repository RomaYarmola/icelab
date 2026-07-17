import { Slider } from "@nextui-org/react";
import { useTranslations } from "next-intl";

export default function RangeInput({
  value,
  handleFormDataChange,
  isDisabled,
  variant,
  // Опційні перевизначення діапазону (напр. з Price Settings для сухого льоду).
  minValue,
  maxValue,
  step,
}) {
  const t = useTranslations("Common");
  const handleChange = (quantity) => {
    handleFormDataChange("quantity", quantity);
  };

  const resolvedMin = minValue ?? (variant === "dryIce" ? 5 : 1);
  const resolvedMax = maxValue ?? (variant === "dryIce" ? 500 : 10);
  const resolvedStep = step ?? (variant === "dryIce" ? 5 : 1);

  return (
    <div className="w-full">
      <Slider
        isDisabled={isDisabled}
        classNames={{
          track: "bg-hr-gradient h-[1.5px] border-x-[0px]",
          filler: "bg-transparent h-[1.5px]",
          label:
            "font-e-ukraine not-italic text-[10px] font-medium leading-[2]",
        }}
        label={t("quantity")}
        size="sm"
        renderValue={({ children, ...props }) => (
          <output
            {...props}
            className="font-e-ukraine not-italic text-[10px] font-medium leading-[2]"
          >
            {value}
            {variant === "dryIce" ? "\u00A0кг" : "\u00A0шт"}
          </output>
        )}
        renderThumb={(props) => (
          <div
            {...props}
            className="group p-[2px] top-1/2 bg-background border-small border-default-200 dark:border-default-400/50 shadow-medium rounded-full cursor-grab data-[dragging=true]:cursor-grabbing"
          >
            <span className="transition-transform bg-hr-gradient shadow-small rounded-full w-[14px] h-[14px] block group-data-[dragging=true]:scale-80" />
          </div>
        )}
        value={value}
        onChange={handleChange}
        minValue={resolvedMin}
        maxValue={resolvedMax}
        step={resolvedStep}
        aria-label="quantity"
      />
    </div>
  );
}
