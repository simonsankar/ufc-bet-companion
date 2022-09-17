import type { NextPage } from 'next'
import { upsertCurrentEvent } from '../data/scraper/hydrate'
import { MainCard } from '../shared/event'
import { Hero } from '../components/hero'
import { MainLayout } from '../components/layouts'

const Home: NextPage<MainCard> = (props) => {
  return (
    <MainLayout>
      <Hero {...props} />
    </MainLayout>
  )
}

export default Home

export const getServerSideProps = async () => {
  const mainCard = await upsertCurrentEvent()

  return {
    props: mainCard,
  }
}
