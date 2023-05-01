import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAttendanceByDateQuery } from '../hooks/useAttendanceByDate'
import { useCallback, useMemo } from 'react'
import { dayjs } from '../lib/dayjs'
import { useMutation } from 'urql'
import {
  UpdateAttendanceMutation,
  UpdateAttendanceMutationVariables,
  UpdateRestMutation,
  UpdateRestMutationVariables,
} from '../generated/graphql'
import { updateAttendanceMutation } from '../graphql/attendance'
import { updateRestMutation } from '../graphql/rest'

const updateAttendanceSchema = z.object({
  attendances: z.array(
    z.object({
      id: z.string(),
      date: z.string().nullable(),
      start_time: z
        .string()
        .regex(/^([01][0-9]|2[0-3]):[0-5][0-9]$/, {
          message: '形式が正しくありません',
        })
        .nullable(),
      end_time: z
        .string()
        .regex(/^([01][0-9]|2[0-3]):[0-5][0-9]$/, {
          message: '形式が正しくありません',
        })
        .nullable(),
    })
  ),
  rests: z.array(
    z.object({
      id: z.string(),
      date: z.string().nullable(),
      start_rest: z
        .string()
        .regex(/^([01][0-9]|2[0-3]):[0-5][0-9]$/, {
          message: '形式が正しくありません',
        })
        .nullable(),
      end_rest: z
        .string()
        .regex(/^([01][0-9]|2[0-3]):[0-5][0-9]$/, {
          message: '形式が正しくありません',
        })
        .nullable(),
    })
  ),
})
type UpdateAttendanceSchema = z.infer<typeof updateAttendanceSchema>

type Props = {
  attendanceDate: string
  onClose: () => void
}
export const UpdateAttendanceModal = ({ attendanceDate, onClose }: Props) => {
  const { data, fetching } = useAttendanceByDateQuery(attendanceDate)

  const defaulatValues: UpdateAttendanceSchema = useMemo(() => {
    if (!data)
      return {
        attendances: [],
        rests: [],
      }

    return {
      attendances: data.attendance?.map((data) => ({
        id: data.id,
        date: data?.start_time
          ? dayjs.tz(data.start_time).format('YYYY-MM-DD')
          : null,
        start_time: data?.start_time
          ? dayjs.tz(data.start_time).format('HH:mm')
          : null,
        end_time: data?.end_time
          ? dayjs.tz(data.end_time).format('HH:mm')
          : null,
      })),
      rests: data.rest?.map((data) => ({
        id: data?.id,
        date: data?.start_rest
          ? dayjs.tz(data.start_rest).format('YYYY-MM-DD')
          : null,
        start_rest: data?.start_rest
          ? dayjs.tz(data.start_rest).format('HH:mm')
          : null,
        end_rest: data?.end_rest
          ? dayjs.tz(data.end_rest).format('HH:mm')
          : null,
      })),
    }
  }, [data])

  return (
    <Modal isOpen onClose={onClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>勤怠の編集</ModalHeader>
        {fetching ? (
          <ModalBody>
            <Spinner />
          </ModalBody>
        ) : (
          <UpdateAttendanceModalForm
            defaultValues={defaulatValues}
            onClose={onClose}
          />
        )}
      </ModalContent>
    </Modal>
  )
}

const UpdateAttendanceModalForm = ({
  defaultValues,
  onClose,
}: {
  defaultValues: UpdateAttendanceSchema
  onClose: () => void
}) => {
  const toast = useToast({ position: 'top' })
  const [attendanceResult, updateAttendance] = useMutation<
    UpdateAttendanceMutation,
    UpdateAttendanceMutationVariables
  >(updateAttendanceMutation)
  const [restResult, updateRest] = useMutation<
    UpdateRestMutation,
    UpdateRestMutationVariables
  >(updateRestMutation)
  const {
    handleSubmit,
    control,
    register,
    formState: { isValid, isSubmitting },
  } = useForm<UpdateAttendanceSchema>({
    mode: 'onChange',
    resolver: zodResolver(updateAttendanceSchema),
    defaultValues: defaultValues,
  })

  const { fields: attendanceFields } = useFieldArray<UpdateAttendanceSchema>({
    control,
    name: 'attendances',
  })
  const { fields: restFields } = useFieldArray<UpdateAttendanceSchema>({
    control,
    name: 'rests',
  })

  const onSubmit = useCallback(
    async (data: UpdateAttendanceSchema) => {
      // Memo: hasura + graphqlCodegenを使って動的なObjectに対して、bulk updateができなかったため
      //       一旦、一つずつupdateする形をpromise allで実装
      await Promise.all([
        data.attendances
          .filter((attendance) => attendance.date)
          .map((attendance) => {
            updateAttendance({
              id: attendance.id,
              startTime: attendance.start_time
                ? dayjs
                    .tz(attendance.date)
                    .hour(parseInt(attendance.start_time.split(':')[0], 10))
                    .minute(parseInt(attendance.start_time.split(':')[1], 10))
                    .format('YYYY-MM-DD HH:mm:ss')
                : null,
              endTime: attendance.end_time
                ? dayjs
                    .tz(attendance.date)
                    .hour(parseInt(attendance.end_time.split(':')[0], 10))
                    .minute(parseInt(attendance.end_time.split(':')[1], 10))
                    .format('YYYY-MM-DD HH:mm:ss')
                : null,
            })
          }),
        data.rests
          .filter((rest) => rest.date)
          .map((rest) => {
            updateRest({
              id: rest.id,
              startRest: rest.start_rest
                ? dayjs
                    .tz(rest.date)
                    .hour(parseInt(rest.start_rest.split(':')[0], 10))
                    .minute(parseInt(rest.start_rest.split(':')[1], 10))
                    .format('YYYY-MM-DD HH:mm:ss')
                : null,
              endRest: rest.end_rest
                ? dayjs
                    .tz(rest.date)
                    .hour(parseInt(rest.end_rest.split(':')[0], 10))
                    .minute(parseInt(rest.end_rest.split(':')[1], 10))
                    .format('YYYY-MM-DD HH:mm:ss')
                : null,
            })
          }),
      ])
        .then(() => {
          toast({
            title: '勤怠を更新しました',
            status: 'success',
          })
          onClose()
        })
        .catch(() => {
          toast({
            title: '勤怠を更新できませんでした',
            status: 'error',
          })
        })
        .finally(() => {
          return
        })
    },
    [onClose, toast, updateAttendance, updateRest]
  )
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ModalBody>
        <VStack align='stretch' spacing='5' pt='2' pb='4'>
          {/* Todo: html構造変えてerror表示することやUIを見やすくする */}
          <Flex>
            <FormControl>
              <FormLabel>出勤</FormLabel>
              {attendanceFields.map((field, index) => (
                <Box key={field.id}>
                  <input {...register(`attendances.${index}.start_time`)} />
                </Box>
              ))}
            </FormControl>
            <FormControl>
              <FormLabel>退勤</FormLabel>
              {attendanceFields.map((field, index) => (
                <Box key={field.id}>
                  <input {...register(`attendances.${index}.end_time`)} />
                </Box>
              ))}
            </FormControl>
          </Flex>
          <Flex>
            <FormControl>
              <FormLabel>休憩</FormLabel>
              {restFields.map((field, index) => (
                <Box key={field.id}>
                  <input {...register(`rests.${index}.start_rest`)} />
                </Box>
              ))}
            </FormControl>
            <FormControl>
              <FormLabel>戻り</FormLabel>
              {restFields.map((field, index) => (
                <Box key={field.id}>
                  <input {...register(`rests.${index}.end_rest`)} />
                </Box>
              ))}
            </FormControl>
          </Flex>
        </VStack>
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
  )
}
