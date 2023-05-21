import { useCallback } from 'react'
import { dayjs } from '@/lib/dayjs'

export const useFormatTotalWorkingTime = () => {
  const formatTotalWorkingTime = useCallback((workingTime: number) => {
    const HOUR = 24
    const totalHours =
      dayjs.duration(workingTime).days() * HOUR +
      dayjs.duration(workingTime).hours()
    return `${totalHours}時間${dayjs.duration(workingTime).minutes()}分`
  }, [])
  return formatTotalWorkingTime
}
