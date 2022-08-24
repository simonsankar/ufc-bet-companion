import type { NextPage } from 'next'
import { Box, Flex, Heading } from '@chakra-ui/react'
import { NavBar } from '../components/navbar'
import { getMainCard, MainCard } from '../scraper'
import { upsertCurrentEvent } from '../scraper/hydrate'

const Home: NextPage<MainCard> = (props) => {
  return (
    <Flex height="100vh" flexDir="column">
      <NavBar />
      <Box padding={4}>
        <Heading textTransform="uppercase">{props.title}</Heading>
        <pre>{JSON.stringify(props, null, 2)}</pre>
      </Box>
    </Flex>
  )
}

export default Home

export const getServerSideProps = async () => {
  const mainCard = await upsertCurrentEvent()

  return {
    props: mainCard,
  }
}
