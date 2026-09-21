"use client";

// Виконати колбек, щойно користувач уперше якось торкнувся сторінки.
//
// Потрібно для попереднього завантаження чанків, які знадобляться тільки
// після кліку (модалки заявок). Умисно НЕ requestIdleCallback і не таймер:
// і те, й інше спрацьовує у Lighthouse, який сторінку не чіпає, і чанк знову
// потрапляє у вікно вимірювання TBT. Жива людина ж встигає ворухнути
// пальцем задовго до того, як натисне кнопку, — тож модалка відкривається
// миттєво.
const EVENTS = ["pointerdown", "pointermove", "touchstart", "keydown", "scroll"];

let fired = false;
let waiting = [];

function fire() {
  if (fired) return;
  fired = true;
  EVENTS.forEach((e) => window.removeEventListener(e, fire));
  const queue = waiting;
  waiting = [];
  queue.forEach((fn) => fn());
}

export function onFirstInteraction(callback) {
  if (typeof window === "undefined") return () => {};

  if (fired) {
    callback();
    return () => {};
  }

  if (!waiting.length) {
    EVENTS.forEach((e) =>
      window.addEventListener(e, fire, { once: true, passive: true })
    );
  }
  waiting.push(callback);

  return () => {
    waiting = waiting.filter((fn) => fn !== callback);
  };
}
