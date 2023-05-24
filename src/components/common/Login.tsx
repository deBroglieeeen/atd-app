import { useAuth0 } from '@auth0/auth0-react'
import { Button, Flex, Text } from '@chakra-ui/react'

const Login = () => {
  const { loginWithRedirect } = useAuth0()

  return (
    <Flex justifyContent='center' flexDir='column' alignItems='center'>
      <Text>お疲れ様です！</Text>
      <Text>ログインしてから打刻してください _(._.)_</Text>
      <Button onClick={loginWithRedirect}>Log in</Button>
    </Flex>
  )
}

export { Login }
