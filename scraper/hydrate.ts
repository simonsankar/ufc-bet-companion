import { PrismaClient } from '@prisma/client'
import { getMainCard, MainCard, Fight } from '.'

const prisma = new PrismaClient()

export const upsertCurrentEvent = async (
  eventId?: string
): Promise<MainCard> => {
  const mainCard = await getMainCard(eventId)

  const { id, title, timestamp, poster } = await prisma.event.upsert({
    where: { id: mainCard.id },
    update: {
      title: mainCard.title,
      timestamp: mainCard.timestamp,
    },
    create: {
      id: mainCard.id,
      title: mainCard.title,
      poster: mainCard.poster,
      timestamp: mainCard.timestamp,
    },
  })

  let updatedFights: Fight[] = []
  try {
    updatedFights = await Promise.all(
      mainCard.fights.map(async (fight) => {
        console.log('fight.redCorner.photo', fight.redCorner.photo)
        console.log('fight.blueCorner.photo', fight.blueCorner.photo)
        const updatedFight = await prisma.fight.upsert({
          where: {
            id_eventId: {
              id: fight.id,
              eventId: mainCard.id,
            },
          },
          update: {
            bout: fight.bout,
            order: fight.order,

            redCornerFirstName: fight.redCorner.firstName,
            redCornerLastName: fight.redCorner.lastName,
            redCornerRank: fight.redCorner.rank,
            redCornerOdds: fight.redCorner.odds,
            redCornerOutcome: fight.redCorner.outcome,
            redCountry: fight.redCorner.country,
            redFlag: fight.redCorner.flag,
            redPhoto: fight.redCorner.photo,

            blueCornerFirstName: fight.blueCorner.firstName,
            blueCornerLastName: fight.blueCorner.lastName,
            blueCornerRank: fight.blueCorner.rank,
            blueCornerOdds: fight.blueCorner.odds,
            blueCornerOutcome: fight.blueCorner.outcome,
            blueCountry: fight.blueCorner.country,
            blueFlag: fight.blueCorner.flag,
            bluePhoto: fight.blueCorner.photo,
          },
          create: {
            id: fight.id,
            eventId: mainCard.id,
            bout: fight.bout,
            order: fight.order,

            redCornerFirstName: fight.redCorner.firstName,
            redCornerLastName: fight.redCorner.lastName,
            redCornerRank: fight.redCorner.rank,
            redCornerOdds: fight.redCorner.odds,
            redCornerOutcome: fight.redCorner.outcome,
            redCountry: fight.redCorner.country,
            redFlag: fight.redCorner.flag,
            redPhoto: fight.redCorner.photo,

            blueCornerFirstName: fight.blueCorner.firstName,
            blueCornerLastName: fight.blueCorner.lastName,
            blueCornerRank: fight.blueCorner.rank,
            blueCornerOdds: fight.blueCorner.odds,
            blueCornerOutcome: fight.blueCorner.outcome,
            blueCountry: fight.blueCorner.country,
            blueFlag: fight.blueCorner.flag,
            bluePhoto: fight.blueCorner.photo,
          },
        })

        return {
          id: updatedFight.id,
          bout: updatedFight.bout,
          order: updatedFight.order,
          redCorner: {
            firstName: updatedFight.redCornerFirstName,
            lastName: updatedFight.redCornerLastName,
            rank: updatedFight.redCornerRank,
            odds: updatedFight.redCornerOdds,
            outcome: updatedFight.redCornerOutcome,
            country: updatedFight.redCountry,
            flag: updatedFight.redFlag,
            photo: updatedFight.redPhoto || '',
          },
          blueCorner: {
            firstName: updatedFight.blueCornerFirstName,
            lastName: updatedFight.blueCornerLastName,
            rank: updatedFight.blueCornerRank,
            odds: updatedFight.blueCornerOdds,
            outcome: updatedFight.blueCornerOutcome,
            country: updatedFight.blueCountry,
            flag: updatedFight.blueFlag,
            photo: updatedFight.bluePhoto || '',
          },
        }
      })
    )
  } catch (e) {
    console.error(e)
  }
  return {
    id,
    title,
    poster,
    timestamp,
    fights: updatedFights.length ? updatedFights : mainCard.fights,
  }
}
