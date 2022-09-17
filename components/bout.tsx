import {
  Badge,
  Box,
  Divider,
  Flex,
  Heading,
  Image,
  Text,
} from '@chakra-ui/react'
import { useSession } from 'next-auth/react'
import React from 'react'
import { PlacedBets, UserBet } from 'components/bets'
import type { Fight } from 'shared/event'

const FLAG_URL = 'https://www.ufc.com/themes/custom/ufc/assets/img/flags/'

type BoutProps = {
  index: number
  total: number
  fight: Fight
  width: string
  mode: string
  eventTimestamp: number
}

export const Bout: React.FC<BoutProps> = (props) => {
  const { fight, width, mode, index, total, eventTimestamp } = props
  const { status } = useSession()

  return (
    <>
      <Flex key={fight.id} width={width}>
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
              <Flex zIndex={1} flexDir="column" alignItems="start" gap="2">
                <Heading
                  width="255px"
                  size="md"
                  textTransform="uppercase"
                  textAlign="left"
                >
                  {fight.redCorner.firstName} {fight.redCorner.lastName}
                </Heading>
                {fight.redCorner.outcome === 'Win' && (
                  <Badge fontSize="lg" variant="solid" colorScheme="red">
                    Win
                  </Badge>
                )}
              </Flex>
            </Flex>
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
            {/* Blue Corner */}
            <Flex>
              <Flex flexDir="column" alignItems="end" gap="2">
                <Heading
                  zIndex={1}
                  width="255px"
                  size="md"
                  textTransform="uppercase"
                  textAlign="right"
                >
                  {fight.blueCorner.firstName} {fight.blueCorner.lastName}
                </Heading>
                {fight.blueCorner.outcome === 'Win' && (
                  <Badge fontSize="lg" variant="solid" colorScheme="red">
                    Win
                  </Badge>
                )}
              </Flex>
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
          <Odds fight={fight} />

          {status === 'authenticated' &&
            Math.floor(Date.now() / 1000) <= eventTimestamp &&
            !!fight.redCorner.odds && <UserBet fight={fight} balance={100} />}

          {/* Placed Bets */}
          <PlacedBets fight={fight} />

          {index + 1 < total && <Divider mt="4" />}
        </Flex>
      </Flex>
    </>
  )
}

type OddsProps = {
  fight: Fight
}
const Odds: React.FC<OddsProps> = (props) => {
  const { fight } = props
  return (
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
  )
}
