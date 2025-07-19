// src/app/layout.tsx
import '../../styles/globals.css'
import type { Metadata } from 'next'
//import { NetworkProvider } from '@/context/NetworkContext'
//import Header from '@/components/shared/Header'
//import Footer from '@/components/shared/Footer'

export const metadata: Metadata = {
  title: 'Testnet ID',
  description: 'Buy crypto with testnet',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 flex flex-col min-h-screen">
          <main className="flex-grow">{children}</main>
      </body>
    </html>
  )
}