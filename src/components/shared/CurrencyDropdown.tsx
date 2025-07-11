'use client'

import Image from 'next/image'
import { GoChevronDown } from 'react-icons/go'
import { CurrencyCode } from '@/types/form'
import { supportedCoins, supportedStableCoins } from '@/utils/currencies'

type Props = {
  value: CurrencyCode
  onChange: (val: CurrencyCode) => void
  type: 'coin' | 'stable'
  noBox?: boolean
}

export default function CurrencyDropdown({ value, onChange, type, noBox }: Props) {
  const options = type === 'stable' ? supportedStableCoins : supportedCoins
  const selected = options.find((opt) => opt.value === value)

  return (
    <div className="w-fit">
      <div className="relative flex items-center">
        <Image
          src={`/crypto/${value.toLowerCase()}.png`}
          alt={value}
          width={24}
          height={24}
          className="mr-2"
        />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as CurrencyCode)}
          className={`appearance-none bg-transparent text-base font-semibold text-gray-800 pr-6 ${
            noBox ? 'border-none outline-none focus:ring-0' : 'border border-gray-300 rounded-lg py-2 px-3'
          }`}
        >
          {options.map((currency) => (
            <option key={currency.value} value={currency.value}>
              {currency.value}
            </option>
          ))}
        </select>
        <div className="absolute right-1 pointer-events-none text-gray-500">
          <GoChevronDown size={16} />
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-1">{selected?.label}</p>
    </div>
  )
}
