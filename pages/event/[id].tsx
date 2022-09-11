import { GetServerSidePropsContext, NextPage, NextPageContext } from 'next'
import { getCardByEventId } from '../../data/event'
import { MainCard } from '../../scraper'
import { Hero } from '../../components/hero'
import { MainLayout } from '../../components/layouts'

const EventPage: NextPage<MainCard> = (props) => {
  return (
    <MainLayout>
      {/* {props ? (
        <Hero {...props} />
      ) : ( */}
      <div>
        Debug: Error:
        <pre>{JSON.stringify(props, null, 2)}</pre>
      </div>
      {/* )} */}
    </MainLayout>
  )
}
export default EventPage

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{ id: string }>
) => {
  const { params } = context
  if (!params?.id) {
    return
  }
  console.log('event id: ', params.id)
  const card = await getCardByEventId(params.id)
  console.log(JSON.stringify(card, null, 2))
  return {
    props: card,
  }
}
