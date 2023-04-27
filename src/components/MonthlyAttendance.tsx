import { useAuth0 } from '@auth0/auth0-react'
import {
  Box,
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

  if (fetching || !data || !isAuthenticated) return <div>loading...</div>

  const attendance = monthDays.map((day) => {
    const dayAttendance = data.attendance.find(
      (attendance) =>
        dayjs.tz(attendance.start_time).format('YYYY-MM-DD') ===
        dayjs.tz(day).format('YYYY-MM-DD')
    )

    const dayRest = data.rest.find(
      (rest) =>
        dayjs.tz(rest.start_rest).format('YYYY-MM-DD') ===
        dayjs.tz(day).format('YYYY-MM-DD')
    )

    if (!dayAttendance) {
      return {
        date: dayjs.tz(day).format('YYYY-MM-DD'),
        start_time: '',
        end_time: '',
        start_rest: '',
        end_rest: '',
      }
    }

    return {
      date: dayjs.tz(day).format('YYYY-MM-DD'),
      start_time: dayjs.tz(dayAttendance.start_time).format('HH:mm'),
      end_time: !!dayAttendance?.end_time
        ? dayjs.tz(dayAttendance.end_time).format('HH:mm')
        : '',
      start_rest: !!dayRest?.start_rest
        ? dayjs.tz(dayRest.start_rest).format('HH:mm')
        : '',
      end_rest: !!dayRest?.end_rest
        ? dayjs.tz(dayRest.end_rest).format('HH:mm')
        : '',
    }
  })

  return (
    <Box p='4'>
      <Text fontSize='lg'>{curentMonthStart.get('month') + 1}月の勤怠</Text>
      <TableContainer w='50%'>
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
                <Th>{day.start_time}</Th>
                <Th>{day.end_time}</Th>
                <Th>{day.start_rest}</Th>
                <Th>{day.end_rest}</Th>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  )
}
