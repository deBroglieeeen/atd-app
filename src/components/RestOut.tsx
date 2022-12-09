import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  UpdateRestoutMutationMutation,
  UpdateRestoutMutationMutationVariables,
} from "../generated/graphql";
import { updateRestoutMutation } from "../graphql/rest";
import { useMutation } from "urql";
import { Button, useToast } from "@chakra-ui/react";

type Props = {
  nowTime: string;
  setEndRest: Dispatch<SetStateAction<string>>;
  restId: string;
};

const RestOut = ({ nowTime, setEndRest, restId }: Props) => {
  const [addRestoutResult, addRestout] = useMutation<
    UpdateRestoutMutationMutation,
    UpdateRestoutMutationMutationVariables
  >(updateRestoutMutation);
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const toast = useToast();

  const clickRestout = async () => {
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }
    try {
      const updateRestoutResult = await addRestout({
        restId: restId,
        endRest: nowTime,
      });
      setEndRest(nowTime);
      console.log(updateRestoutResult.data?.update_rest);
      if (updateRestoutResult.error) {
        throw new Error(updateRestoutResult.error.message);
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
  return <Button onClick={clickRestout}>戻り</Button>;
};

export { RestOut };
