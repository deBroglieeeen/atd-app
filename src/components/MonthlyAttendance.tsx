import { useAuth0 } from '@auth0/auth0-react'
import {
  Box,
  Center,
  Flex,
  Select,
  Skeleton,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import { dayjs } from '@/lib/dayjs'
import { useCallback, useMemo, useState } from 'react'
import { useQuery } from 'urql'
import {
  GetAttendanceQuery,
  GetAttendanceQueryVariables,
} from '@/generated/graphql'
import { getAttendanceQuery } from '@/graphql/attendance'
import { Header, HEADER_HEIGHT } from './common/Header'
import { UpdateAttendanceModal } from './UpdateAttendanceModal'
import { useFormatTotalWorkingTime } from '@/hooks/useFormatTotalWorkingTime'

type Mode = 'monthly' | 'paid_date'

type AttendanceTable = {
  id: number
  date: string
  start_times: string[]
  end_times: string[]
  start_rests: string[]
  end_rests: string[]
  total_time: number
}

export const MonthlyAttenadnce = () => {
  const { isAuthenticated } = useAuth0()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedDate, setSelectedDate] = useState('')
  const formatTotalWorkingTime = useFormatTotalWorkingTime()
  const [mode, setMode] = useState<Mode>('monthly')

  const { curentMonthStart, currentMonthEnd } = useMemo(() => {
    if (mode === 'monthly') {
      const curentMonthStart = dayjs().startOf('month')
      const currentMonthEnd = dayjs().endOf('month')
      return { curentMonthStart, currentMonthEnd }
    }
    const curentMonthStart = dayjs().subtract(1, 'month').date(11)
    const currentMonthEnd = dayjs().date(10)
    return { curentMonthStart, currentMonthEnd }
  }, [mode])

  const monthDays = useMemo(() => {
    const days = currentMonthEnd.diff(curentMonthStart, 'day') + 1
    return [...Array(days)].map((_, i) => {
      return curentMonthStart.add(i, 'day').format('YYYY-MM-DD')
    })
  }, [curentMonthStart, currentMonthEnd])

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

  const sumWorkingTime = useCallback(
    (
      dayAttendances: GetAttendanceQuery['attendance'],
      dayRests: GetAttendanceQuery['rest']
    ) => {
      if (!dayAttendances) return 0
      const totalAttendance = dayAttendances
        .filter((attendance) => !!attendance.end_time)
        .map((attendance) => {
          const start = dayjs(attendance.start_time)
          const end = dayjs(attendance.end_time)
          return end.diff(start)
        })
        .reduce((acc, cur) => acc + cur, 0)

      const totalRest = dayRests
        .filter((rest) => !!rest.end_rest)
        .map((rest) => {
          const start = dayjs(rest.start_rest)
          const end = dayjs(rest.end_rest)
          return end.diff(start)
        })
        .reduce((a, b) => a + b, 0)

      return totalAttendance - totalRest
    },
    []
  )

  const attendance: AttendanceTable[] = useMemo(
    () =>
      monthDays.map((day, i) => {
        const dayAttendances =
          data?.attendance.filter(
            (attendance) =>
              dayjs.tz(attendance.start_time).format('YYYY-MM-DD') ===
              dayjs.tz(day).format('YYYY-MM-DD')
          ) || []

        const dayRests =
          data?.rest.filter(
            (rest) =>
              dayjs.tz(rest.start_rest).format('YYYY-MM-DD') ===
              dayjs.tz(day).format('YYYY-MM-DD')
          ) || []

        if (!dayAttendances) {
          return {
            id: i,
            date: dayjs.tz(day).format('YYYY-MM-DD'),
            start_times: [],
            end_times: [],
            start_rests: [],
            end_rests: [],
            total_time: 0,
          }
        }

        return {
          id: i,
          date: dayjs.tz(day).format('YYYY-MM-DD'),
          start_times: dayAttendances.map((dayAttendance) =>
            dayjs.tz(dayAttendance.start_time).format('HH:mm')
          ),
          end_times: dayAttendances.map((dayAttendance) =>
            dayAttendance?.end_time
              ? dayjs.tz(dayAttendance.end_time).format('HH:mm')
              : ''
          ),
          start_rests: dayRests.map((dayRest) =>
            dayRest?.start_rest
              ? dayjs.tz(dayRest.start_rest).format('HH:mm')
              : ''
          ),
          end_rests: dayRests.map((dayRest) =>
            dayRest?.end_rest ? dayjs.tz(dayRest.end_rest).format('HH:mm') : ''
          ),
          total_time: sumWorkingTime(dayAttendances, dayRests),
        }
      }),
    [data?.attendance, data?.rest, monthDays, sumWorkingTime]
  )

  const handleOpenModal = useCallback(
    (date: string) => {
      setSelectedDate(date)
      onOpen()
    },
    [setSelectedDate, onOpen]
  )

  const handleCloseModal = useCallback(() => {
    setSelectedDate('')
    onClose()
  }, [setSelectedDate, onClose])

  if (!isAuthenticated)
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

  return (
    <Box px='4'>
      <Header />
      <Flex justifyContent='space-between' py='2'>
        <Text fontSize='lg'>{curentMonthStart.get('month') + 1}月の勤怠</Text>
        <Box>
          <Select
            onChange={(e) => {
              switch (e.target.value) {
                case 'monthly':
                case 'paid_date':
                  setMode(e.target.value)
                  break
                default:
                  setMode('monthly')
                  break
              }
            }}
          >
            <option value='monthly'>月基準</option>
            <option value='paid_date'>給与基準</option>
          </Select>
        </Box>
      </Flex>
      {fetching || !data ? (
        <VStack align='stretch' spacing={2}>
          <Skeleton h='10' />
          {[...Array(30)].map((_, i) => (
            <Skeleton key={i} h='12' />
          ))}
        </VStack>
      ) : (
        <>
          <TableContainer
            position='relative'
            h='calc(100dvh - 110px)'
            overflowY='scroll'
          >
            <Table size='md'>
              <Thead
                position='sticky'
                top='0'
                bgColor='gray.200'
                boxShadow='md'
              >
                <Tr>
                  <Th>日付</Th>
                  <Th>出勤</Th>
                  <Th>退勤</Th>
                  <Th>休憩</Th>
                  <Th>戻り</Th>
                  <Th>合計</Th>
                </Tr>
              </Thead>
              <Tbody>
                {attendance.map((day) => (
                  <Tr
                    key={day.id}
                    // aタグやめたい
                    as='a'
                    display='table-row'
                    cursor='pointer'
                    _hover={{ bgColor: 'gray.50' }}
                    _active={{ bgColor: 'gray.100' }}
                    onClick={() => handleOpenModal(day.date)}
                  >
                    <Th py='5'>{day.date}</Th>
                    <Th py='5'>
                      {day.start_times.map((start_time) => (
                        <Text key={start_time}>{start_time}</Text>
                      ))}
                    </Th>
                    <Th py='5'>
                      {day.end_times.map((end_time) => (
                        <Text key={end_time}>{end_time}</Text>
                      ))}
                    </Th>
                    <Th py='5'>
                      {day.start_rests.map((start_rest) => (
                        <Text key={start_rest}>{start_rest}</Text>
                      ))}
                    </Th>
                    <Th py='5'>
                      {day.end_rests.map((end_rest) => (
                        <Text key={end_rest}>{end_rest}</Text>
                      ))}
                    </Th>
                    <Th py='5'>
                      {day.total_time !== 0 &&
                        formatTotalWorkingTime(day.total_time)}
                    </Th>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          {isOpen && (
            <UpdateAttendanceModal
              attendanceDate={selectedDate}
              onClose={handleCloseModal}
            />
          )}
        </>
      )}
    </Box>
  )
}
