import { useAuth0 } from '@auth0/auth0-react'
import { Button, Text } from '@chakra-ui/react'

const Login = () => {
  const { loginWithRedirect } = useAuth0()

  return (
    <>
      <Text>お疲れ様です！</Text>
      <Text>ログインしてから打刻してください _(._.)_</Text>
      <Button onClick={loginWithRedirect}>Log in</Button>
    </>
  )
}

export { Login }
