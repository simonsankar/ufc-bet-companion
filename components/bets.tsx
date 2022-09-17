import {
  Accordion,
  AccordionPanel,
  useColorMode,
  AccordionIcon,
  AccordionButton,
  AccordionItem,
  Box,
} from '@chakra-ui/react'

export const PlacedBets = () => {
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
