import React from 'react'
import { NavBar } from 'components/navbar'

export const MainLayout: React.FC<{ children: React.ReactNode }> = (props) => {
  return (
    <>
      <NavBar />
      {props.children}
    </>
  )
}
