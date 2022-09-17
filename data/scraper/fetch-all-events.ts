import { upsertCurrentEvent } from 'data/scraper/hydrate'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const fetchAllEvents = async () => {
  const total = 279
  for (let i = total; i >= 1; i--) {
    const eventId = `ufc-${i}`
    console.log(`Fetching: ${eventId} (${total - i + 1}/${total})`)
    upsertCurrentEvent(eventId)
    await delay(2000)
  }
}

fetchAllEvents()
