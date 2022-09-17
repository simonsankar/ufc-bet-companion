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
      if (!user.email || (await checkUserExists(user.email))) {
        return true
      }

      await createUser(user.email, user.name || '', user.image || '')
      return true
    },
  },
})
