'use client'

import Image from 'next/image'
import { GoChevronDown } from 'react-icons/go'

type CurrencyItem = {
  label: string
  name: string
  icon: string // path URL dari /public/crypto atau full URL
}

type Props = {
  value: string
  onChange: (val: string) => void
  items: CurrencyItem[]          // Ganti dari tipe statis ke dinamis
  noBox?: boolean
}

export default function CurrencyDropdown({ value, onChange, items, noBox }: Props) {
  const selected = items.find((opt) => opt.name === value || opt.label === value)

  return (
    <div className="w-fit">
      <div className="relative flex items-center">
        {selected?.icon && (
          <Image
            src={selected.icon}
            alt={selected.name}
            width={24}
            height={24}
            className="mr-2"
          />
        )}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`appearance-none bg-transparent text-base font-semibold text-gray-800 pr-6 ${
            noBox ? 'border-none outline-none focus:ring-0' : 'border border-gray-300 rounded-lg py-2 px-3'
          }`}
        >
          {items.map((currency) => (
            <option key={currency.name} value={currency.name}>
              {currency.name}
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