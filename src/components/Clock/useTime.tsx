import { useEffect, useState } from "react";

const useTime = (interval: number) => {
  const [time, updateTime] = useState(Date.now());

  useEffect(() => {
    const timeout = setTimeout(() => updateTime(Date.now()), interval);
    return () => {
      clearTimeout(timeout);
    };
  }, [time]);

  return time;
};

export { useTime };
