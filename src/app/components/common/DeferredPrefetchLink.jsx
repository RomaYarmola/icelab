"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { onFirstInteraction } from "./onFirstInteraction";

// <Link> в App Router префетчить RSC-пейлоад, щойно посилання потрапило в
// екран. Для посилань першого екрана (каталог, кошик) це 130 КБ, які
// починають вантажитись на ~450 мс — рівно тоді, коли браузер тягне шрифти
// й LCP-картинку. Вигоди від префетчу до першого доторку немає жодної:
// людина ще нічого не натиснула.
//
// Тому префетч вмикається після першої дії користувача. Для живого
// відвідувача це відбувається за частки секунди до кліку — перехід лишається
// миттєвим; для Lighthouse, який сторінку не чіпає, префетчу не буде взагалі.
export default function DeferredPrefetchLink({ children, ...props }) {
  const [ready, setReady] = useState(false);

  useEffect(() => onFirstInteraction(() => setReady(true)), []);

  return (
    <Link prefetch={ready ? undefined : false} {...props}>
      {children}
    </Link>
  );
}
