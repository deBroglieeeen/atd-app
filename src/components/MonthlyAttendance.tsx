import { useAuth0 } from '@auth0/auth0-react'
import {
  Box,
  Center,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { dayjs } from '../lib/dayjs'
import { useMemo } from 'react'
import { useQuery } from 'urql'
import {
  GetAttendanceQuery,
  GetAttendanceQueryVariables,
} from '../generated/graphql'
import { getAttendanceQuery } from '../graphql/attendance'
import { Header, HEADER_HEIGHT } from './common/Header'

export const MonthlyAttenadnce = () => {
  const { isAuthenticated } = useAuth0()
  const curentMonthStart = dayjs().startOf('month')
  const currentMonthEnd = dayjs().endOf('month')
  const monthDays = useMemo(() => {
    const days = currentMonthEnd.diff(curentMonthStart, 'day') + 1
    return [...Array(days)].map((_, i) => {
      return dayjs().date(i + 1)
    })
  }, [])

  const [{ data, fetching }] = useQuery<
    GetAttendanceQuery,
    GetAttendanceQueryVariables
  >({
    query: getAttendanceQuery,
    variables: {
      start: curentMonthStart,
      end: currentMonthEnd,
    },
  })

  if (fetching || !data || !isAuthenticated)
    return (
      // Memo: Layoutで共通にしたい
      <Box px='4'>
        <Header />
        <Center h={`calc(100dvh - ${HEADER_HEIGHT})`}>
          <Spinner
            thickness='4px'
            speed='0.65s'
            emptyColor='gray.200'
            color='blue.500'
            size='xl'
          />
        </Center>
      </Box>
    )

  const attendance = monthDays.map((day) => {
    const dayAttendances = data.attendance.filter(
      (attendance) =>
        dayjs.tz(attendance.start_time).format('YYYY-MM-DD') ===
        dayjs.tz(day).format('YYYY-MM-DD')
    )

    const dayRests = data.rest.filter(
      (rest) =>
        dayjs.tz(rest.start_rest).format('YYYY-MM-DD') ===
        dayjs.tz(day).format('YYYY-MM-DD')
    )

    if (!dayAttendances) {
      return {
        date: dayjs.tz(day).format('YYYY-MM-DD'),
        start_times: [''],
        end_times: [''],
        start_rests: [''],
        end_rests: [''],
      }
    }

    return {
      date: dayjs.tz(day).format('YYYY-MM-DD'),
      start_times: dayAttendances.map((dayAttendance) =>
        dayjs.tz(dayAttendance.start_time).format('HH:mm')
      ),
      end_times: dayAttendances.map((dayAttendance) =>
        !!dayAttendance?.end_time
          ? dayjs.tz(dayAttendance.end_time).format('HH:mm')
          : ''
      ),
      start_rests: dayRests.map((dayRest) =>
        !!dayRest?.start_rest
          ? dayjs.tz(dayRest.start_rest).format('HH:mm')
          : ''
      ),
      end_rests: dayRests.map((dayRest) =>
        !!dayRest?.end_rest ? dayjs.tz(dayRest.end_rest).format('HH:mm') : ''
      ),
    }
  })

  return (
    <Box px='4'>
      <Header />

      <Text fontSize='lg'>{curentMonthStart.get('month') + 1}月の勤怠</Text>
      <TableContainer>
        <Table size='md'>
          <Thead>
            <Tr>
              <Th>日付</Th>
              <Th>出勤</Th>
              <Th>退勤</Th>
              <Th>休憩</Th>
              <Th>戻り</Th>
            </Tr>
          </Thead>
          <Tbody>
            {attendance.map((day) => (
              <Tr key={day.date}>
                <Th>{day.date}</Th>
                <Th>
                  {day.start_times.map((start_time) => (
                    <Text>{start_time}</Text>
                  ))}
                </Th>
                <Th>
                  {day.end_times.map((end_time) => (
                    <Text>{end_time}</Text>
                  ))}
                </Th>
                <Th>
                  {day.start_rests.map((start_rest) => (
                    <Text>{start_rest}</Text>
                  ))}
                </Th>
                <Th>
                  {day.end_rests.map((end_rest) => (
                    <Text>{end_rest}</Text>
                  ))}
                </Th>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  )
}
