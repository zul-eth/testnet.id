'use client'

import { ChevronDown } from 'lucide-react'
import Image from 'next/image'

interface Coin {
  id: string
  name: string
  symbol: string
  iconUrl: string
}

interface Props {
  value: string
  onChange: (val: string) => void
  coins: Coin[]
  noBox?: boolean
  placeholder?: string
}

export default function CurrencyDropdown({ 
  value, 
  onChange, 
  coins, 
  noBox = false,
  placeholder = 'Select coin' 
}: Props) {
  const selected = coins.find((c) => c.symbol === value)

  return (
    <div className="relative inline-block w-fit">
      <div className={`flex items-center ${noBox ? '' : 'border border-gray-300 rounded-lg px-3 py-2'}`}>
        {selected?.iconUrl && (
          <img
            src={selected.iconUrl}
            alt={selected.symbol}
            className="w-5 h-5 mr-2 rounded-full"
          />
        )}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`appearance-none bg-transparent pr-6 font-semibold text-gray-800 text-sm focus:outline-none ${
            noBox ? '' : 'w-full'
          }`}
        >
          <option value="">{placeholder}</option>
          {coins.map((coin) => (
            <option key={coin.id} value={coin.symbol}>
              {coin.symbol}
            </option>
          ))}
        </select>

        {/* Chevron icon */}
        <div className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
          <ChevronDown size={16} />
        </div>
      </div>

      {/* Optional description */}
      {selected && (
        <p className="text-xs text-gray-500 mt-1 ml-1">{selected.name}</p>
      )}
    </div>
  )
}