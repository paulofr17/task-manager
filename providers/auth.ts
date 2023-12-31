import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next'
import type { DefaultSession, NextAuthOptions as NextAuthConfig } from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getServerSession } from 'next-auth'
import { compareSync } from 'bcrypt-ts'
import prisma from '@/lib/prisma'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      id?: string
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    id?: string
  }
}

export const config = {
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
        if (user && user?.password && compareSync(credentials.password, user.password)) {
          return user
        }
        throw new Error('Invalid email or password')
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (trigger === 'signIn' && user) {
        const userFound = await prisma.user.findUnique({
          where: {
            email: token.email as string,
          },
          select: {
            id: true,
            image: true,
          },
        })
        // User found, update image and id in token
        if (userFound) {
          token.id = userFound.id
          token.picture = userFound.image
        }
        // User not found, create new user
        else {
          const newUser = await prisma.user.create({
            data: {
              email: token.email as string,
              name: token.name as string,
              image: token.picture as string,
            },
          })
          token.id = newUser.id
          token.picture = newUser.image
        }
      }
      return token
    },
    async session({ session, token }) {
      if (!session.user.id) {
        session.user.id = token.id
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET as string,
  pages: {
    signIn: '/signin',
    error: '/signin',
  },
} satisfies NextAuthConfig

export function auth(
  ...args:
    | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, config)
}
