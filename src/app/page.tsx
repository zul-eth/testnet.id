// src/app/page.tsx
'use client'

import Link from 'next/link'
import { ArrowRight, Shield, Zap, Globe } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to{' '}
            <span className="text-blue-600">testnet.id</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Exchange cryptocurrency safely on testnet network. 
            Perfect for testing and development purposes.
          </p>
          
          <Link
            href="/order"
            className="inline-flex items-center bg-blue-600 text-white font-semibold px-8 py-4 rounded-xl hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Start Exchange
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Safe Testing</h3>
            <p className="text-gray-600">
              Test your crypto transactions safely on testnet without using real funds
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Fast Exchange</h3>
            <p className="text-gray-600">
              Quick and efficient exchange process with real-time rate calculations
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Multi Network</h3>
            <p className="text-gray-600">
              Support for both testnet and mainnet environments
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to start exchanging?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            No registration required. Start your exchange in just 3 simple steps.
          </p>
          <Link
            href="/order"
            className="inline-flex items-center bg-green-500 text-white font-semibold px-8 py-4 rounded-xl hover:bg-green-600 transition-all"
          >
            Create Order Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </main>
  )
}