import { useAuth0 } from '@auth0/auth0-react'
import { Button, Flex, Heading, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export const HEADER_HEIGHT = '82px'

export const Header = () => {
  const { logout } = useAuth0()
  return (
    <Flex
      pb='4'
      justifyContent='space-between'
      alignItems='center'
      h={HEADER_HEIGHT}
    >
      <Flex gap='4' alignItems='center'>
        <Heading>
          <Link href='/'>atd app</Link>
        </Heading>
        <HeaderNavi />
      </Flex>
      <Button
        onClick={() => {
          logout({ returnTo: window.location.origin })
        }}
      >
        Log out
      </Button>
    </Flex>
  )
}

const HeaderNavi = () => {
  const router = useRouter()

  return (
    <Flex>
      <Link href='/'>
        <Text
          px='4'
          py='5'
          _hover={{
            bgColor: 'gray.100',
          }}
          borderBottom={router.pathname === '/' ? '2px' : '0px'}
          borderColor='blue.100'
        >
          Home
        </Text>
      </Link>
      <Link href='/attendance'>
        <Text
          px='4'
          py='5'
          _hover={{
            bgColor: 'gray.100',
          }}
          borderBottom={router.pathname === '/attendance' ? '2px' : '0px'}
          borderColor='blue.100'
        >
          勤務表
        </Text>
      </Link>
    </Flex>
  )
}
