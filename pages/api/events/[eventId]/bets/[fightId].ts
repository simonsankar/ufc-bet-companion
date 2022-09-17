// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Bet } from '@prisma/client'
import { prisma } from '../../../../../data/db'
import { checkUserExists } from '../../../users'

type Data = {
  data: Bet | null
  errors: string[]
}

const checkEventFightExists = async (
  eventId: string,
  fightId: string
): Promise<boolean> => {
  try {
    const eventFight = await prisma.fight.findUnique({
      where: {
        id_eventId: {
          eventId,
          id: fightId,
        },
      },
    })
    return eventFight !== null
  } catch (e) {
    return false
  }
}

const getBet = async (
  eventId: string,
  fightId: string,
  userEmail: string
): Promise<Data> => {
  console.log('get a user bet')
  try {
    const bet = await prisma.bet.findUnique({
      where: {
        eventId_fightId_userEmail: {
          eventId,
          fightId,
          userEmail,
        },
      },
    })
    return { data: bet, errors: [] }
  } catch (e) {
    return { data: null, errors: [`Could not get bet: ${e}`] }
  }
}

const upsertBet = async (
  eventId: string,
  fightId: string,
  userEmail: string,
  wager: number,
  corner: Bet['corner']
): Promise<Data> => {
  const errors = []

  if (!(await checkEventFightExists(eventId, fightId))) {
    errors.push('Event fight does not exist')
  }
  if (!(await checkUserExists(userEmail))) {
    errors.push('User does not exist')
  }

  if (errors.length) {
    return { data: null, errors }
  }

  try {
    // Ensure user has a valid event budget

    // Upsert bet
    const bet = await prisma.bet.upsert({
      create: {
        eventId,
        fightId,
        userEmail,
        wager,
        corner,
      },
      update: {
        eventId,
        fightId,
        userEmail,
        wager,
        corner,
      },
      where: {
        eventId_fightId_userEmail: {
          eventId,
          fightId,
          userEmail,
        },
      },
    })

    // Update balance on budget

    return { data: bet, errors: [] }
  } catch (e) {
    return { data: null, errors: [`Could not create a new bet: ${e}`] }
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // const token = await getToken({ req })
  // if (token) {
  //   // Signed in
  //   console.log('token', token)
  // } else {
  //   // Not Signed in
  //   res.status(401)
  // }
  // res.end()

  const { query, method, body } = req

  const { eventId, fightId } = query
  const { userEmail, wager, corner } = body

  if (!eventId?.toString() || !fightId?.toString()) {
    res.status(404).end(`Missing eventId or fightId`)
    return
  }

  let betData: Data = { data: null, errors: [] }
  switch (method) {
    case 'GET':
      betData = await getBet(eventId.toString(), fightId.toString(), userEmail)
      res.status(200).json(betData)
    case 'PUT':
      betData = await upsertBet(
        eventId.toString(),
        fightId.toString(),
        userEmail,
        wager,
        corner
      )
      res.status(201).json(betData)
    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
