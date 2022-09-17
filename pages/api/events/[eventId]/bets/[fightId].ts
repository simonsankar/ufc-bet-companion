// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Bet } from '@prisma/client'
import { prisma } from 'data/db'
import { checkUserExists } from 'pages/api/users'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  data: Bet | null
  errors: string[]
}
const DEFAULT_BUDGET_AMOUNT = 1000

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

const checkEventUserBudgetExists = async (
  eventId: string,
  userEmail: string
): Promise<null | boolean> => {
  try {
    const budget = await prisma.budget.findUnique({
      where: {
        eventId_userEmail: {
          eventId,
          userEmail,
        },
      },
    })

    return budget !== null
  } catch (e) {
    return false
  }
}

const getEventUserBudget = async (eventId: string, userEmail: string) => {
  try {
    const budget = await prisma.budget.findUnique({
      where: {
        eventId_userEmail: {
          eventId,
          userEmail,
        },
      },
    })
    return budget
  } catch (e) {
    return null
  }
}

const upsertEventUserBudget = async (
  eventId: string,
  userEmail: string,
  balance: number
) => {
  try {
    const budget = prisma.budget.upsert({
      create: {
        eventId,
        userEmail,
        balance: balance,
      },
      update: {
        balance,
      },
      where: {
        eventId_userEmail: {
          eventId,
          userEmail,
        },
      },
    })
    return budget
  } catch (e) {
    return null
  }
}

const getBet = async (
  eventId: string,
  fightId: string,
  userEmail: string
): Promise<Data> => {
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
    // User has an existing budget: can/cannot upsert bet due to balance
    if (await checkEventUserBudgetExists(eventId, userEmail)) {
      const budget = await getEventUserBudget(eventId, userEmail)
      if (budget && wager <= budget?.balance) {
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

        // Get all event wages and upsert budget with new balance
        const allEventWagersByUser = await prisma.bet.findMany({
          select: {
            wager: true,
          },
          where: {
            eventId,
            userEmail,
          },
        })
        const allWagers = allEventWagersByUser
          .map((val) => val.wager)
          .reduce((prev, curr) => prev + curr)

        upsertEventUserBudget(
          eventId,
          userEmail,
          DEFAULT_BUDGET_AMOUNT - allWagers
        )

        return { data: bet, errors: [] }
      }
      return {
        data: null,
        errors: [`Wager ${wager} is more than your balance ${budget?.balance}`],
      }
    }

    // User has no existing budget: make bet and initialize budget
    const bet = await prisma.bet.create({
      data: {
        eventId,
        fightId,
        userEmail,
        wager,
        corner,
      },
    })
    await upsertEventUserBudget(
      eventId,
      userEmail,
      DEFAULT_BUDGET_AMOUNT - wager
    )

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
