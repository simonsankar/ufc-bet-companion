import { CheckIcon, CloseIcon } from '@chakra-ui/icons'
import {
  Accordion,
  AccordionPanel,
  useColorMode,
  AccordionIcon,
  AccordionButton,
  AccordionItem,
  Box,
  Flex,
  Button,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
} from '@chakra-ui/react'
import { Bet } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'
import { useState } from 'react'
import { activeEvent } from 'atoms/events'
import { Fight } from 'shared/event'

const getFightBets = async (eventId: string, fightId: string) => {
  const resp = await fetch(`/api/events/${eventId}/bets/${fightId}`)
  return await resp.json()
}

type PlacedBetsProps = {
  fight: Fight
}
export const PlacedBets: React.FC<PlacedBetsProps> = (props) => {
  const { fight } = props
  const activeEventVal = useAtomValue(activeEvent)

  const { data, isLoading, isError } = useQuery(
    [`${fight.id}-bets`],
    () => getFightBets(activeEventVal?.id || '', fight.id),
    {
      enabled: true,
    }
  )

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
        <AccordionPanel pb={2}>
          {isLoading && 'Loading'}
          {isError && 'Error'}
          {data &&
            data.data.map((bet: any) => (
              <div key={bet.userEmail}>
                name:{bet.User.name} | wager:{bet.wager} |{' '}
                {bet.corner === 'RED'
                  ? fight.redCorner.lastName
                  : fight.blueCorner.lastName}
              </div>
            ))}
          {data && JSON.stringify(data)}
        </AccordionPanel>
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
export const UserBet: React.FC<UserBetProps> = (props) => {
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
