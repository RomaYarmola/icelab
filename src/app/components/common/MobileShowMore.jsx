"use client";
import { Children, cloneElement, isValidElement, useState } from "react";
import { useLocale } from "next-intl";

// Список, у якому на мобільному видно перші `limit` елементів, решта — за
// кнопкою «Дивитись усі». Від md і вище видно все, кнопки немає.
//
// Для Google нічого не ховаємо з HTML: усі елементи рендеряться на сервері,
// приховані лише CSS-класом (hidden md:*), тож посилання й тексти в коді
// сторінки лишаються і скануються. children — готові <li>.
const LABEL = { uk: "Дивитись усі", ru: "Смотреть все" };

export default function MobileShowMore({
  limit = 3,
  className = "",
  hiddenClass = "hidden md:block",
  buttonClass = "",
  children,
}) {
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const items = Children.toArray(children);

  return (
    <>
      <ul className={className}>
        {items.map((el, i) =>
          !open && i >= limit && isValidElement(el)
            ? cloneElement(el, {
                className: `${el.props.className || ""} ${hiddenClass}`.trim(),
              })
            : el
        )}
      </ul>
      {!open && items.length > limit && (
        <div className="mt-6 flex justify-center md:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={`inline-flex h-11 items-center gap-2 rounded-full px-6 not-italic font-e-ukraine text-[15px] font-medium transition-colors ${buttonClass}`}
          >
            {LABEL[locale] || LABEL.uk}
            <span aria-hidden="true">↓</span>
          </button>
        </div>
      )}
    </>
  );
}
