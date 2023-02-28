import dayjs from "dayjs";
import { useEffect, useState } from "react";

const useTimer = () => {
  const [currentTime, useCurrentTime] = useState(dayjs());

  useEffect(() => {
    const timeout = setTimeout(() => {
      useCurrentTime(dayjs()), 1000;
    });
    return () => {
      clearTimeout(timeout);
    };
  }, [currentTime]);

  return currentTime;
};

export { useTimer };
