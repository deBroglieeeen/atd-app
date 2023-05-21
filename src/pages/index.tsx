import { useAuth0 } from '@auth0/auth0-react'
import { Box } from '@chakra-ui/react'
import type { NextPage } from 'next'
import { Login } from '@/components/Login'
import { TopPage } from '@/components/TopPage'

const Home: NextPage = () => {
  const { isAuthenticated } = useAuth0()

  return <Box>{isAuthenticated ? <TopPage /> : <Login />}</Box>
}

export default Home
