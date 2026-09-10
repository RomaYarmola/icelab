// Гід покупця для сторінок категорій. Дані — Categories.<msgKey>.guide у
// messages/*.json: масив секцій { title, text?, table?: { head, rows },
// list? }. Рендерить лише те, що є, тож категорія без guide нічого не ламає.
//
// Це відповідь на зауваження аудиту (вересень 2026): на категоріях був лише
// SEO-текст, без порівняння фасувань, розрахунку обсягу й правил зберігання —
// того, що людина реально вирішує перед покупкою.
export default function CategoryGuide({ sections = [] }) {
  if (!sections.length) return null;
  const cell = "px-4 py-3 not-italic font-e-ukraine text-[15px] md:text-[16px]";
  return (
    <div className="flex flex-col gap-12">
      {sections.map((s, i) => (
        <section key={i} className="max-w-[900px]">
          <h2 className="not-italic font-e-ukraine font-medium text-[22px] md:text-[28px] mb-4 text-black">
            {s.title}
          </h2>
          {s.text && (
            <p className="not-italic font-e-ukraine font-thin text-[16px] md:text-[18px] leading-relaxed text-black/75 mb-5 whitespace-pre-line">
              {s.text}
            </p>
          )}
          {s.table?.rows?.length > 0 && (
            <div className="overflow-x-auto mb-5">
              <table className="w-full min-w-[520px] border-collapse rounded-[14px] overflow-hidden border border-commonBlue/15">
                <thead>
                  <tr className="bg-commonBlue/[0.06] text-left">
                    {s.table.head.map((h, j) => (
                      <th key={j} className={`${cell} font-medium text-commonBlue`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {s.table.rows.map((row, j) => (
                    <tr key={j} className="border-t border-commonBlue/10 align-top">
                      {row.map((v, k) => (
                        <td
                          key={k}
                          className={`${cell} ${
                            k === 0 ? "font-medium text-black" : "font-thin text-black/80"
                          }`}
                        >
                          {v}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {s.list?.length > 0 && (
            <ul className="flex flex-col gap-3">
              {s.list.map((item, j) => (
                <li
                  key={j}
                  className="flex gap-3 not-italic font-e-ukraine font-thin text-[15px] md:text-[17px] leading-relaxed text-black/80"
                >
                  <span className="mt-[10px] w-1.5 h-1.5 rounded-full bg-commonBlue shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}
