import { ReactNode } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Heading,
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon, AddIcon } from '@chakra-ui/icons'
import { ColourMode } from './colourMode'

const Links = ['Upcoming', 'Past Events']

const NavLink = ({ children }: { children: ReactNode }) => (
  <Link
    px={2}
    py={1}
    textTransform="uppercase"
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    href={'#'}
  >
    {children}
  </Link>
)

export const NavBar = () => {
  const { data: session } = useSession()
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <Box textTransform="uppercase">Bet Companion</Box>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}
            >
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            <ColourMode />
            {session ? (
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={'outline'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={0}
                  ml={4}
                >
                  <Avatar
                    size={'sm'}
                    src={
                      session.user?.image ||
                      'https://styles.redditmedia.com/t5_2qsev/styles/communityIcon_eq9p1oy6w8r51.png'
                    }
                  />
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => signOut()}>Logout</MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Button
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}
                ml={4}
                onClick={() =>
                  signIn('github', {
                    callbackUrl: 'http://localhost:3000/',
                  })
                }
              >
                Sign In
              </Button>
            )}
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  )
}
