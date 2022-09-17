export type MainCard = {
  id: string
  title: string
  poster: string
  timestamp: number
  fights: Fight[]
}

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
