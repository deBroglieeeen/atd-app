import { useAuth0 } from '@auth0/auth0-react'
import {
  AddRestinMutation,
  AddRestinMutationVariables,
  UpdateUserStateMutation,
  UpdateUserStateMutationVariables,
} from '../generated/graphql'
import { addRestinMutation } from '../graphql/rest'

import { updateUserStateMutation } from '../graphql/userState'
import { useMutation } from 'urql'
import { Button, ButtonProps, useToast } from '@chakra-ui/react'
import { useTimer } from './Clock/useTimer'
import useSlackNotify from './SlackNotify'
import { useCallback } from 'react'

type Props = ButtonProps & {
  user_id: string
}

const RestInButton = ({ user_id, ...props }: Props) => {
  const restInTime = useTimer().format('YYYY-MM-DD HH:mm:ss')

  const [addRestInResult, addRestIn] = useMutation<
    AddRestinMutation,
    AddRestinMutationVariables
  >(addRestinMutation)
  const [updateUserStateResult, updateUserState] = useMutation<
    UpdateUserStateMutation,
    UpdateUserStateMutationVariables
  >(updateUserStateMutation)
  const { loginWithRedirect, user } = useAuth0()
  const toast = useToast()
  const slackNotify = useSlackNotify()

  const clickRestIn = useCallback(async () => {
    if (!user) {
      loginWithRedirect()
      return
    }
    try {
      const addRestInResult = await addRestIn({
        startRest: restInTime,
      })
      slackNotify({
        user_name: `${user.name}`,
        time: `${restInTime}`,
        status: 'start_rest',
      })
      if (addRestInResult.error) {
        throw new Error(addRestInResult.error.message)
      }
      const updateUserStateResult = await updateUserState({
        user_state: 'rest',
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
      description: '休憩打刻しました。',
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'top',
    })
  }, [
    addRestIn,
    restInTime,
    loginWithRedirect,
    slackNotify,
    toast,
    updateUserState,
    user,
    user_id,
  ])
  return (
    <Button onClick={clickRestIn} {...props}>
      休憩
    </Button>
  )
}
export { RestInButton }
