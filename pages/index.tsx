import type { NextPage } from 'next'
import { load } from 'cheerio'
import { Box, Flex, Heading } from '@chakra-ui/react'
import { NavBar } from '../components/navbar'

type HomeProps = {
  eventName: string
  eventTimeStamp: string
}
const Home: NextPage<HomeProps> = (props) => {
  return (
    <Flex height="100vh" flexDir="column">
      <NavBar />
      <Box padding={4}>
        <Heading textTransform="uppercase">{props.eventName}</Heading>
        <pre>{JSON.stringify(props, null, 2)}</pre>
      </Box>
    </Flex>
  )
}

export default Home

export const getServerSideProps = async () => {
  const resp = await fetch('https://www.ufc.com/events')
  const html = await resp.text()
  const $ = load(html)

  const nextEvent = $('.c-hero__actions')
  const nextEventLink = nextEvent.find('a').first().attr()?.['href']
  if (!nextEventLink) {
    throw new Error('No next event link found')
  }

  const eventResp = await fetch(nextEventLink)
  // const eventResp = await fetch('https://www.ufc.com/event/ufc-276')
  const eventHtml = await eventResp.text()
  const $event = load(eventHtml)

  const eventName = $event('div.c-hero__headline-prefix').first().text().trim()
  const eventTimeStamp = $event('div.c-hero__headline-suffix.tz-change-inner')
    .first()
    .attr()?.['data-timestamp']

  const mainCard = $event('ul.l-listing__group--bordered').first()
  const mainCardList = mainCard
    .find('li.l-listing__item')
    .map((i, el) => {
      const content = $event(el).find('.c-listing-fight__content').first()
      const redCornerRank: string = content
        .find(
          '.js-listing-fight__corner-rank.c-listing-fight__corner-rank > span'
        )
        .first()
        .text()
        .trim()
      const redCornerFirstName: string = content
        .find('.c-listing-fight__corner-given-name')
        .first()
        .text()
        .trim()
      const redCornerLastName: string = content
        .find('.c-listing-fight__corner-family-name')
        .first()
        .text()
        .trim()
      const redCornerOdds: string = content
        .find('span.c-listing-fight__odds-amount')
        .first()
        .text()
        .trim()

      const blueCornerRank: string = content
        .find(
          '.js-listing-fight__corner-rank.c-listing-fight__corner-rank > span'
        )
        .last()
        .text()
        .trim()
      const blueCornerFirstName: string = content
        .find('.c-listing-fight__corner-given-name')
        .last()
        .text()
        .trim()
      const blueCornerLastName: string = content
        .find('.c-listing-fight__corner-family-name')
        .last()
        .text()
        .trim()
      const blueCornerOdds: string = content
        .find('span.c-listing-fight__odds-amount')
        .next()
        .next()
        .text()
        .trim()

      const bout = content.find('.c-listing-fight__class').text().trim()
      return {
        redCorner: {
          firstName: redCornerFirstName,
          lastName: redCornerLastName,
          rank: redCornerRank,
          odds: redCornerOdds,
        },
        blueCorner: {
          firstName: blueCornerFirstName,
          lastName: blueCornerLastName,
          rank: blueCornerRank,
          odds: blueCornerOdds,
        },
        bout,
      }
    })
    .get()

  return {
    props: {
      eventName,
      eventTimeStamp,
      fights: mainCardList,
    },
  }
}
