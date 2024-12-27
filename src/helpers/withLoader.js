import Loader from "@/app/components/common/Loader";
import { useState, useLayoutEffect } from "react";

export function withLoader(Component) {
  return function WithLoader(props) {
    const [isLoading, setIsLoading] = useState(true);

    useLayoutEffect(() => {
      setIsLoading(false);
    }, []);

    if (isLoading) {
      return <Loader />;
    }

    return <Component {...props} />;
  };
}
