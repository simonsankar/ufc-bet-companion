import { load } from 'cheerio'

export type Fight = {
  id: string
  bout: string
  redCorner: {
    firstName: string
    lastName: string
    rank: string
    odds: number
    outcome: string
  }
  blueCorner: {
    firstName: string
    lastName: string
    rank: string
    odds: number
    outcome: string
  }
}

export type MainCard = {
  id: string
  title: string
  timestamp: number
  fights: Fight[]
}

export const getMainCard = async (): Promise<MainCard> => {
  const resp = await fetch('https://www.ufc.com/events')
  const html = await resp.text()
  const $ = load(html)

  const nextEvent = $('.c-hero__actions')
  const nextEventLink = nextEvent.find('a').first().attr()?.['href']
  if (!nextEventLink) {
    throw new Error('No next event link found')
  }

  const id = nextEventLink.replace('https://www.ufc.com/event/', '')
  const eventResp = await fetch(nextEventLink)
  // const eventResp = await fetch('https://www.ufc.com/event/ufc-276')
  const eventHtml = await eventResp.text()
  const $event = load(eventHtml)

  const title = $event('div.c-hero__headline-prefix').first().text().trim()
  const timestamp = parseInt(
    $event('div.c-hero__headline-suffix.tz-change-inner').first().attr()?.[
      'data-timestamp'
    ] || '0'
  )

  const mainCard = $event('ul.l-listing__group--bordered').first()
  const mainCardList: Fight[] = mainCard
    .find('li.l-listing__item')
    .map((i, el) => {
      const content = $event(el).find('.c-listing-fight__content').first()
      // Red corner
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
      const redCornerOdds: number = parseInt(
        content.find('span.c-listing-fight__odds-amount').first().text().trim()
      )
      const redOutcome: string = content
        .find(
          '.c-listing-fight__corner-body--red >.c-listing-fight__outcome-wrapper'
        )
        .first()
        .text()
        .trim()

      // Red corner
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
      const blueCornerOdds: number = parseInt(
        content.find('span.c-listing-fight__odds-amount').last().text().trim()
      )
      const blueOutcome: string = content
        .find(
          '.c-listing-fight__corner-body--blue >.c-listing-fight__outcome-wrapper'
        )
        .first()
        .text()
        .trim()

      const bout: string = content
        .find('.c-listing-fight__class-text')
        .text()
        .trim()

      return {
        id:
          redCornerLastName.toLowerCase() +
          '-' +
          blueCornerLastName.toLowerCase(),
        bout,
        redCorner: {
          firstName: redCornerFirstName,
          lastName: redCornerLastName,
          rank: redCornerRank,
          odds: redCornerOdds,
          outcome: redOutcome,
        },
        blueCorner: {
          firstName: blueCornerFirstName,
          lastName: blueCornerLastName,
          rank: blueCornerRank,
          odds: blueCornerOdds,
          outcome: blueOutcome,
        },
      }
    })
    .get()

  return {
    id,
    title,
    timestamp,
    fights: mainCardList,
  }
}
