import { Bet, Event } from '@prisma/client'
import { atom } from 'jotai'

export const activeEvent = atom<Event | null>(null)

export const events = atom<Event[]>([])

export const eventBets = atom<Bet[]>([])
