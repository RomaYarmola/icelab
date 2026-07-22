import { create } from "zustand";

// Легкий UI-стан, спільний між компонентами (без персисту).
// isMenuOpen — чи відкрите мобільне бургер-меню; використовується, щоб ховати
// плаваючу кнопку звʼязку, поки меню перекриває екран.
const useUiStore = create((set) => ({
  isMenuOpen: false,
  setMenuOpen: (isMenuOpen) => set({ isMenuOpen }),
}));

export default useUiStore;
