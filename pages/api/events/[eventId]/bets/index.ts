import { prisma } from 'data/db'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { EventBets } from 'shared/event'

type Data = {
  data: EventBets | null
  errors: string[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { query, method } = req
  const { eventId } = query

  if (!eventId?.toString()) {
    res.status(404).end(`Missing eventId`)
    return
  }

  switch (method) {
    case 'GET':
      const fightIds = await prisma.fight.findMany({
        select: {
          id: true,
        },
        where: {
          eventId: eventId.toString(),
        },
      })

      if (!fightIds || fightIds.length === 0) {
        res.status(200).json({
          data: null,
          errors: [
            'No fights for this event found, therefor no bets were found',
          ],
        })
        return
      }

      const betsPerFight = fightIds.map(async (fightId) => {
        const bets = await prisma.bet.findMany({
          where: {
            eventId: eventId.toString(),
            fightId: fightId.id,
          },
        })

        return {
          fightId: fightId.id,
          bets,
        }
      })

      const fightsBets = await Promise.all(betsPerFight)
      res.status(200).json({
        data: {
          eventId: eventId.toString(),
          fightsBets,
        },
        errors: [],
      })

    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
