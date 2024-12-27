export default function TextPart({ quantity, variant }) {
  return (
    <>
      <div className="mt-[-45px] flex gap-[19px] items-center">
        <h3 className="main-title-gradient text-[24px] leading-[1.08] font-medium">
          {variant === "dryIce" ? "Сухий лід" : "Бокс для льоду"}
        </h3>
        <p className="text-[20px] font-montserrat not-italic font-medium leadong-[1.3] text-commonBlue">
          {variant === "dryIce" ? (
            <>
              {quantity} <span>кг</span>
            </>
          ) : (
            quantity
          )}
        </p>
      </div>
      <p className="mb-4 font-montserrat font-medium text-[#686466] leading-normal not-italic text-[12px]">
        {variant === "dryIce" ? (
          <>
            Сухий лід виготовлений з високоякісної вуглекислоти (CO₂).
            Відрізняється різним діаметром гранул, що дозволяє обрати
            оптимальний варіант для ваших потреб.
            <br />
            Виберіть потрібний діаметр та кількість для замовлення
          </>
        ) : (
          "Бокс для льоду — це контейнер, спеціально призначений для транспортування, зберігання або використання льоду. Він може мати різні форми, розміри та конструкції, залежно від потреб: збереження низької температури, створення естетичного ефекту."
        )}
      </p>
    </>
  );
}
