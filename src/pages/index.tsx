import { NextPage } from "next";
import { useEffect, useState } from "react";
import { dayjs } from "../lib/dayjs";
import { Box, Button, Text, Toast } from "@chakra-ui/react";
import { useAuth0, User } from "@auth0/auth0-react";
import {
  AddClockinMutationMutation,
  AddClockinMutationMutationVariables,
} from "../generated/graphql";
import { addClockinMutation } from "../graphql/attendance";
import { useMutation } from "urql";

const Home: NextPage = () => {
  const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
  const [nowTime, setNowtime] = useState(now);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [restStart, setRestStart] = useState("");
  const [restEnd, setRestEnd] = useState("");
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const [addClockinResult, addClockin] = useMutation<
    AddClockinMutationMutation,
    AddClockinMutationMutationVariables
  >(addClockinMutation);

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

  const clickClockin = async () => {
    // setStartTime(nowTime);
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }
    try {
      setStartTime(nowTime);
      const addClockinResult = await addClockin({
        startTime: startTime,
      });
      console.log(addClockinResult.data);
      if (addClockinResult.error) {
        throw new Error(addClockinResult.error.message);
      }
    } catch (error) {
      console.error(error);
      toast({
        description: "エラーが発生しました",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
  };

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
        <Text>休憩入り：{`${restStart}`}</Text>
        <Text>休憩戻り：{`${restEnd}`}</Text>
      </Box>

      <Button onClick={clickClockin}>出勤</Button>
      <Button onClick={() => setEndTime(nowTime)}>退勤</Button>
      <Button onClick={() => setRestStart(nowTime)}>休憩</Button>
      <Button onClick={() => setRestEnd(nowTime)}>戻り</Button>
      <Box>{user ? `(ユーザー:${user?.name}${user.sub})` : null}</Box>
    </>
  );
};

export default Home;
function toast(arg0: {
  description: string;
  status: string;
  duration: number;
  isClosable: boolean;
  position: string;
}) {
  throw new Error("Function not implemented.");
}
