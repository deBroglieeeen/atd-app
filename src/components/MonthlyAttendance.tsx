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
  useDisclosure,
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

export const MonthlyAttenadnce = () => {
  const { isAuthenticated } = useAuth0()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedDate, setSelectedDate] = useState('')
  const curentMonthStart = dayjs().startOf('month')
  const currentMonthEnd = dayjs().endOf('month')
  const monthDays = useMemo(() => {
    const days = currentMonthEnd.diff(curentMonthStart, 'day') + 1
    return [...Array(days)].map((_, i) => {
      return dayjs().date(i + 1)
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

  const attendance = useMemo(
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
            start_times: [''],
            end_times: [''],
            start_rests: [''],
            end_rests: [''],
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
        }
      }),
    [data, monthDays]
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

  return (
    <Box px='4'>
      <Header />
      <Text fontSize='lg'>{curentMonthStart.get('month') + 1}月の勤怠</Text>
      <TableContainer
        position='relative'
        h='calc(100dvh - 110px)'
        overflowY='scroll'
      >
        <Table size='md'>
          <Thead position='sticky' top='0' bgColor='gray.200' boxShadow='md'>
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
    </Box>
  )
}
