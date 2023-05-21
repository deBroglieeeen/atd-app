import dayjs from 'dayjs'
import { Text } from '@chakra-ui/react'
import { useTimer } from '@/hooks/useTimer'

const DigitalClock = () => {
  const time = useTimer()
  return <Text fontSize='3xl'>{dayjs(time).format('HH : mm : ss')}</Text>
}

export { DigitalClock }
