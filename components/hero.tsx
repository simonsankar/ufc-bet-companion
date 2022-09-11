import {
  Flex,
  Heading,
  Divider,
  Text,
  Image,
  useColorMode,
  Box,
  useBreakpointValue,
  color,
  Badge,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { MainCard } from '../scraper'

const FLAG_URL = 'https://www.ufc.com/themes/custom/ufc/assets/img/flags/'

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
          <Flex key={fight.id} width={contentWidth}>
            <Flex flexDir="column" align="center" width="100%" gap="1">
              {/* Bout */}
              <Text textTransform="uppercase">{fight.bout}</Text>

              {/* Ranks */}
              <Flex width="100%" justifyContent="space-between">
                <Text textTransform="uppercase">{fight.redCorner.rank}</Text>
                <Text textTransform="uppercase">{fight.blueCorner.rank}</Text>
              </Flex>

              {/* Fighters */}
              <Flex width="100%" justifyContent="space-between">
                {/* Red Corner */}
                <Flex>
                  <Flex position="relative" flexDir="column">
                    <Image
                      src={fight.redCorner.photo}
                      alt={fight.redCorner.lastName}
                      height={170}
                      width={185}
                      objectFit="cover"
                      objectPosition="top"
                    />
                    <Box
                      position="absolute"
                      top="0"
                      left="0"
                      height={170}
                      width={185}
                      style={{
                        background: mode,
                      }}
                    />
                    {fight.redCorner.flag && (
                      <Box display="flex" alignItems="center" gap="2">
                        <Image
                          alt={fight.redCorner.country}
                          src={FLAG_URL + fight.redCorner.flag}
                          width={7}
                        />
                        <Text>{fight.redCorner.country}</Text>
                      </Box>
                    )}
                  </Flex>
                  <Heading
                    width="255px"
                    size="lg"
                    textTransform="uppercase"
                    textAlign="left"
                  >
                    {fight.redCorner.lastName}
                  </Heading>
                </Flex>
                {/* Names */}
                <Flex>
                  <Heading
                    flex={4}
                    size="md"
                    textTransform="uppercase"
                    textAlign="center"
                  >
                    vs
                  </Heading>
                </Flex>
                {/* BLue Corner */}
                <Flex>
                  <Heading
                    width="255px"
                    size="lg"
                    textTransform="uppercase"
                    textAlign="right"
                  >
                    {fight.blueCorner.lastName}
                  </Heading>
                  <Flex position="relative" flexDir="column" alignItems="end">
                    <Image
                      src={fight.blueCorner.photo}
                      alt={fight.blueCorner.lastName}
                      height={170}
                      width={185}
                      objectFit="cover"
                      objectPosition="top"
                    />
                    <Box
                      position="absolute"
                      top="0"
                      left="0"
                      height={170}
                      width={185}
                      style={{
                        background: mode,
                      }}
                    />
                    {fight.blueCorner.flag && (
                      <Box display="flex" alignItems="center" gap="2">
                        <Text>{fight.blueCorner.country}</Text>
                        <Image
                          alt={fight.blueCorner.country}
                          src={FLAG_URL + fight.blueCorner.flag}
                          width={7}
                        />
                      </Box>
                    )}
                  </Flex>
                </Flex>
              </Flex>

              {/* Odds Row*/}
              <Flex flex="2" width="100%">
                <Flex flex="3" justifyContent="end">
                  {fight.redCorner.odds !== 0 ? (
                    <Badge
                      colorScheme={fight.redCorner.odds < 0 ? 'green' : 'red'}
                      p=".5"
                      pt="1"
                    >
                      {fight.redCorner.odds > 0 && '+'}
                      {fight.redCorner.odds}
                    </Badge>
                  ) : (
                    <Text>-</Text>
                  )}
                </Flex>
                <Text flex="1" textTransform="uppercase" textAlign="center">
                  ODDS
                </Text>
                <Flex flex="3">
                  {fight.blueCorner.odds !== 0 ? (
                    <Badge
                      colorScheme={fight.blueCorner.odds < 0 ? 'green' : 'red'}
                      p=".5"
                      pt="1"
                    >
                      {fight.blueCorner.odds > 0 && '+'}
                      {fight.blueCorner.odds}
                    </Badge>
                  ) : (
                    <Text>-</Text>
                  )}
                </Flex>
              </Flex>
              {idx + 1 < props.fights.length && <Divider mt="4" />}
            </Flex>
          </Flex>
        ))}
      </Flex>
    </>
  )
}
