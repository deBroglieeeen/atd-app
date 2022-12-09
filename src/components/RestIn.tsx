import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  AddRestinMutationMutation,
  AddRestinMutationMutationVariables,
} from "../generated/graphql";
import { addRestinMutation } from "../graphql/rest";
import { useMutation } from "urql";
import { Button, useToast } from "@chakra-ui/react";

type Props = {
  nowTime: string;
  setStartRest: Dispatch<SetStateAction<string>>;
  setRestId: Dispatch<SetStateAction<string>>;
};

const RestIn = ({ nowTime, setStartRest, setRestId }: Props) => {
  const [addRestinResult, addRestin] = useMutation<
    AddRestinMutationMutation,
    AddRestinMutationMutationVariables
  >(addRestinMutation);
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const toast = useToast();

  const clickRestin = async () => {
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }
    try {
      const addRestinResult = await addRestin({
        startRest: nowTime,
      });
      setStartRest(nowTime);
      console.log(addRestinResult.data?.insert_rest_one);
      setRestId(addRestinResult.data?.insert_rest_one?.id);
      if (addRestinResult.error) {
        throw new Error(addRestinResult.error.message);
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
  return <Button onClick={clickRestin}>休憩</Button>;
};
export { RestIn };
