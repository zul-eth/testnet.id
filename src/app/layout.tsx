import './globals.css'

import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'

export const metadata = {
  title: 'Changelly UI',
  description: 'Buy crypto with testnet',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

