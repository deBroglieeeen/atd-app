import { Dispatch, SetStateAction } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  UpdateRestoutMutation,
  UpdateRestoutMutationVariables,
  UpdateUserStateMutation,
  UpdateUserStateMutationVariables,
} from "../generated/graphql";
import { updateRestoutMutation } from "../graphql/rest";
import { updateUserStateMutation } from "../graphql/userState";
import { useMutation } from "urql";
import { Button, useToast } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useTimer } from "./Clock/useTimer";

type Props = {
  restId: string;
  user_id: string;
};

const RestOutButton = ({ restId, user_id }: Props) => {
  const clickTime = useTimer().format("YYYY-MM-DD HH:mm:ss");
  const [updateRestoutResult, updateRestout] = useMutation<
    UpdateRestoutMutation,
    UpdateRestoutMutationVariables
  >(updateRestoutMutation);
  const [updateUserStateResult, updateUserState] = useMutation<
    UpdateUserStateMutation,
    UpdateUserStateMutationVariables
  >(updateUserStateMutation);
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const toast = useToast();

  const clickRestOut = async () => {
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }
    try {
      const updateRestoutResult = await updateRestout({
        endRest: clickTime,
        restId: restId,
      });
      console.log(updateRestoutResult.data?.update_rest);
      if (updateRestoutResult.error) {
        throw new Error(updateRestoutResult.error.message);
      }
      const updateUserStateResult = await updateUserState({
        user_state: "on",
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
      description: "戻り打刻しました。",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
  };
  return <Button onClick={clickRestOut}>戻り</Button>;
};

export { RestOutButton };
