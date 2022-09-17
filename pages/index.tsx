import { Hero } from 'components/hero'
import { MainLayout } from 'components/layouts'
import { upsertCurrentEvent } from 'data/scraper/hydrate'
import { MainCard } from 'shared/event'
import type { NextPage } from 'next'

const Home: NextPage<MainCard> = (props) => {
  return (
    <MainLayout>
      <Hero {...props} />
    </MainLayout>
  )
}

export default Home

export const getServerSideProps = async () => {
  const mainCard = await upsertCurrentEvent('ufc-279')

  return {
    props: mainCard,
  }
}
