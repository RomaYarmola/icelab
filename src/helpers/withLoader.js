import Loader from "@/app/components/common/Loader";
import { useState, useLayoutEffect } from "react";

export function withLoader(Component) {
  return function WithLoader(props) {
    const [isLoading, setIsLoading] = useState(true);

    useLayoutEffect(() => {
      setIsLoading(false);
    }, []);

    // ВІДОМА ПРОБЛЕМА (23.09.2026): лоадер займає весь екран (h-screen), а
    // порожній кошик значно коротший, тож підміна одного на інше підтягує
    // футер угору — під тротлінгом Lighthouse це CLS 0,31 на /basket.
    // Обгортка з min-h-screen не допомагає: через схлопування margin у
    // Basket (mt-[100px]) вона сама починає зсуватись і дає 0,56.
    // Нормальне рішення — рендерити кістяк кошика на сервері замість
    // повноекранного лоадера. Сторінка noindex, тому не в пріоритеті.
    if (isLoading) {
      return <Loader />;
    }

    return <Component {...props} />;
  };
}
