import { useEffect, useState } from 'react'
import {
  Flex,
  Heading,
  Text,
  useColorMode,
  useBreakpointValue,
} from '@chakra-ui/react'
import { Bout } from './bout'
import { MainCard } from '../shared/event'

const overLayGradients = {
  dark: `linear-gradient(180deg, #30333633 0, #303336)`,
  light: `linear-gradient(180deg, #f2f2f333 0, #f2f2f3)`,
}
export const Hero = (props: MainCard) => {
  const { colorMode } = useColorMode()
  const contentWidth = useBreakpointValue({
    base: '80%',
    xl: '60%',
    lg: '70%',
    md: '80%',
    sm: '100%',
  })

  const [mode, setMode] = useState(overLayGradients.dark)

  useEffect(() => {
    if (colorMode === 'light') {
      setMode(overLayGradients.light)
      return
    }
    setMode(overLayGradients.dark)
  }, [colorMode])
  return (
    <>
      <Flex
        style={{
          position: 'relative',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'none',
          backgroundImage: `url('${props.poster}')`,
          height: 'calc(70vh - 64px)',
          overflow: 'hidden',
        }}
      >
        <Flex
          padding="4"
          height="100%"
          width="100%"
          flexDir="column"
          align="center"
          justifyContent="center"
          gap="4"
          style={{
            position: 'absolute',
            background: mode,
            overflow: 'hidden',
          }}
        >
          <Text fontSize="3xl" textTransform="uppercase">
            {props.title}
          </Text>
          <Heading size="4xl" textTransform="uppercase">
            {props.fights[0].redCorner.lastName}
          </Heading>
          <Text fontSize="2xl" textTransform="uppercase">
            vs
          </Text>
          <Heading size="4xl" textTransform="uppercase">
            {props.fights[0].blueCorner.lastName}
          </Heading>
        </Flex>
      </Flex>
      <Flex flex="1" px="12" py="4" flexDir="column" align="center" gap="12">
        {props.fights.map((fight, idx) => (
          <>
            <Bout
              key={fight.id}
              index={idx}
              total={props.fights.length}
              fight={fight}
              width={contentWidth || '70%'}
              mode={mode}
              eventTimestamp={props.timestamp}
            />
          </>
        ))}
      </Flex>
    </>
  )
}
