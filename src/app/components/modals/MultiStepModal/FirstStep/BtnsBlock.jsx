import { Button } from "@nextui-org/react";

export default function BtnsBlock({
  sizes,
  selectedOption,
  handleFormDataChange,
  variant,
}) {
  const handleSelect = (option, index) => {
    // if (variant === "iceBox" && index !== 1) return;
    handleFormDataChange("size", option);
    handleFormDataChange(
      "iceVariant",
      variant === "dryIce" ? "Сухий лід" : "Бокс для льоду"
    );
  };

  return (
    <div className="flex flex-col md:flex-row gap-3 mb-4">
      {sizes.map((option, index) => (
        <Button
          key={index}
          className={`w-full font-michelin md:w-[113px] md:h-[31px] ${
            selectedOption !== option
              ? "border-gradient-modal"
              : "border-gradient-blue-bg-modal"
          }`}
          onClick={() => handleSelect(option, index)}
          // isDisabled={variant === "iceBox" && index !== 1}
        >
          <p className="main-title-gradient text-base font-medium">{option}</p>
        </Button>
      ))}
    </div>
  );
}
