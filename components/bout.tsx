import { CheckIcon, CloseIcon } from '@chakra-ui/icons'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  NumberIncrementStepper,
  Heading,
  Image,
  NumberDecrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  useColorMode,
} from '@chakra-ui/react'
import { Bet } from '@prisma/client'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import { PlacedBets } from 'components/bets'
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
  const { status } = useSession()
  const { fight, width, mode, index, total, eventTimestamp } = props
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
              <Heading
                width="255px"
                size="md"
                textTransform="uppercase"
                textAlign="left"
              >
                {fight.redCorner.firstName} {fight.redCorner.lastName}
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
            {/* Blue Corner */}
            <Flex>
              <Heading
                width="255px"
                size="md"
                textTransform="uppercase"
                textAlign="right"
              >
                {fight.blueCorner.firstName} {fight.blueCorner.lastName}
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
          <Odds fight={fight} />

          {status === 'authenticated' &&
            Math.floor(Date.now() / 1000) <= eventTimestamp &&
            !!fight.redCorner.odds && <UserBet fight={fight} balance={100} />}

          {/* Placed Bets */}
          <PlacedBets />

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

const calcWinnings = (wager: number, odds: number): number => {
  let frac = 0
  if (odds > 0) {
    frac = Math.abs(odds) / 100
    return parseFloat((frac * wager).toFixed(2))
  } else {
    frac = Math.abs(odds) / 100
    return parseFloat((wager / frac).toFixed(2))
  }
}

type UserBetProps = {
  fight: Fight
  balance: number
  bet?: Bet
}
const UserBet: React.FC<UserBetProps> = (props) => {
  const { balance = 10, fight } = props
  const [corner, setCorner] = useState<Bet['corner'] | undefined>(undefined)
  const [wager, setWager] = useState(0)
  const [winnings, setWinnings] = useState(0)

  const parse = (val: string) => parseFloat(val.replace(/^\$/, ''))

  const onSwitchCorner = (corner: Bet['corner']) => () => {
    setCorner(corner)
    setWager(0)
    setWinnings(0)
  }

  const onWagerChange = (valueAsString: string, valueAsNumber: number) => {
    setWager(parse(valueAsString))
    if (corner === 'RED') {
      setWinnings(calcWinnings(valueAsNumber, fight.redCorner.odds))
    } else {
      setWinnings(calcWinnings(valueAsNumber, fight.blueCorner.odds))
    }
  }

  // const onWagerClear = () => {
  //   // Delete bet
  // }

  return (
    <Flex width="100%" flexDir="column" gap={2}>
      <Flex
        width="100%"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Button
          colorScheme="red"
          variant={corner === 'RED' ? 'solid' : 'outline'}
          onClick={onSwitchCorner('RED')}
        >
          Red Corner
        </Button>
        {corner && (
          <Button size="xs" onClick={() => setCorner(undefined)}>
            Clear
            <CloseIcon fontSize="8" ml="2" />
          </Button>
        )}

        <Button
          colorScheme="blue"
          variant={corner === 'BLUE' ? 'solid' : 'outline'}
          onClick={onSwitchCorner('BLUE')}
        >
          Blue Corner
        </Button>
      </Flex>
      {corner && (
        <Wager
          corner={corner}
          wager={wager}
          winnings={winnings}
          balance={balance}
          onWagerChange={onWagerChange}
        />
      )}
    </Flex>
  )
}

type WagerProps = {
  corner: Bet['corner']
  wager: number
  winnings: number
  balance: number
  onWagerChange: (valueAsString: string, valueAsNumber: number) => void
  onPlaceBet?: () => void
}
const Wager: React.FC<WagerProps> = (props) => {
  const { colorMode } = useColorMode()
  const { corner, wager, winnings, balance, onWagerChange } = props

  const format = (val: number) => `$ ` + val

  return (
    <Flex
      px={2}
      justifyContent={corner === 'RED' ? 'start' : 'end'}
      borderLeftWidth="2px"
      borderRightWidth="2px"
      borderInlineStartColor={
        corner === 'RED'
          ? colorMode === 'light'
            ? 'red.500'
            : 'red.100'
          : 'transparent'
      }
      borderInlineEndColor={
        corner === 'BLUE'
          ? colorMode === 'light'
            ? 'blue.500'
            : 'blue.100'
          : 'transparent'
      }
    >
      <Flex flexDir="column" width="33%" gap={1}>
        {balance > 0 ? (
          <>
            {/* Wager */}
            <Flex
              position="relative"
              alignItems="center"
              gap={2}
              flexDir={corner === 'RED' ? 'row' : 'row-reverse'}
              justifyContent="space-between"
            >
              <Text>Wager</Text>
              <NumberInput
                size="sm"
                width={100}
                value={format(wager)}
                onChange={onWagerChange}
                max={balance}
                clampValueOnBlur={false}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {wager <= balance && wager > 0 && (
                <Button
                  position="absolute"
                  right={corner === 'RED' ? '-115px' : '225px'}
                  top="0"
                  size="sm"
                  colorScheme="gray"
                >
                  Place Bet
                  <CheckIcon color="green" fontSize="12" ml="2" />
                </Button>
              )}
            </Flex>

            {/* Winnings */}
            <Flex
              alignItems="center"
              gap={2}
              justifyContent="space-between"
              flexDir={corner === 'RED' ? 'row' : 'row-reverse'}
            >
              <Text>Winnings</Text>
              <NumberInput
                isDisabled
                size="sm"
                width={100}
                value={`$ ${winnings}`}
              >
                <NumberInputField />
              </NumberInput>
            </Flex>

            {/* Take Home */}
            <Flex
              alignItems="center"
              gap={2}
              justifyContent="space-between"
              flexDir={corner === 'RED' ? 'row' : 'row-reverse'}
            >
              <Text>Take Home</Text>
              <NumberInput
                isDisabled
                size="sm"
                width={100}
                value={`$ ${(winnings + wager).toFixed(2)}`}
              >
                <NumberInputField />
              </NumberInput>
            </Flex>
          </>
        ) : (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>Out of money!</AlertTitle>
            <AlertDescription>
              Try reducing or clearing other bets.
            </AlertDescription>
          </Alert>
        )}
      </Flex>
    </Flex>
  )
}
