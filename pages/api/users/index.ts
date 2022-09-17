// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { User } from '@prisma/client'
import { prisma } from 'data/db'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  data: User | null
  errors: string[]
}

export const checkUserExists = async (userEmail: string): Promise<boolean> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
    })
    return user !== null
  } catch (e) {
    return false
  }
}

export const createUser = async (
  email: string,
  name: string,
  image: string
): Promise<Data> => {
  console.log('Recieved user data:', email, name, image)
  try {
    const user = await prisma.user.create({
      data: {
        email,
        name,
        image,
      },
    })
    return { data: user, errors: [] }
  } catch (e) {
    return { data: null, errors: [`Could not create user: ${e}`] }
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method, body } = req

  const { email, name, image } = body

  let userData: Data = { data: null, errors: [] }
  switch (method) {
    case 'POST':
      userData = await createUser(email, name, image)
      res.status(200).json(userData)

    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
