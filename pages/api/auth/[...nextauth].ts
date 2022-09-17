import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import { checkUserExists, createUser } from 'pages/api/users'

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
    // ...add more providers here
  ],

  callbacks: {
    async signIn({ user }) {
      console.log('attempt to check sign in user')
      console.log('user', user.email)
      if (!user.email || (await checkUserExists(user.email))) {
        return true
      }
      console.log('creating new user!', user.email, user.name, user.image)

      const newUser = await createUser(
        user.email,
        user.name || '',
        user.image || ''
      )
      console.log(JSON.stringify(newUser))
      return true
    },
  },
})
