import type { NextPage } from 'next'
import { Box, Flex, Heading } from '@chakra-ui/react'
import { NavBar } from '../components/navbar'

const Home: NextPage = () => {
  return (
    <Flex height="100vh" flexDir="column">
      <NavBar />
      <Box>
        <Heading textTransform="uppercase">Cruz vs Moreno</Heading>
        <div>Something really cool is going to happen here.</div>
      </Box>
    </Flex>
  )
}

export default Home
