import { useSession } from 'next-auth/react'
import React from 'react'
import { MainLayout } from 'components/layouts'

const EventsPage = () => {
  const session = useSession()
  return (
    <MainLayout>
      EventsPage
      <div>
        <pre>{JSON.stringify(session.data, null, 2)}</pre>
      </div>
    </MainLayout>
  )
}

export default EventsPage
