import NextAuth, { Account, NextAuthOptions, Profile, Session, User } from 'next-auth'
import { compareSync } from 'bcrypt-ts'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import prisma from '@/lib/prisma'
import { JWT } from 'next-auth/jwt'
import { AdapterUser } from 'next-auth/adapters'
import { pages } from 'next/dist/build/templates/app-page'
import error from 'next/error'
import { profile } from 'console'

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
      async authorize(credentials) {
        if (credentials?.email === undefined || credentials?.password === undefined) return null
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })
        if (user && compareSync(credentials.password, user.password)) {
          return user
        }
        throw new Error('Invalid email or password')
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET as string,
  pages: {
    signIn: '/signin',
    error: '/signin',
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
