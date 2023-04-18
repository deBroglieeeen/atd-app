import { attendanceMap } from "../constants";

type Props = {
  user_name: string;
  time: string;
  status: "start_time" | "end_time" | "start_rest" | "end_rest";
};

const useSlackNotify = () => {
  const slackNotify = async ({ user_name, time, status }: Props) => {
    await fetch("/api/notify", {
      method: "POST",
      mode: "same-origin",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        message: `${user_name} : ${time.substring(11, 16)} ${attendanceMap.get(
          status
        )}`,
      }),
    });
  };
  return slackNotify;
};

export default useSlackNotify;
