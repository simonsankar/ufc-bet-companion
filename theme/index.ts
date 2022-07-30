import { extendTheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

export const theme = extendTheme({
  fonts: {
    heading: `'Trigot', Arial, Helvetica, sans-serif`,
    body: `'Overpass', sans-serif`,
  },
  colors: {
    gray: {
      '50': '#F2F2F3',
      '100': '#DADBDD',
      '200': '#C1C4C7',
      '300': '#A9ADB1',
      '400': '#91969C',
      '500': '#798086',
      '600': '#61666B',
      '700': '#494D50',
      '800': '#303336',
      '900': '#181A1B',
    },
  },
  styles: {
    global: (props: any) => ({
      body: {
        color: mode('gray.800', 'gray.100')(props),
        bg: mode('gray.50', 'gray.800')(props),
      },
    }),
  },
})
