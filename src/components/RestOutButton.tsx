import { useAuth0 } from '@auth0/auth0-react'
import {
  UpdateRestoutMutation,
  UpdateRestoutMutationVariables,
  UpdateUserStateMutation,
  UpdateUserStateMutationVariables,
} from '@/generated/graphql'
import { updateRestoutMutation } from '@/graphql/rest'
import { updateUserStateMutation } from '@/graphql/userState'
import { useMutation } from 'urql'
import { Button, ButtonProps, useToast } from '@chakra-ui/react'
import { useTimer } from '@/hooks/useTimer'
import useSlackNotify from './SlackNotify'
import { useCallback } from 'react'

type Props = ButtonProps & {
  restId: string
  user_id: string
}

const RestOutButton = ({ restId, user_id, ...props }: Props) => {
  const restOutTime = useTimer().format('YYYY-MM-DD HH:mm')
  const updateRestOut = useMutation<
    UpdateRestoutMutation,
    UpdateRestoutMutationVariables
  >(updateRestoutMutation)[1]
  const updateUserState = useMutation<
    UpdateUserStateMutation,
    UpdateUserStateMutationVariables
  >(updateUserStateMutation)[1]
  const { loginWithRedirect, user } = useAuth0()
  const toast = useToast()
  const slackNotify = useSlackNotify()

  const clickRestOut = useCallback(async () => {
    if (!user) {
      loginWithRedirect()
      return
    }
    try {
      const updateRestOutResult = await updateRestOut({
        endRest: restOutTime,
        restId: restId,
      })
      slackNotify({
        user_name: `${user.name}`,
        time: `${restOutTime}`,
        status: 'end_rest',
      })
      if (updateRestOutResult.error) {
        throw new Error(updateRestOutResult.error.message)
      }
      const updateUserStateResult = await updateUserState({
        user_state: 'on',
        user_id: user_id,
      })
      if (updateUserStateResult.error) {
        throw new Error(updateUserStateResult.error.message)
      }
    } catch (error) {
      console.error(error)
      toast({
        description: 'エラーが発生しました',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      })
      return
    }
    toast({
      description: '戻り打刻しました。',
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'top',
    })
  }, [
    restOutTime,
    loginWithRedirect,
    restId,
    slackNotify,
    toast,
    updateRestOut,
    updateUserState,
    user,
    user_id,
  ])
  return (
    <Button onClick={clickRestOut} {...props}>
      戻り
    </Button>
  )
}

export { RestOutButton }
