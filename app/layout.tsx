import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { I18nProvider } from './context/I18nContext'

export const metadata: Metadata = {
  title: 'SoftClub',
  description: 'SoftClub - AI-powered skill assessment for JavaScript, TypeScript, and Python',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://static-bundles.visme.co/forms/embed.js" async></script>
      </head>
      <body className="bg-background text-foreground">
        <ThemeProvider>
          <I18nProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

