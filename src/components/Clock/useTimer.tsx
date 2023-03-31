import dayjs from "dayjs";
import { useEffect, useState } from "react";

const useTimer = () => {
  const [currentTime, setCurrentTime] = useState(dayjs());

  useEffect(() => {
    const timeout = setTimeout(() => setCurrentTime(dayjs()), 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [currentTime]);

  return currentTime;
};

export { useTimer };
