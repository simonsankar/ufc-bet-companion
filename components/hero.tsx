import { Flex, Heading, Divider, Text, useColorMode } from '@chakra-ui/react'
import { MainCard } from '../scraper'

export const Hero = (props: MainCard) => {
  const { colorMode } = useColorMode()

  const overLayGradients = {
    dark: `linear-gradient(180deg, #30333633 0, #303336)`,
    light: `linear-gradient(180deg, #dadbdd33 0, #dadbdd)`,
  }
  return (
    <>
      <Flex
        // flex="2"
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
            background: overLayGradients.dark,

            // colorMode === 'dark'
            //   ? overLayGradients.dark
            //   : overLayGradients.light,
            overflow: 'hidden',
          }}
        >
          <Text size="2xl" textTransform="uppercase">
            {props.title}
          </Text>
          <Heading size="4xl" textTransform="uppercase">
            {props.fights[0].redCorner.lastName}
          </Heading>
          <Text textTransform="uppercase">vs</Text>
          <Heading size="4xl" textTransform="uppercase">
            {props.fights[0].blueCorner.lastName}
          </Heading>
        </Flex>
      </Flex>
      <Flex flex="1" px="12" py="4" flexDir="column" align="center" gap="12">
        {props.fights.map((fight, idx) => (
          <Flex key={fight.id} width="60%">
            <Flex flexDir="column" align="center" width="100%" gap="2">
              {/* Bout */}
              <Text textTransform="uppercase">{fight.bout}</Text>
              {/* Ranks */}
              <Flex width="100%" justifyContent="space-between">
                <Text textTransform="uppercase">{fight.redCorner.rank}</Text>
                <Text textTransform="uppercase">{fight.blueCorner.rank}</Text>
              </Flex>
              {/* Fighters */}
              <Flex width="100%">
                <Heading flex="1" textTransform="uppercase" textAlign="left">
                  {fight.redCorner.lastName}
                </Heading>
                <Heading flex="1" textTransform="uppercase" textAlign="center">
                  vs
                </Heading>
                <Heading flex="1" textTransform="uppercase" textAlign="right">
                  {fight.blueCorner.lastName}
                </Heading>
              </Flex>
              {/* Odds */}
              <Flex width="100%">
                <Text flex="3" textTransform="uppercase" textAlign="right">
                  {fight.redCorner.odds > 0 && '+'}
                  {fight.redCorner.odds}
                </Text>
                <Text flex="1" textTransform="uppercase" textAlign="center">
                  ODDS
                </Text>
                <Text flex="3" textTransform="uppercase" textAlign="left">
                  {fight.blueCorner.odds > 0 && '+'}
                  {fight.blueCorner.odds}
                </Text>
              </Flex>
              {idx + 1 < props.fights.length && <Divider mt="4" />}
            </Flex>
          </Flex>
        ))}
      </Flex>
    </>
  )
}
