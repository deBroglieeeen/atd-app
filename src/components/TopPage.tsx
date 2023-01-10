import { NextPage } from "next";
import { useEffect, useState } from "react";
import { dayjs } from "../lib/dayjs";
import { Box, Button, Heading, Spinner, Text } from "@chakra-ui/react";
import { useAuth0 } from "@auth0/auth0-react";
import { ClockInButton } from "./ClockInButton";
import { ClockOutButton } from "./ClockOutButton";
import { RestInButton } from "./RestInButton";
import { RestOutButton } from "./RestOutButton";
import { useQuery } from "urql";
import {
  GetUserStateQuery,
  GetUserStateQueryVariables,
} from "../generated/graphql";
import { getUserStateQuery } from "../graphql/userState";
import {
  GetUserTimesQuery,
  GetUserTimesQueryVariables,
} from "../generated/graphql";
import { getUserTimesQuery } from "../graphql/userState";

const TopPage: NextPage = () => {
  const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
  const [nowTime, setNowtime] = useState(now);
  // const [attendanceButton, setAttendanceButton] = useState(true);
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const [{ data: user_state, fetching }] = useQuery<
    GetUserStateQuery,
    GetUserStateQueryVariables
  >({
    query: getUserStateQuery,
    variables: {
      user_id: user?.sub || "",
    },
  });
  const [{ data: timesResponse }] = useQuery<
    GetUserTimesQuery,
    GetUserTimesQueryVariables
  >({
    query: getUserTimesQuery,
    variables: {
      user_id: user?.sub || "",
    },
  });

  useEffect(() => {
    if (user === null) {
      loginWithRedirect();
    }

    const timer = setInterval(() => {
      const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
      setNowtime(now);
    }, 1000);
    return () => clearInterval(timer);
  }, [isAuthenticated, loginWithRedirect, user_state]);

  return fetching ? (
    <Box display="flex" justifyContent="center">
      <Spinner />
    </Box>
  ) : (
    <>
      <Heading>atd app</Heading>
      <Text color="#E53E3E">{`${user_state?.users_by_pk?.state}`}</Text>
      <Text suppressHydrationWarning={true}>{`${nowTime}`}</Text>
      <Box>
        <Text>
          出勤時刻：{`${timesResponse?.attendance[0]?.start_time ?? ""}`}
        </Text>
        <Text>
          退勤時刻：{`${timesResponse?.attendance[0]?.end_time ?? ""}`}
        </Text>
        <Text>休憩入り：{`${timesResponse?.rest[0]?.start_rest ?? ""}`}</Text>
        <Text>休憩戻り：{`${timesResponse?.rest[0]?.end_rest ?? ""}`}</Text>
      </Box>
      <ClockInButton
        nowTime={nowTime}
        user_id={user?.sub || ""}
        // attendanceButton={!attendanceButton}
      />
      <ClockOutButton
        nowTime={nowTime}
        attendanceId={timesResponse?.attendance[0].id}
        user_id={user?.sub || ""}
        // attendanceButton={attendanceButton}
      />
      <RestInButton nowTime={nowTime} user_id={user?.sub || ""} />
      <RestOutButton
        nowTime={nowTime}
        restId={timesResponse?.rest[0]?.id ?? ""}
        user_id={user?.sub || ""}
      />
      <Box>{user ? `(ユーザー:${user?.name}${user.sub})` : null}</Box>
      <Button
        onClick={() => {
          logout({ returnTo: window.location.origin });
        }}
      >
        Log out
      </Button>
    </>
  );
};

export default TopPage;
