import { Inter } from 'next/font/google'
import type { Metadata } from 'next'

import NextAuthSessionProvider from '@/providers/sessionProvider'
import { WorkspaceContextProvider } from '@/context/WorkspaceContext'
import { UserContextProvider } from '@/context/UserContext'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  icons: {
    icon: '/icon.png',
  },
  title: 'Task Manager',
  description:
    'Task Manager app designed to revolutionize the way users organize, prioritize, and accomplish their tasks efficiently',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} overflow-hidden`}>
        <NextAuthSessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <WorkspaceContextProvider>
              <UserContextProvider>{children}</UserContextProvider>
            </WorkspaceContextProvider>
          </ThemeProvider>
        </NextAuthSessionProvider>
        <Toaster position="top-center" duration={2000} closeButton richColors />
      </body>
    </html>
  )
}
