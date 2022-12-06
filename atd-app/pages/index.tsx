import { NextPage } from "next";
import { useEffect, useState } from "react";
import { dayjs } from "../src/lib/dayjs";
import { Box, Button, Text, Toast } from "@chakra-ui/react";
import { useAuth0, User } from "@auth0/auth0-react";
import {
  AddClockinMutationMutation,
  AddClockinMutationMutationVariables,
  AddClockoutMutationMutation,
  AddClockoutMutationMutationVariables,
  AddRestinMutationMutation,
  AddRestinMutationMutationVariables,
  AddRestoutMutationMutation,
  AddRestoutMutationMutationVariables,
} from "../src/generated/graphql";
import {
  addClockinMutation,
  addClockoutMutation,
} from "../src/graphql/attendance";
import { addRestinMutation, addRestoutMutation } from "../src/graphql/rest";
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
  const [addClockoutResult, addClockout] = useMutation<
    AddClockoutMutationMutation,
    AddClockoutMutationMutationVariables
  >(addClockoutMutation);
  const [addRestinResult, addRestin] = useMutation<
    AddRestinMutationMutation,
    AddRestinMutationMutationVariables
  >(addRestinMutation);
  const [addRestoutResult, addRestout] = useMutation<
    AddRestoutMutationMutation,
    AddRestoutMutationMutationVariables
  >(addRestoutMutation);

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
      const addClockinResult = await addClockin({
        startTime: nowTime,
      });
      setStartTime(nowTime);
      console.log(addClockinResult.data?.insert_attendance_one);
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

  const clickClockout = async () => {
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }
    try {
      const addClockoutResult = await addClockout({
        endTime: nowTime,
      });
      setEndTime(nowTime);
      console.log(addClockoutResult.data?.insert_attendance_one);
      if (addClockoutResult.error) {
        throw new Error(addClockoutResult.error.message);
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

  const clickRestin = async () => {
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }
    try {
      const addRestinResult = await addRestin({
        startRest: nowTime,
      });
      setRestStart(nowTime);
      console.log(addRestinResult.data?.insert_rest_one);
      if (addRestinResult.error) {
        throw new Error(addRestinResult.error.message);
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

  const clickRestout = async () => {
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }
    try {
      const addRestoutResult = await addRestout({
        endRest: nowTime,
      });
      setRestEnd(nowTime);
      console.log(addRestoutResult.data?.insert_rest_one);
      if (addRestoutResult.error) {
        throw new Error(addRestoutResult.error.message);
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
      <Button onClick={clickClockout}>退勤</Button>
      <Button onClick={clickRestin}>休憩</Button>
      <Button onClick={clickRestout}>戻り</Button>
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
