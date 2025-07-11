'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)

  // Scroll lock saat menu terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      <header className="w-full shadow-sm border-b bg-white px-4 py-3 flex justify-between items-center sticky top-0 z-50">
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

      {/* Mobile Side Menu */}
      <aside
        className={`fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <span className="text-xl font-semibold text-blue-600">testnet.id</span>
          <button onClick={() => setIsOpen(false)} aria-label="Close Menu">
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex flex-col space-y-5 px-6 py-6 text-gray-800 text-base font-medium">
          <Link href="#" onClick={() => setIsOpen(false)}>Personal</Link>
          <Link href="#" onClick={() => setIsOpen(false)}>Business</Link>
          <Link href="#" onClick={() => setIsOpen(false)}>Blog</Link>
          <Link href="#" onClick={() => setIsOpen(false)}>Support</Link>
          <Link href="#" onClick={() => setIsOpen(false)}>FAQ</Link>
          <Link href="#" onClick={() => setIsOpen(false)}>Language: English (International)</Link>
        </nav>
      </aside>
    </>
  )
}

export default Header
