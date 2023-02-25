import { Dispatch, SetStateAction } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  AddClockinMutation,
  AddClockinMutationVariables,
} from "../generated/graphql";
import { addClockinMutation } from "../graphql/attendance";
import {
  UpdateUserStateMutation,
  UpdateUserStateMutationVariables,
} from "../generated/graphql";
import { updateUserStateMutation } from "../graphql/userState";
import { useMutation } from "urql";
import { Button, useToast } from "@chakra-ui/react";
import dayjs from "dayjs";

type Props = {
  user_id: string;
};

const ClockInButton = ({ user_id }: Props) => {
  const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
  const [addClockinResult, addClockin] = useMutation<
    AddClockinMutation,
    AddClockinMutationVariables
  >(addClockinMutation);
  const [updateUserStateResult, updateUserState] = useMutation<
    UpdateUserStateMutation,
    UpdateUserStateMutationVariables
  >(updateUserStateMutation);
  const { isAuthenticated, loginWithRedirect, user } = useAuth0();
  const toast = useToast();

  const clickClockIn = async () => {
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }
    try {
      const addClockinResult = await addClockin({
        startTime: now,
      });
      console.log(addClockinResult.data?.insert_attendance_one);
      if (addClockinResult.error) {
        throw new Error(addClockinResult.error.message);
      }
      const updateUserStateResult = await updateUserState({
        user_state: "勤務中",
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
      description: "出勤打刻しました。",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
  };

  return <Button onClick={clickClockIn}>出勤</Button>;
};

export { ClockInButton };
