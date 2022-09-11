import { GetServerSidePropsContext, NextPage, NextPageContext } from 'next'
import { useRouter } from 'next/router'
import { getCardByEventId } from '../../data/event'
import { MainCard } from '../../scraper'
import { Hero } from '../../components/hero'
import { MainLayout } from '../../components/layouts'

const EventPage: NextPage<MainCard> = (props) => {
  const router = useRouter()
  //   const { id } = router.query

  return (
    <MainLayout>
      <Hero {...props} />
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
  const card = await getCardByEventId(params.id)

  return {
    props: card,
  }
}
