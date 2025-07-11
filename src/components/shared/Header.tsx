'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
  }, [isOpen])

  return (
    <>
      <header className="w-full border-b bg-white px-4 py-3 flex justify-between items-center sticky top-0 z-50">
        <Link href="/" className="text-2xl font-bold text-blue-600">testnet.id</Link>
        <nav className="hidden md:flex space-x-6 text-gray-700 text-sm font-medium">
          <Link href="#">Exchange</Link>
          <Link href="#">Buy</Link>
          <Link href="#">Sell</Link>
          <Link href="#">DeFi</Link>
        </nav>
        <button
          className="md:hidden"
          onClick={() => setIsOpen(true)}
          aria-label="Open Menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide Down Menu */}
      <div
        className={`fixed top-0 left-0 right-0 bg-white shadow-md z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <span className="text-xl font-semibold text-blue-600">testnet.id</span>
          <button onClick={() => setIsOpen(false)} aria-label="Close Menu">
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex flex-col px-6 py-4 space-y-5 text-gray-800 text-base font-medium">
          <Link href="#" onClick={() => setIsOpen(false)}>Personal</Link>
          <Link href="#" onClick={() => setIsOpen(false)}>Business</Link>
          <Link href="#" onClick={() => setIsOpen(false)}>Blog</Link>
          <Link href="#" onClick={() => setIsOpen(false)}>Support</Link>
          <Link href="#" onClick={() => setIsOpen(false)}>FAQ</Link>
          <Link href="#" onClick={() => setIsOpen(false)}>Language: English (International)</Link>
        </nav>
      </div>
    </>
  )
}

export default Header
