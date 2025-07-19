'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type NetworkType = 'mainnet' | 'testnet'

type NetworkContextType = {
  network: NetworkType
  setNetwork: (val: NetworkType) => void
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined)

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [network, setNetwork] = useState<NetworkType>('testnet')
  const [isReady, setIsReady] = useState(false)

  // Ambil nilai dari localStorage saat pertama kali mount
  useEffect(() => {
    const saved = localStorage.getItem('network')
    if (saved === 'mainnet' || saved === 'testnet') {
      setNetwork(saved)
    }
    setIsReady(true)
  }, [])

  // Simpan perubahan network ke localStorage
  useEffect(() => {
    if (isReady) {
      localStorage.setItem('network', network)
    }
  }, [network, isReady])

  // Tampilkan loading dulu sebelum context siap
  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
        Loading network...
      </div>
    )
  }

  return (
    <NetworkContext.Provider value={{ network, setNetwork }}>
      {children}
    </NetworkContext.Provider>
  )
}

export function useNetwork() {
  const context = useContext(NetworkContext)
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider')
  }
  return context
}