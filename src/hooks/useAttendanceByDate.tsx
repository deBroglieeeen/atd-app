import { dayjs } from '../lib/dayjs'
import { useQuery } from 'urql'
import {
  GetAttendanceByDateQuery,
  GetAttendanceByDateQueryVariables,
} from '../generated/graphql'
import { getAttendanceByDateQuery } from '../graphql/attendance'

export const useAttendanceByDateQuery = (date: string) => {
  const start_date = dayjs(date).format('YYYY-MM-DD')
  const end_date = dayjs(date).add(1, 'day').format('YYYY-MM-DD')

  const [{ data, fetching }] = useQuery<
    GetAttendanceByDateQuery,
    GetAttendanceByDateQueryVariables
  >({
    query: getAttendanceByDateQuery,
    variables: {
      start: start_date,
      end: end_date,
    },
  })

  return {
    data,
    fetching,
  }
}
