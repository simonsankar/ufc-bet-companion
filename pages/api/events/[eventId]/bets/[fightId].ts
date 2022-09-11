// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  data: any
  method: string | undefined
}

const upsertBet = () => {
  console.log('upsert a user bet')
}
const getBet = () => {
  console.log('get a user bet')
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { query, method } = req

  switch (method) {
    case 'GET':
      getBet()
      res.status(200).json({ data: query, method })
    case 'PUT':
      upsertBet()
      res.status(200).json({ data: query, method })
    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
