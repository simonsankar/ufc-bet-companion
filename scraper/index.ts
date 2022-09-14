import { load } from 'cheerio'

export type Fight = {
  id: string
  bout: string
  order: number
  redCorner: {
    firstName: string
    lastName: string
    rank: string
    odds: number
    outcome: string
    country: string
    flag: string
    photo: string
  }
  blueCorner: {
    firstName: string
    lastName: string
    rank: string
    odds: number
    outcome: string
    country: string
    flag: string
    photo: string
  }
}

export type MainCard = {
  id: string
  title: string
  poster: string
  timestamp: number
  fights: Fight[]
}

export const getMainCard = async (eventId?: string): Promise<MainCard> => {
  const resp = await fetch('https://www.ufc.com/events')
  const html = await resp.text()
  const $ = load(html)

  let id = eventId

  // Try and get the latest PPV event id
  if (!id) {
    const nextEvent = $('.c-hero__actions')
    const nextEventLink = nextEvent.find('a').first().attr()?.['href']
    if (!nextEventLink) {
      throw new Error('No next event link found')
    }
    id = nextEventLink.replace('https://www.ufc.com/event/', '')
  }

  const eventResp = await fetch(`https://www.ufc.com/event/${id}`)
  const eventHtml = await eventResp.text()
  const $event = load(eventHtml)

  const title = $event('div.c-hero__headline-prefix').first().text().trim()
  const posters = $event(
    '#block-mainpagecontent > div > div.c-hero > div > div > div > picture > source:nth-child(1)'
  ).attr('srcset')
  const poster = posters ? posters.substring(0, posters.indexOf(' ')) : ''
  const timestamp = parseInt(
    $event('div.c-hero__headline-suffix.tz-change-inner').first().attr()?.[
      'data-timestamp'
    ] || '0'
  )

  const mainCard = $event('ul.l-listing__group--bordered').first()
  const mainCardList: Fight[] = mainCard
    .find('li.l-listing__item')
    .map((idx, el) => {
      const content = $event(el).find('.c-listing-fight__content').first()
      // Red corner
      const redContent = content
        .find('.c-listing-fight__corner-name.c-listing-fight__corner-name--red')
        .first()

      const redCornerRank: string = $(el)
        .find('div.c-listing-fight__ranks-row > div:nth-child(1) > span')
        .first()
        .text()
        .trim()

      const redCornerName: string = redContent.text().trim()
      const redCornerFirstName: string = redContent
        .find('.c-listing-fight__corner-given-name')
        .first()
        .text()
        .trim()
      const redCornerLastName: string = redContent
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

      const redCountry: string = content
        .find(
          'div.c-listing-fight__odds-row > div.c-listing-fight__country.c-listing-fight__country--red > div'
        )
        .first()
        .text()
        .trim()
      const redFlag: string =
        content
          .find(
            'div.c-listing-fight__odds-row > div.c-listing-fight__country.c-listing-fight__country--red > img'
          )
          .first()
          .attr('src')
          ?.replace('/themes/custom/ufc/assets/img/flags/', '') || ''

      const redPhoto: string =
        $(content)
          .find('.c-listing-fight__corner-image--red')
          .find('.image-style-event-fight-card-upper-body-of-standing-athlete')
          .first()
          .attr('src') ||
        'https://www.ufc.com/themes/custom/ufc/assets/img/standing-stance-right-silhouette.png'

      // Blue corner
      const blueContent = content
        .find(
          '.c-listing-fight__corner-name.c-listing-fight__corner-name--blue'
        )
        .first()

      const blueCornerRank: string = $(el)
        .find('div.c-listing-fight__ranks-row > div:nth-child(2) > span')
        .last()
        .text()
        .trim()

      const blueCornerName: string = blueContent.text().trim()
      const blueCornerFirstName: string = blueContent
        .find('.c-listing-fight__corner-given-name')
        .first()
        .text()
        .trim()
      const blueCornerLastName: string = blueContent
        .find('.c-listing-fight__corner-family-name')
        .first()
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

      const blueCountry: string = content
        .find(
          'div.c-listing-fight__odds-row > div.c-listing-fight__country.c-listing-fight__country--blue > div'
        )
        .first()
        .text()
        .trim()
      const blueFlag: string =
        content
          .find(
            'div.c-listing-fight__odds-row > div.c-listing-fight__country.c-listing-fight__country--blue > img'
          )
          .first()
          .attr('src')
          ?.replace('/themes/custom/ufc/assets/img/flags/', '') || ''

      const bluePhoto: string =
        $(content)
          .find('.c-listing-fight__corner-image--blue')
          .find('.image-style-event-fight-card-upper-body-of-standing-athlete')
          .last()
          .attr('src') ||
        'https://www.ufc.com/themes/custom/ufc/assets/img/standing-stance-left-silhouette.png'

      const bout: string = content
        .find('.c-listing-fight__class-text')
        .first()
        .text()
        .trim()

      let redSplitFirstName = ''
      let redSplitLastName = ''
      let blueSplitFirstName = ''
      let blueSplitLastName = ''

      if (redCornerName) {
        const redSplit = redCornerName.split(' ')
        redSplitFirstName = redSplit[0]
        redSplitLastName = redSplit[redSplit.length - 1]
      }
      if (blueCornerName) {
        const blueSplit = blueCornerName.split(' ')
        blueSplitFirstName = blueSplit[0]
        blueSplitLastName = blueSplit[blueSplit.length - 1]
      }

      const redFinalFirstName = !redCornerFirstName
        ? redSplitFirstName
        : redCornerFirstName
      const redFinalLastName = !redCornerLastName
        ? redSplitLastName
        : redCornerLastName

      const blueFinalFirstName = !blueCornerFirstName
        ? blueSplitFirstName
        : blueCornerFirstName
      const blueFinalLastName = !blueCornerLastName
        ? blueSplitLastName
        : blueCornerLastName

      const fight: Fight = {
        id:
          redFinalLastName.toLowerCase() +
          '-' +
          blueFinalLastName.toLowerCase(),
        bout,
        order: idx + 1,
        redCorner: {
          firstName: redFinalFirstName,
          lastName: redFinalLastName,
          rank: redCornerRank,
          odds: isNaN(redCornerOdds) ? 0 : redCornerOdds,
          outcome: redOutcome,
          country: redCountry,
          flag: redFlag,
          photo: redPhoto,
        },
        blueCorner: {
          firstName: blueFinalFirstName,
          lastName: blueFinalLastName,
          rank: blueCornerRank,
          odds: isNaN(blueCornerOdds) ? 0 : blueCornerOdds,
          outcome: blueOutcome,
          country: blueCountry,
          flag: blueFlag,
          photo: bluePhoto,
        },
      }
      return fight
    })
    .get()

  return {
    id,
    title,
    poster,
    timestamp,
    fights: mainCardList,
  }
}
