import NextAuth, { NextAuthOptions } from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials, req) {
        console.log(credentials)
        if (credentials?.email === '' && credentials.password === '') {
          return credentials
        }
        return null
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET as string,
  theme: {
    colorScheme: 'dark',
  },
  pages: {
    signIn: '/signin',
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
