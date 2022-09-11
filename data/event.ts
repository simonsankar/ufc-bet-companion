import { PrismaClient } from '@prisma/client'
import { Fight, MainCard } from '../scraper'

const prisma = new PrismaClient()

export const getCardByEventId = async (
  eventId: string
): Promise<MainCard | null> => {
  const event = await prisma.event.findUnique({
    select: {
      id: true,
      title: true,
      poster: true,
      timestamp: true,
    },
    where: {
      id: eventId,
    },
  })
  if (!event) {
    return null
  }

  const eventFights = await prisma.fight.findMany({
    select: {
      id: true,
      bout: true,
      order: true,
      redCornerFirstName: true,
      redCornerLastName: true,
      redCornerOdds: true,
      redCornerOutcome: true,
      redCornerRank: true,
      redCountry: true,
      redFlag: true,
      redPhoto: true,
      blueCornerFirstName: true,
      blueCornerLastName: true,
      blueCornerOdds: true,
      blueCornerOutcome: true,
      blueCornerRank: true,
      blueCountry: true,
      blueFlag: true,
      bluePhoto: true,
    },
    where: {
      eventId: eventId,
    },
    orderBy: [
      {
        order: 'asc',
      },
    ],
  })

  const fights: Fight[] = eventFights.map((fight) => ({
    id: fight.id,
    bout: fight.bout,
    order: fight.order,
    redCorner: {
      firstName: fight.redCornerFirstName,
      lastName: fight.redCornerLastName,
      odds: fight.redCornerOdds,
      outcome: fight.redCornerOutcome,
      rank: fight.redCornerRank,
      country: fight.redCountry,
      flag: fight.redFlag,
      photo: fight.redPhoto || '',
    },
    blueCorner: {
      firstName: fight.blueCornerFirstName,
      lastName: fight.blueCornerLastName,
      odds: fight.blueCornerOdds,
      outcome: fight.blueCornerOutcome,
      rank: fight.blueCornerRank,
      country: fight.blueCountry,
      flag: fight.blueFlag,
      photo: fight.bluePhoto || '',
    },
  }))

  return {
    id: event.id,
    title: event.title,
    poster: event.poster,
    timestamp: event.timestamp,
    fights: fights,
  }
}
