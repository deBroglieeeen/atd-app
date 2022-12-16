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

type Props = {
  nowTime: string;
  attendanceId: string;
  user_id: string;
};

const ClockOutButton = ({ nowTime, attendanceId, user_id }: Props) => {
  const [updateClockoutResult, updateClockout] = useMutation<
    UpdateClockoutMutation,
    UpdateClockoutMutationVariables
  >(updateClockoutMutation);
  const [updateUserStateResult, updateUserState] = useMutation<
    UpdateUserStateMutation,
    UpdateUserStateMutationVariables
  >(updateUserStateMutation);
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const toast = useToast();

  const clickClockOut = async () => {
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }
    try {
      const updateClockoutResult = await updateClockout({
        attendanceId: attendanceId,
        endTime: nowTime,
      });
      console.log(updateClockoutResult.data?.update_attendance);
      if (updateClockoutResult.error) {
        throw new Error(updateClockoutResult.error.message);
      }
      const updateUserStateResult = await updateUserState({
        user_state: "勤務外",
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
  };

  return <Button onClick={clickClockOut}>退勤</Button>;
};

export { ClockOutButton };
