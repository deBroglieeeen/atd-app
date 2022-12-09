import { Dispatch, SetStateAction } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation } from "urql";
import { Button, useToast } from "@chakra-ui/react";
import {
  UpdateClockoutMutationMutation,
  UpdateClockoutMutationMutationVariables,
} from "../generated/graphql";
import { updateClockoutMutation } from "../graphql/attendance";

type Props = {
  nowTime: string;
  setEndTime: Dispatch<SetStateAction<string>>;
  attendanceId: string;
};

const ClockOutButton = ({ nowTime, setEndTime, attendanceId }: Props) => {
  const [updateClockoutResult, updateClockout] = useMutation<
    UpdateClockoutMutationMutation,
    UpdateClockoutMutationMutationVariables
  >(updateClockoutMutation);
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
      setEndTime(nowTime);
      console.log(updateClockoutResult.data?.update_attendance);
      if (updateClockoutResult.error) {
        throw new Error(updateClockoutResult.error.message);
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
