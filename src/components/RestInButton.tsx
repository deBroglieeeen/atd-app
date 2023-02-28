import { Dispatch, SetStateAction } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  AddRestinMutation,
  AddRestinMutationVariables,
} from "../generated/graphql";
import { addRestinMutation } from "../graphql/rest";
import {
  UpdateUserStateMutation,
  UpdateUserStateMutationVariables,
} from "../generated/graphql";
import { updateUserStateMutation } from "../graphql/userState";
import { useMutation } from "urql";
import { Button, useToast } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useTimer } from "./Clock/useTimer";

type Props = {
  user_id: string;
};

const RestInButton = ({ user_id }: Props) => {
  const clickTime = useTimer().format("YYYY-MM-DD HH:mm:ss");

  const [addRestinResult, addRestin] = useMutation<
    AddRestinMutation,
    AddRestinMutationVariables
  >(addRestinMutation);
  const [updateUserStateResult, updateUserState] = useMutation<
    UpdateUserStateMutation,
    UpdateUserStateMutationVariables
  >(updateUserStateMutation);
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const toast = useToast();

  const clickRestIn = async () => {
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }
    try {
      const addRestinResult = await addRestin({
        startRest: clickTime,
      });
      console.log(addRestinResult.data?.insert_rest_one);
      if (addRestinResult.error) {
        throw new Error(addRestinResult.error.message);
      }
      const updateUserStateResult = await updateUserState({
        user_state: "rest",
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
      description: "休憩打刻しました。",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
  };
  return <Button onClick={clickRestIn}>休憩</Button>;
};
export { RestInButton };
