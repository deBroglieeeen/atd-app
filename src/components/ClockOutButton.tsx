import { Dispatch, SetStateAction } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation } from "urql";
import { Button, useToast } from "@chakra-ui/react";
import {
  UpdateClockoutMutation,
  UpdateClockoutMutationVariables,
  UpdateUserStateMutation,
  UpdateUserStateMutationVariables,
} from "../generated/graphql";
import { updateClockoutMutation } from "../graphql/attendance";
import { updateUserStateMutation } from "../graphql/userState";
import { useTimer } from "./Clock/useTimer";

type Props = {
  attendanceId: string;
  user_id: string;
};

const ClockOutButton = ({ attendanceId, user_id }: Props) => {
  const clickTime = useTimer().format("YYYY-MM-DD HH:mm:ss");
  const [updateClockoutResult, updateClockout] = useMutation<
    UpdateClockoutMutation,
    UpdateClockoutMutationVariables
  >(updateClockoutMutation);
  const [updateUserStateResult, updateUserState] = useMutation<
    UpdateUserStateMutation,
    UpdateUserStateMutationVariables
  >(updateUserStateMutation);
  const { isAuthenticated, loginWithRedirect, user } = useAuth0();
  const toast = useToast();

  const clickClockOut = async () => {
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }
    try {
      const updateClockoutResult = await updateClockout({
        attendanceId: attendanceId,
        endTime: clickTime,
      });
      console.log(updateClockoutResult.data?.update_attendance);
      if (updateClockoutResult.error) {
        throw new Error(updateClockoutResult.error.message);
      }
      const updateUserStateResult = await updateUserState({
        user_state: "off",
        user_id: user_id,
      });
      if (updateUserStateResult.error) {
        throw new Error(updateUserStateResult.error.message);
      }
      fetch("/api/notify", {
        method: "POST",
        mode: "same-origin",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ message: `${user?.name} :退勤` }),
      });
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

    toast({
      description: "退勤打刻しました。",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
  };

  return <Button onClick={clickClockOut}>退勤</Button>;
};

export { ClockOutButton };
