import { NextPage } from "next";
import { useEffect, useState } from "react";
import { dayjs } from "../src/lib/dayjs";
import { Box, Button, Text } from "@chakra-ui/react";

const Home: NextPage = () => {
  const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
  // console.log(now);
  const [nowTime, setNowtime] = useState(now);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [restStart, setRestStart] = useState("");
  const [restEnd, setRestEnd] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
      setNowtime(now);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Text>atd app</Text>
      <Text suppressHydrationWarning={true}>{`${nowTime}`}</Text>
      <Box>
        <Text>出勤時刻：{`${startTime}`}</Text>
        <Text>退勤時刻：{`${endTime}`}</Text>
        <Text>休憩入り：{`${restStart}`}</Text>
        <Text>休憩戻り：{`${restEnd}`}</Text>
      </Box>

      <Button onClick={() => setStartTime(nowTime)}>出勤</Button>
      <Button onClick={() => setEndTime(nowTime)}>退勤</Button>
      <Button onClick={() => setRestStart(nowTime)}>休憩</Button>
      <Button onClick={() => setRestEnd(nowTime)}>戻り</Button>
    </>
  );
};

export default Home;
