import {
  Box,
  Button,
  FormControl,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAttendanceByDateQuery } from '../hooks/useAttendanceByDate'
import { useCallback } from 'react'

type UpdateAttendanceForm = {
  starts: Date[]
  ends: Date[]
  rest_starts: Date[]
  rest_ends: Date[]
}
const UpdateAttendanceSchema = z.object({
  starts: z.array(z.date()),
  ends: z.array(z.date()),
  rest_starts: z.array(z.date()),
  rest_ends: z.array(z.date()),
})

type Props = {
  attendanceDate: string
  onClose: () => void
}
export const UpdateAttendanceModal = ({ attendanceDate, onClose }: Props) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isValid, isSubmitting },
  } = useForm<UpdateAttendanceForm>({
    resolver: zodResolver(UpdateAttendanceSchema),
  })

  const onSubmit = useCallback((data: UpdateAttendanceForm) => {}, [])

  // 初期値取得
  const { data, fetching } = useAttendanceByDateQuery(attendanceDate)
  if (!data || fetching) return <Box>Loading...</Box>

  return (
    <Modal isOpen onClose={onClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>勤怠の編集</ModalHeader>
        <ModalCloseButton type='button' isDisabled={isSubmitting} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            {/* 各項目をuseFieldsArrayでレンダリング？？ */}
            <FormControl>
              <input {...register('starts')} />
            </FormControl>
            <FormControl>
              <input {...register('ends')} />
            </FormControl>
            <FormControl>
              <input {...register('rest_starts')} />
            </FormControl>
            <FormControl>
              <input {...register('rest_ends')} />
            </FormControl>
          </ModalBody>
          <ModalFooter
            gap='5'
            justifyContent='center'
            borderTop='1px solid'
            borderTopColor='gray.100'
          >
            <Button type='button' isDisabled={isSubmitting} onClick={onClose}>
              キャンセル
            </Button>
            <Button colorScheme='blue' type='submit' isDisabled={!isValid}>
              更新
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
