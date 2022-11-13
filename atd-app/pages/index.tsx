import { NextPage } from "next";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const Home: NextPage = () => {
  const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
  const [nowTime, setNowime] = useState(now);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
      setNowime(now);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <h1>atd app</h1>
      <p>{nowTime}</p>
      <button>出勤</button>
      <button>退勤</button>
      <button>休憩</button>
      <button>戻り</button>
    </>
  );
};

export default Home;
