import React from 'react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { IconButton, useColorMode } from '@chakra-ui/react'

export const ColourMode = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <IconButton
      variant="ghost"
      onClick={toggleColorMode}
      aria-label="Toggle Colour Mode"
      icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
    />
  )
}
