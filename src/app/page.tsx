'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Selamat Datang di testnet.id</h1>
        <p className="text-gray-600 mb-6 text-sm leading-relaxed">
          Tukar stablecoin ke crypto dengan mudah menggunakan jaringan testnet. Platform ini adalah simulasi dari layanan pertukaran seperti Changelly.
        </p>

        <Link
          href="/buy"
          className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition"
        >
          Mulai Tukar Sekarang
        </Link>
      </div>
    </main>
  )
}