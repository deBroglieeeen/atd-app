import { NextPage } from "next";
import { useEffect, useMemo, useState } from "react";
import { dayjs } from "../lib/dayjs";
import {
  Box,
  Button,
  Container,
  Heading,
  Spacer,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useAuth0 } from "@auth0/auth0-react";
import { ClockInButton } from "./ClockInButton";
import { ClockOutButton } from "./ClockOutButton";
import { RestInButton } from "./RestInButton";
import { RestOutButton } from "./RestOutButton";
import { useQuery } from "urql";
import {
  Get3DaysDataQuery,
  Get3DaysDataQueryVariables,
  GetUserStateQuery,
  GetUserStateQueryVariables,
} from "../generated/graphql";
import { get3DaysDataQuery, getUserStateQuery } from "../graphql/userState";
import {
  GetUserTimesQuery,
  GetUserTimesQueryVariables,
} from "../generated/graphql";
import { getUserTimesQuery } from "../graphql/userState";
import DayRecords from "./DayRecords";
import { DigitalClock } from "./Clock/DigitalClock";

const TopPage: NextPage = () => {
  const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
  const [nowTime, setNowtime] = useState(now);
  const days = {
    sub_today: `${dayjs.utc().add(1, "day")}`,
    today: `${dayjs.utc().format("YYYY-MM-DD")}`,
    yesterday: `${dayjs.utc().subtract(1, "day").format("YYYY-MM-DD")}`,
    two_days_ago: `${dayjs.utc().subtract(2, "day").format("YYYY-MM-DD")}`,
  };
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
  const [{ data: daysdata }] = useQuery<
    Get3DaysDataQuery,
    Get3DaysDataQueryVariables
  >({
    query: get3DaysDataQuery,
    variables: {
      today: days.sub_today,
      two_days_ago: days.two_days_ago,
      user_id: user?.sub || "",
    },
  });

  const daysDataMemo = useMemo(
    () => (
      <>
        <DayRecords day={days.today} daydata={daysdata} />
        <DayRecords day={days.yesterday} daydata={daysdata} />
        <DayRecords day={days.two_days_ago} daydata={daysdata} />
      </>
    ),
    [daysdata]
  );

  //index.tsでisAuthenticatedの判断しているから、ここでログインしているかどうかの確認はいらないのでは？
  useEffect(() => {
    if (user === null) {
      loginWithRedirect();
    }
    setNowtime(now);
  }, [loginWithRedirect, user_state]);

  return fetching ? (
    <Box display="flex" justifyContent="center">
      <Spinner />
    </Box>
  ) : (
    <>
      <Heading>atd app</Heading>
      <Text color="#E53E3E">{`${user_state?.users_by_pk?.state}`}</Text>
      <DigitalClock />
      <Box p={4}>
        <Text fontSize="2xl">3Days Records</Text>
        {daysDataMemo}
      </Box>
      <ClockInButton nowTime={nowTime} user_id={user?.sub || ""} />
      <ClockOutButton
        nowTime={nowTime}
        attendanceId={timesResponse?.attendance[0].id}
        user_id={user?.sub || ""}
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
