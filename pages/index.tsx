import type { NextPage } from 'next'
import { useEffect } from 'react'
import { Hero } from '../components/hero'
import { MainLayout } from '../components/layouts'
import { MainCard } from '../scraper'
import { upsertCurrentEvent } from '../scraper/hydrate'

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
