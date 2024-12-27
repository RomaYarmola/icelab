import { useEffect, useState } from "react";

export const useIsSafari = () => {
  const [isSafari, setIsSafari] = useState(null);

  useEffect(() => {
    const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(
      navigator.userAgent
    );
    setIsSafari(isSafariBrowser);
  }, []);

  return isSafari;
};
