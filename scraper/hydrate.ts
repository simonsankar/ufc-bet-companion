import { PrismaClient } from '@prisma/client'
import { getMainCard, MainCard, Fight } from '.'

const prisma = new PrismaClient()

export const upsertCurrentEvent = async (): Promise<MainCard> => {
  const mainCard = await getMainCard()

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
        const updatedFight = await prisma.fight.upsert({
          where: {
            id_eventId: {
              id: fight.id,
              eventId: mainCard.id,
            },
          },
          update: {
            bout: fight.bout,
            redCornerFirstName: fight.redCorner.firstName,
            redCornerLastName: fight.redCorner.lastName,
            redCornerRank: fight.redCorner.rank,
            redCornerOdds: fight.redCorner.odds,
            redCornerOutcome: fight.redCorner.outcome,
          },
          create: {
            id: fight.id,
            eventId: mainCard.id,
            bout: fight.bout,
            redCornerFirstName: fight.redCorner.firstName,
            redCornerLastName: fight.redCorner.lastName,
            redCornerRank: fight.redCorner.rank,
            redCornerOdds: fight.redCorner.odds,
            redCornerOutcome: fight.redCorner.outcome,
            blueCornerFirstName: fight.blueCorner.firstName,
            blueCornerLastName: fight.blueCorner.lastName,
            blueCornerRank: fight.blueCorner.rank,
            blueCornerOdds: fight.blueCorner.odds,
            blueCornerOutcome: fight.blueCorner.outcome,
          },
        })

        return {
          id: updatedFight.id,
          bout: updatedFight.bout,
          redCorner: {
            firstName: updatedFight.redCornerFirstName,
            lastName: updatedFight.redCornerLastName,
            rank: updatedFight.redCornerRank,
            odds: updatedFight.redCornerOdds,
            outcome: updatedFight.redCornerOutcome,
          },
          blueCorner: {
            firstName: updatedFight.blueCornerFirstName,
            lastName: updatedFight.blueCornerLastName,
            rank: updatedFight.blueCornerRank,
            odds: updatedFight.blueCornerOdds,
            outcome: updatedFight.blueCornerOutcome,
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
