import dayjs from 'dayjs'
import { useMemo } from 'react'

export const useGetPaidDateSpan = ({
  targetMonth,
}: {
  targetMonth: number
}) => {
  const startDate = useMemo(() => {
    return dayjs()
      .month(targetMonth - 1)
      .startOf('month')
      .format('YYYY-MM-11')
  }, [targetMonth])
  const endDate = useMemo(() => {
    return dayjs().month(targetMonth).endOf('month').format('YYYY-MM-10')
  }, [targetMonth])

  return { startDate, endDate }
}
