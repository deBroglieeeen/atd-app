import { NextPage } from "next";
import { useEffect, useMemo } from "react";
import { dayjs } from "../lib/dayjs";
import { Box, Button, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { useAuth0 } from "@auth0/auth0-react";
import { ClockInButton } from "./ClockInButton";
import { ClockOutButton } from "./ClockOutButton";
import { RestInButton } from "./RestInButton";
import { RestOutButton } from "./RestOutButton";
import { useQuery } from "urql";
import {
  Get3DaysDataQuery,
  Get3DaysDataQueryVariables,
  GetCurrentMonthAttendanceQuery,
  GetCurrentMonthAttendanceQueryVariables,
  GetUserStateQuery,
  GetUserStateQueryVariables,
} from "../generated/graphql";
import { get3DaysDataQuery, getCurrentMonthAttendanceQuery, getUserStateQuery } from "../graphql/userState";
import {
  GetUserTimesQuery,
  GetUserTimesQueryVariables,
} from "../generated/graphql";
import { getUserTimesQuery } from "../graphql/userState";
import DayRecords from "./DayRecords";
import { DigitalClock } from "./Clock/DigitalClock";
import { userStateMap } from "../constants";

const TopPage: NextPage = () => {
  const days = {
    sub_today: `${dayjs.utc().add(1, "day")}`,
    today: `${dayjs.utc().format("YYYY-MM-DD")}`,
    yesterday: `${dayjs.utc().subtract(1, "day").format("YYYY-MM-DD")}`,
    two_days_ago: `${dayjs.utc().subtract(2, "day").format("YYYY-MM-DD")}`,
  };
  const { user, loginWithRedirect, logout } = useAuth0();
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

  const startMonth = useMemo(() => {
    const month = dayjs().date() >= 11 ? dayjs().month() : dayjs().month() - 1;
    return dayjs().month(month).startOf("month").format("YYYY-MM-11");
  }, []);
  const endMonth = useMemo(() => {
    const month = dayjs().date() >= 11 ? dayjs().month() + 1 : dayjs().month();
    return dayjs().month(month).endOf("month").format("YYYY-MM-10");
  }, []);

  const [{data: currentMonthAttendance}] = useQuery<GetCurrentMonthAttendanceQuery, GetCurrentMonthAttendanceQueryVariables>({
    query: getCurrentMonthAttendanceQuery,
    variables: {
      start: startMonth,
      end: endMonth,
    }
  })

  // Memo: テーブルの持ち方を変えればこの計算は不要になる
  const totalWorkingTime = useMemo(() => {
    if (!currentMonthAttendance) return 0;
    
    const totalAttendance = currentMonthAttendance.attendance.filter((attendance) => !!attendance.end_time).map((attendance) => {
      const start = dayjs(attendance.start_time);
      const end = dayjs(attendance.end_time);
      return end.diff(start);
    }).reduce((a, b) => a + b, 0)

    const totalRest = currentMonthAttendance.rest.filter((rest) => !!rest.end_rest).map((rest) => {
      const start = dayjs(rest.start_rest);
      const end = dayjs(rest.end_rest);
      return end.diff(start);
    }).reduce((a, b) => a + b, 0)

    return totalAttendance - totalRest
  }, [currentMonthAttendance])

  const formatTotalWorkingTime = useMemo(() => {
    const HOUR = 24
    const totalHours = dayjs.duration(totalWorkingTime).days() * HOUR + dayjs.duration(totalWorkingTime).hours()
    return `${totalHours}時間${dayjs.duration(totalWorkingTime).minutes()}分`
  }, [totalWorkingTime])

  const paidDate = useMemo(() => {
    const month = dayjs().date() >= 11 ? dayjs().month() + 1 : dayjs().month();
    return dayjs().month(month);
  }, [])

  const daysDataMemo = useMemo(
    () => (
      <>
        <DayRecords day={days.today} daydata={daysdata} />
        <DayRecords day={days.yesterday} daydata={daysdata} />
        <DayRecords day={days.two_days_ago} daydata={daysdata} />
      </>
    ),
    [days.today, days.two_days_ago, days.yesterday, daysdata]
  );
  //index.tsでisAuthenticatedの判断しているから、ここでログインしているかどうかの確認はいらないのでは？
  useEffect(() => {
    if (user === null) {
      loginWithRedirect();
    }
  }, [loginWithRedirect, user, user_state]);

  const isWorking = useMemo(() => {
    return user_state?.users_by_pk?.state === 'on'
  }, [user_state])

  const isResting = useMemo(() => {
    return user_state?.users_by_pk?.state === 'rest'
  }, [user_state])

  return fetching ? (
    <Box display="flex" justifyContent="center">
      <Spinner />
    </Box>
  ) : (
    <Box p='4'>
      <Flex py='2' justifyContent='space-between'>
        <Heading>atd app</Heading>
        <Button
          onClick={() => {
            logout({ returnTo: window.location.origin });
          }}
        >
          Log out
        </Button>
      </Flex>
      <Box>{user ? `(ユーザー:${user?.name}${user.sub})` : null}</Box>
      <Box py='2'>
        <Text as='span' fontWeight='bold'>
          {paidDate.format("YYYY")}年{paidDate.format("MM")}月
        </Text>
        分の稼働:&nbsp;
        <Text as='span' fontWeight='bold'>
          {formatTotalWorkingTime}
        </Text>
      </Box>
      <Text color={`${user_state?.users_by_pk?.state}`}>
        {userStateMap.get(`${user_state?.users_by_pk?.state}`)}
      </Text>

      <DigitalClock />
      <Flex gap='2'>
        <ClockInButton user_id={user?.sub || ""} isDisabled={isWorking || isResting} />
        <ClockOutButton
          attendanceId={timesResponse?.attendance[0]?.id}
          user_id={user?.sub || ""}
          isDisabled={!isWorking || isResting}
        />
        <RestInButton user_id={user?.sub || ""} 
        isDisabled={!isWorking}
        />
        <RestOutButton
          restId={timesResponse?.rest[0]?.id ?? ""}
          user_id={user?.sub || ""}
          isDisabled={!isResting}
        />
      </Flex>

      <Box p={4}>
        <Text fontSize="2xl">3Days Records</Text>
        {daysDataMemo}
      </Box>
      
    </Box>
  );
};

export default TopPage;
