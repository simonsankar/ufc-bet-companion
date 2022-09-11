import React from 'react'
import { NavBar } from './navbar'

export const MainLayout: React.FC<{ children: React.ReactNode }> = (props) => {
  return (
    <>
      <NavBar />
      {props.children}
    </>
  )
}
