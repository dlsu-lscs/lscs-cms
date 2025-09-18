import React from 'react'
import { Inter as FontSans } from 'next/font/google'
import '@/styles/globals.css'
import { cn } from '@/lib/utils'

export const metadata = {
  description: 'A cms system for LSCS',
  title: 'LSCS CMS',
  icons: {
    icon: '/lscs-logo.png',
  },
}

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" className="dark">
      {/* Add 'dark' class for dark mode */}
      <body
        className={cn(
          'min-h-screen bg-background text-foreground font-sans antialiased',
          fontSans.variable,
        )}
      >
        <main>{children}</main>
      </body>
    </html>
  )
}
