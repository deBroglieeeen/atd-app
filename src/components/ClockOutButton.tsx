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
import useSlackNotify from "./SlackNotify";
import { useCallback } from "react";

type Props = {
  attendanceId: string;
  user_id: string;
};

const ClockOutButton = ({ attendanceId, user_id }: Props) => {
  const clockOutTime = useTimer().format("YYYY-MM-DD HH:mm:ss");
  const [updateClockOutResult, updateClockOut] = useMutation<
    UpdateClockoutMutation,
    UpdateClockoutMutationVariables
  >(updateClockoutMutation);
  const [updateUserStateResult, updateUserState] = useMutation<
    UpdateUserStateMutation,
    UpdateUserStateMutationVariables
  >(updateUserStateMutation);
  const { loginWithRedirect, user } = useAuth0();
  const toast = useToast();
  const slackNotify = useSlackNotify();

  const clickClockOut = useCallback(async () => {
    if (!user) {
      loginWithRedirect();
      return;
    }
    try {
      const updateClockOutResult = await updateClockOut({
        attendanceId: attendanceId,
        endTime: clockOutTime,
      });
      slackNotify({
        user_name: `${user.name}`,
        time: `${clockOutTime}`,
        status: "end_time",
      });
      if (updateClockOutResult.error) {
        throw new Error(updateClockOutResult.error.message);
      }
      const updateUserStateResult = await updateUserState({
        user_state: "off",
        user_id: user_id,
      });
      if (updateUserStateResult.error) {
        throw new Error(updateUserStateResult.error.message);
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

    toast({
      description: "退勤打刻しました。",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
  }, [
    attendanceId,
    clockOutTime,
    loginWithRedirect,
    slackNotify,
    toast,
    updateClockOut,
    updateUserState,
    user,
    user_id,
  ]);

  return <Button onClick={clickClockOut}>退勤</Button>;
};

export { ClockOutButton };
