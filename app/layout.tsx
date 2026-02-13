import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from 'sonner'

import './globals.css'
import { AuthProvider } from './providers'

/* Load the Geist font family for a clean, modern look */
const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Smart Bookmark App',
  description: 'A simple and secure bookmark manager with real-time updates',
  generator: 'v0.app',
}

/**
 * RootLayout - wraps the entire app with AuthProvider and includes the
 * Sonner Toaster so toast notifications are available on every page.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
          {/* Sonner toast container - renders all toast notifications globally */}
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: '12px',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
