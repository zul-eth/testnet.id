// src/app/layout.tsx
import '../../styles/globals.css' // sesuaikan path relatif
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Testnet ID - Crypto Exchange',
  description: 'Exchange crypto on testnet network',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 flex flex-col min-h-screen">
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  )
}