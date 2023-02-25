import dayjs from "dayjs";
import { useEffect, useState } from "react";

const useTimer = (interval: number) => {
  const [currentTime, useCurrentTime] = useState(dayjs());

  useEffect(() => {
    const timeout = setTimeout(() => useCurrentTime(dayjs()), interval);
    return () => {
      clearTimeout(timeout);
    };
  }, [currentTime]);

  return currentTime;
};

export { useTimer };
