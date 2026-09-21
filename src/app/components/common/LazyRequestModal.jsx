"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { onFirstInteraction } from "./onFirstInteraction";

// RequestModal тягне за собою NextUI Modal + Input і react-imask — близько
// 90 КБ, які до кліку не потрібні жодного разу, але лежали у первинному
// бандлі головної та каталогу. Тут вони їдуть окремим чанком:
//   • код підвантажується на першу ж дію користувача (див. onFirstInteraction),
//     тож до кліку по кнопці він уже в кеші;
//   • сам компонент монтується лише після першого відкриття — інакше NextUI
//     встигне створити оверлеї ще до того, як вони комусь знадобляться.
// Після монтування не розмонтовуємо: інакше зникне анімація закриття.
const RequestModal = dynamic(() => import("./RequestModal"), { ssr: false });

export default function LazyRequestModal({ isOpen, ...props }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => onFirstInteraction(() => import("./RequestModal")), []);

  useEffect(() => {
    if (isOpen) setMounted(true);
  }, [isOpen]);

  if (!mounted) return null;

  return <RequestModal isOpen={isOpen} {...props} />;
}
