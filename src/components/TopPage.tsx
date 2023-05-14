import { NextPage } from 'next'
import { useEffect, useMemo } from 'react'
import { dayjs } from '../lib/dayjs'
import { Box, Flex, Spinner, Text } from '@chakra-ui/react'
import { useAuth0 } from '@auth0/auth0-react'
import { ClockInButton } from './ClockInButton'
import { ClockOutButton } from './ClockOutButton'
import { RestInButton } from './RestInButton'
import { RestOutButton } from './RestOutButton'
import { useQuery } from 'urql'
import {
  Get3DaysDataQuery,
  Get3DaysDataQueryVariables,
  GetUserStateQuery,
  GetUserStateQueryVariables,
  GetUserTimesQuery,
  GetUserTimesQueryVariables,
} from '../generated/graphql'
import {
  get3DaysDataQuery,
  getUserStateQuery,
  getUserTimesQuery,
} from '../graphql/userState'
import DayRecords from './DayRecords'
import { DigitalClock } from './Clock/DigitalClock'
import { userStateMap } from '../constants'
import { Header } from './common/Header'
import { WorkingTime } from './WorkingTime'

const TopPage: NextPage = () => {
  const days = {
    sub_today: `${dayjs.utc().add(1, 'day')}`,
    today: `${dayjs.utc().format('YYYY-MM-DD')}`,
    yesterday: `${dayjs.utc().subtract(1, 'day').format('YYYY-MM-DD')}`,
    two_days_ago: `${dayjs.utc().subtract(2, 'day').format('YYYY-MM-DD')}`,
  }
  const { user, loginWithRedirect } = useAuth0()
  const [{ data: user_state, fetching }] = useQuery<
    GetUserStateQuery,
    GetUserStateQueryVariables
  >({
    query: getUserStateQuery,
    variables: {
      user_id: user?.sub || '',
    },
  })
  const [{ data: timesResponse }] = useQuery<
    GetUserTimesQuery,
    GetUserTimesQueryVariables
  >({
    query: getUserTimesQuery,
    variables: {
      user_id: user?.sub || '',
    },
  })
  const [{ data: daysdata }] = useQuery<
    Get3DaysDataQuery,
    Get3DaysDataQueryVariables
  >({
    query: get3DaysDataQuery,
    variables: {
      today: days.sub_today,
      two_days_ago: days.two_days_ago,
      user_id: user?.sub || '',
    },
  })
  const currentMonth = useMemo(() => {
    const month = dayjs().date() >= 11 ? dayjs().month() + 1 : dayjs().month()
    return month
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
  )
  //index.tsでisAuthenticatedの判断しているから、ここでログインしているかどうかの確認はいらないのでは？
  useEffect(() => {
    if (user === null) {
      loginWithRedirect()
    }
  }, [loginWithRedirect, user, user_state])

  const isWorking = useMemo(() => {
    return user_state?.users_by_pk?.state === 'on'
  }, [user_state])

  const isResting = useMemo(() => {
    return user_state?.users_by_pk?.state === 'rest'
  }, [user_state])

  return fetching ? (
    <Flex justifyContent='center' alignItems='center' h='100dvh'>
      <Spinner />
    </Flex>
  ) : (
    <Box px='4'>
      <Header />
      <Box>{user ? `(ユーザー:${user?.name}${user.sub})` : null}</Box>
      <WorkingTime targetMonth={currentMonth - 1} />
      <WorkingTime targetMonth={currentMonth} />

      <Text color={`${user_state?.users_by_pk?.state}`}>
        {userStateMap.get(`${user_state?.users_by_pk?.state}`)}
      </Text>

      <DigitalClock />
      <Flex gap='2'>
        <ClockInButton
          user_id={user?.sub || ''}
          isDisabled={isWorking || isResting}
        />
        <ClockOutButton
          attendanceId={timesResponse?.attendance[0]?.id}
          user_id={user?.sub || ''}
          isDisabled={!isWorking || isResting}
        />
        <RestInButton user_id={user?.sub || ''} isDisabled={!isWorking} />
        <RestOutButton
          restId={timesResponse?.rest[0]?.id ?? ''}
          user_id={user?.sub || ''}
          isDisabled={!isResting}
        />
      </Flex>

      <Box p={4}>
        <Text fontSize='2xl'>3Days Records</Text>
        {daysDataMemo}
      </Box>
    </Box>
  )
}

export default TopPage
