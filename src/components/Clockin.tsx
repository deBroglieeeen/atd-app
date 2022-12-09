import { NextPage } from "next";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAuth0, User } from "@auth0/auth0-react";
import {
  AddClockinMutationMutation,
  AddClockinMutationMutationVariables,
} from "../generated/graphql";
import { addClockinMutation } from "../graphql/attendance";
import { useMutation } from "urql";
import { Button } from "@chakra-ui/react";

type Props = {
  nowTime: string;
  setStartTime: Dispatch<SetStateAction<string>>;
  setAttendanceId: Dispatch<SetStateAction<string>>;
};

const Clockin = ({ nowTime, setStartTime, setAttendanceId }: Props) => {
  const [addClockinResult, addClockin] = useMutation<
    AddClockinMutationMutation,
    AddClockinMutationMutationVariables
  >(addClockinMutation);
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  const clickClockin = async () => {
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
      setAttendanceId(addClockinResult.data?.insert_attendance_one?.id);
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

  return <Button onClick={clickClockin}>出勤</Button>;
};

export { Clockin };

function toast(arg0: {
  description: string;
  status: string;
  duration: number;
  isClosable: boolean;
  position: string;
}) {
  throw new Error("Function not implemented.");
}
