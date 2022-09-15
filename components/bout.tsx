import React, { useState } from 'react'
import {
  Flex,
  Heading,
  Badge,
  Divider,
  Box,
  Text,
  Image,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  useColorMode,
  Button,
  NumberInput,
  NumberInputField,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputStepper,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '@chakra-ui/react'
import { Fight } from '../scraper'
import { Bet, Corner } from '@prisma/client'
import { CheckIcon, CloseIcon } from '@chakra-ui/icons'
import { useSession } from 'next-auth/react'

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

const PlacedBets = () => {
  const { colorMode } = useColorMode()
  return (
    <Accordion mt={2} width="100%" allowToggle>
      <AccordionItem border="none">
        <AccordionButton
          _expanded={{
            bg: colorMode === 'light' ? 'gray.100' : 'gray.700',
          }}
        >
          <Box flex="1" textAlign="left">
            Bets
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel pb={2}>List of Bets</AccordionPanel>
      </AccordionItem>
    </Accordion>
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
  const { colorMode } = useColorMode()
  const [corner, setCorner] = useState<Bet['corner'] | undefined>(undefined)
  const [wager, setWager] = useState(0)
  const [potentialWinnings, setPotentialWinnings] = useState(0)

  const format = (val: number) => `$ ` + val
  const parse = (val: string) => parseFloat(val.replace(/^\$/, ''))

  const onSwitchCorner = (corner: Bet['corner']) => () => {
    setCorner(corner)
    setWager(0)
    setPotentialWinnings(0)
  }

  const onBetChange = (valueAsString: string, valueAsNumber: number) => {
    setWager(parse(valueAsString))
    if (corner === 'RED') {
      setPotentialWinnings(calcWinnings(valueAsNumber, fight.redCorner.odds))
    } else {
      setPotentialWinnings(calcWinnings(valueAsNumber, fight.blueCorner.odds))
    }
  }

  return (
    <Flex width="100%" flexDir="column" gap={2}>
      <Flex
        width="100%"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Button
          colorScheme={corner === 'RED' ? 'red' : 'inherit'}
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
          colorScheme={corner === 'BLUE' ? 'blue' : 'inherit'}
          variant={corner === 'BLUE' ? 'solid' : 'outline'}
          onClick={onSwitchCorner('BLUE')}
        >
          Blue Corner
        </Button>
      </Flex>
      {corner && (
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
                <Flex
                  position="relative"
                  alignItems="center"
                  gap={2}
                  justifyContent="space-between"
                >
                  <Text>Bet:</Text>
                  <NumberInput
                    size="sm"
                    width={100}
                    value={format(wager)}
                    onChange={onBetChange}
                    max={balance}
                    clampValueOnBlur={false}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  {wager <= 0 ||
                    (wager >= balance && (
                      <Button
                        disabled={wager <= 0 || wager >= balance}
                        position="absolute"
                        right="-115px"
                        top="0"
                        size="sm"
                        colorScheme="gray"
                      >
                        Place Bet
                        <CheckIcon color="green" fontSize="12" ml="2" />
                      </Button>
                    ))}
                </Flex>
                <Flex
                  alignItems="center"
                  gap={2}
                  justifyContent="space-between"
                >
                  <Text>Potential Winnings:</Text>
                  <NumberInput
                    isDisabled
                    size="sm"
                    width={100}
                    value={`$ ${potentialWinnings}`}
                  >
                    <NumberInputField />
                  </NumberInput>
                </Flex>
                <Flex
                  alignItems="center"
                  gap={2}
                  justifyContent="space-between"
                >
                  <Text>Take Home:</Text>
                  <NumberInput
                    isDisabled
                    size="sm"
                    width={100}
                    value={`$ ${(potentialWinnings + wager).toFixed(2)}`}
                  >
                    <NumberInputField />
                  </NumberInput>
                </Flex>
              </>
            ) : (
              <Alert status="error">
                <AlertIcon />
                <AlertTitle>You&apos;re out of money!</AlertTitle>
                <AlertDescription>
                  Try moving around the funds on other bets or clear all current
                  bets.
                </AlertDescription>
              </Alert>
            )}
          </Flex>
        </Flex>
      )}
    </Flex>
  )
}
