import { Box, Text } from '@chakra-ui/react'
import { useMemo } from 'react'
import { useQuery } from 'urql'
import {
  GetCurrentMonthAttendanceQuery,
  GetCurrentMonthAttendanceQueryVariables,
} from '@/generated/graphql'
import { getCurrentMonthAttendanceQuery } from '@/graphql/userState'
import { dayjs } from '@/lib/dayjs'

type Props = {
  targetMonth: number
}
export const WorkingTime = ({ targetMonth }: Props) => {
  const startMonth = useMemo(() => {
    return dayjs()
      .month(targetMonth - 1)
      .startOf('month')
      .format('YYYY-MM-11')
  }, [targetMonth])
  const endMonth = useMemo(() => {
    return dayjs().month(targetMonth).endOf('month').format('YYYY-MM-10')
  }, [targetMonth])

  const [{ data: currentMonthAttendance }] = useQuery<
    GetCurrentMonthAttendanceQuery,
    GetCurrentMonthAttendanceQueryVariables
  >({
    query: getCurrentMonthAttendanceQuery,
    variables: {
      start: startMonth,
      end: endMonth,
    },
  })

  // Memo: テーブルの持ち方を変えればこの計算は不要になる
  const totalWorkingTime = useMemo(() => {
    if (!currentMonthAttendance) return 0

    const totalAttendance = currentMonthAttendance.attendance
      .filter((attendance) => !!attendance.end_time)
      .map((attendance) => {
        const start = dayjs(attendance.start_time)
        const end = dayjs(attendance.end_time)
        return end.diff(start)
      })
      .reduce((a, b) => a + b, 0)

    const totalRest = currentMonthAttendance.rest
      .filter((rest) => !!rest.end_rest)
      .map((rest) => {
        const start = dayjs(rest.start_rest)
        const end = dayjs(rest.end_rest)
        return end.diff(start)
      })
      .reduce((a, b) => a + b, 0)

    return totalAttendance - totalRest
  }, [currentMonthAttendance])

  const formatTotalWorkingTime = useMemo(() => {
    const HOUR = 24
    const totalHours =
      dayjs.duration(totalWorkingTime).days() * HOUR +
      dayjs.duration(totalWorkingTime).hours()
    return `${totalHours}時間${dayjs.duration(totalWorkingTime).minutes()}分`
  }, [totalWorkingTime])

  const paidDate = useMemo(() => {
    return dayjs().month(targetMonth)
  }, [targetMonth])

  return (
    <Box py='2'>
      <Text as='span' fontWeight='bold'>
        {paidDate.format('YYYY')}年{paidDate.format('MM')}月
      </Text>
      分の稼働:&nbsp;
      <Text as='span' fontWeight='bold'>
        {formatTotalWorkingTime}
      </Text>
    </Box>
  )
}
