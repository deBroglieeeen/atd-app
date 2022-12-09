import { NextPage } from "next";
import { useEffect, useState } from "react";
import { dayjs } from "../lib/dayjs";
import { Box, Button, Text } from "@chakra-ui/react";
import { useAuth0 } from "@auth0/auth0-react";
import { Clockin } from "../components/Clockin";
import { Clockout } from "../components/Clockout";
import { RestIn } from "../components/RestIn";
import { RestOut } from "../components/RestOut";

const Home: NextPage = () => {
  const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
  const [nowTime, setNowtime] = useState(now);
  const [attendanceId, setAttendanceId] = useState("");
  const [restId, setRestId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [startRest, setStartRest] = useState("");
  const [endRest, setEndRest] = useState("");
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

  useEffect(() => {
    if (user === null) {
      loginWithRedirect();
    }
    console.log("id:", user?.sub);
    console.log("name:", user?.name);
    const timer = setInterval(() => {
      const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
      setNowtime(now);
    }, 1000);
    return () => clearInterval(timer);
  }, [isAuthenticated, loginWithRedirect]);

  return (
    <>
      {!isAuthenticated ? (
        <Button onClick={loginWithRedirect}>Log in</Button>
      ) : (
        <Button
          onClick={() => {
            logout({ returnTo: window.location.origin });
          }}
        >
          Log out
        </Button>
      )}
      <Text>atd app</Text>
      <Text suppressHydrationWarning={true}>{`${nowTime}`}</Text>
      <Box>
        <Text>出勤時刻：{`${startTime}`}</Text>
        <Text>退勤時刻：{`${endTime}`}</Text>
        <Text>休憩入り：{`${startRest}`}</Text>
        <Text>休憩戻り：{`${endRest}`}</Text>
      </Box>
      <Clockin
        nowTime={nowTime}
        setStartTime={setStartTime}
        setAttendanceId={setAttendanceId}
      />
      <Clockout
        nowTime={nowTime}
        setEndTime={setEndTime}
        attendanceId={attendanceId}
      />
      <RestIn
        nowTime={nowTime}
        setStartRest={setStartRest}
        setRestId={setRestId}
      />
      <RestOut nowTime={nowTime} setEndRest={setEndRest} restId={restId} />
      <Box>{user ? `(ユーザー:${user?.name}${user.sub})` : null}</Box>
    </>
  );
};

export default Home;
