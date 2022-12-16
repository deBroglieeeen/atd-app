import { Dispatch, SetStateAction } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  UpdateRestoutMutationMutation,
  UpdateRestoutMutationMutationVariables,
  UpdateUserStateMutationMutation,
  UpdateUserStateMutationMutationVariables,
} from "../generated/graphql";
import { updateRestoutMutation } from "../graphql/rest";
import { updateUserStateMutation } from "../graphql/userState";
import { useMutation } from "urql";
import { Button, useToast } from "@chakra-ui/react";

type Props = {
  nowTime: string;
  restId: string;
  user_id: string;
};

const RestOutButton = ({ nowTime, restId, user_id }: Props) => {
  const [updateRestoutResult, updateRestout] = useMutation<
    UpdateRestoutMutationMutation,
    UpdateRestoutMutationMutationVariables
  >(updateRestoutMutation);
  const [updateUserStateResult, updateUserState] = useMutation<
    UpdateUserStateMutationMutation,
    UpdateUserStateMutationMutationVariables
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
        restId: restId,
        endRest: nowTime,
      });
      console.log(updateRestoutResult.data?.update_rest);
      if (updateRestoutResult.error) {
        throw new Error(updateRestoutResult.error.message);
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
