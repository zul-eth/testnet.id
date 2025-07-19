'use client'
import { createContext, useContext, useState } from 'react'
import { supportedCoins as initialCoins } from '@/utils/currencies'

const CoinContext = createContext<any>(null)

export const CoinProvider = ({ children }: { children: React.ReactNode }) => {
  const [coins, setCoins] = useState(initialCoins)

  const addCoin = (coin: any) => setCoins((prev: any[]) => [...prev, coin])
  const deleteCoin = (value: string) => setCoins((prev: any[]) => prev.filter(c => c.value !== value))
  const updateCoin = (value: string, newCoin: any) =>
    setCoins((prev: any[]) => prev.map(c => (c.value === value ? { ...c, ...newCoin } : c)))

  return (
    <CoinContext.Provider value={{ coins, addCoin, deleteCoin, updateCoin }}>
      {children}
    </CoinContext.Provider>
  )
}

export const useCoins = () => useContext(CoinContext)