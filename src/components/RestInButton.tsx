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
import { useTimer } from "./Clock/useTimer";
import useSlackNotify from "./SlackNotify";
import { useCallback } from "react";

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
  const { loginWithRedirect, user } = useAuth0();
  const toast = useToast();
  const slackNotify = useSlackNotify();

  const clickRestIn = useCallback(async () => {
    if (!user) {
      loginWithRedirect();
      return;
    }
    try {
      const addRestinResult = await addRestin({
        startRest: clickTime,
      });
      slackNotify({
        user_name: `${user.name}`,
        time: `${clickTime}`,
        status: "start_rest",
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
  }, [
    addRestin,
    clickTime,
    loginWithRedirect,
    slackNotify,
    toast,
    updateUserState,
    user,
    user_id,
  ]);
  return <Button onClick={clickRestIn}>休憩</Button>;
};
export { RestInButton };
