// Комерційні блоки картки товару (P1-7): доставка/оплата, способи оплати, УТП.
// Презентаційний серверний компонент — отримує вже перекладені масиви.
function Block({ title, items }) {
  return (
    <div className="rounded-[14px] border border-commonBlue/15 p-5">
      <h2 className="text-base font-medium text-commonBlue mb-3 not-italic font-e-ukraine">
        {title}
      </h2>
      <ul className="flex flex-col gap-2">
        {items.map((text, i) => (
          <li
            key={i}
            className="flex gap-2 font-e-ukraine font-thin not-italic text-commonBlue/80 text-sm leading-relaxed"
          >
            <span className="text-commonBlue">•</span>
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ProductInfoBlocks({
  deliveryTitle,
  deliveryItems,
  paymentTitle,
  paymentItems,
  uspTitle,
  uspItems,
}) {
  return (
    <div className="flex flex-col gap-4 mt-4">
      <Block title={deliveryTitle} items={deliveryItems} />
      <Block title={paymentTitle} items={paymentItems} />
      <Block title={uspTitle} items={uspItems} />
    </div>
  );
}
