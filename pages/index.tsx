import type { NextPage } from 'next'
import { NavBar } from '../components/navbar'
import { MainCard } from '../scraper'
import { upsertCurrentEvent } from '../scraper/hydrate'

const Home: NextPage<MainCard> = (props) => {
  return (
    <>
      <NavBar />
      <div>{props.title}</div>
    </>
  )
}

export default Home

export const getServerSideProps = async () => {
  const mainCard = await upsertCurrentEvent()

  return {
    props: mainCard,
  }
}
