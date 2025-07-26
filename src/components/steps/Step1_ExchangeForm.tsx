'use client'

import { useEffect, useState } from 'react'
import { Info } from 'lucide-react'
import CurrencyDropdown from '@/components/shared/CurrencyDropdown'

interface Coin {
  id: string
  name: string
  symbol: string
  iconUrl: string
}

interface Pair {
  id: string
  baseCoin: Coin
  quoteCoin: Coin
  priceBase: number
  priceQuote: number
}

const PROTOCOLS = ['EVM', 'SOLANA']

interface FormState {
  amount: string
  baseCoinSymbol: string
  quoteCoinSymbol: string
  receiveAmount: string
  address: string
  network: 'TESTNET' | 'MAINNET'
  pairId?: string
  protocol?: string
}

interface Props {
  data: FormState
  onChange: (form: FormState) => void
  onNext: () => void
}

export default function Step1_ExchangeForm({ data, onChange, onNext }: Props) {
  const [pairs, setPairs] = useState<Pair[]>([])
  const [selectedPair, setSelectedPair] = useState<Pair | null>(null)
  const [loading, setLoading] = useState(true)

  // Ambil data pair berdasarkan network
  useEffect(() => {
    const fetchPairs = async () => {
      try {
        const res = await fetch(`/api/pairs?network=${data.network}`)
        if (!res.ok) throw new Error('Failed to fetch pairs')
        const pairsData = await res.json()
        setPairs(pairsData)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching pairs:', error)
        setLoading(false)
      }
    }
    fetchPairs()
  }, [data.network])

  // Update selectedPair saat symbol berubah
  useEffect(() => {
    const pair = pairs.find(
      p => p.baseCoin.symbol === data.baseCoinSymbol &&
           p.quoteCoin.symbol === data.quoteCoinSymbol
    )

    if (pair) {
      setSelectedPair(pair)
      onChange({ ...data, pairId: pair.id })
      if (data.amount) {
        calculateReceiveAmount(data.amount, pair)
      }
    } else {
      setSelectedPair(null)
      onChange({ ...data, pairId: undefined, receiveAmount: '', protocol: undefined })
    }
  }, [data.baseCoinSymbol, data.quoteCoinSymbol, pairs])

  // Reset protocol when pair changes
  useEffect(() => {
    if (!data.pairId) {
      onChange({ ...data, protocol: undefined })
    }
  }, [data.pairId])

  // Hitung estimasi receiveAmount
  const calculateReceiveAmount = (amount: string, pair: Pair | null) => {
    if (!pair || !amount || isNaN(parseFloat(amount))) {
      onChange({ ...data, amount, receiveAmount: '' })
      return
    }
    const amountNum = parseFloat(amount)
    const rate = pair.priceQuote / pair.priceBase
    const receiveAmount = (amountNum * rate).toFixed(6)
    onChange({
      ...data,
      amount,
      receiveAmount,
    })
  }

  const handleAmountChange = (amount: string) => {
    calculateReceiveAmount(amount, selectedPair)
  }

  // Ambil baseCoin & quoteCoin unik
  const baseCoins = [...new Map(pairs.map(p => [p.baseCoin.id, p.baseCoin])).values()]
  const quoteCoins = [...new Map(pairs.map(p => [p.quoteCoin.id, p.quoteCoin])).values()]

  const isValid = data.amount && parseFloat(data.amount) > 0 && data.pairId && data.protocol

  if (loading) {
    return (
      <div className="text-center text-gray-400 p-6">Loading pairs...</div>
    )
  }

  return (
    <div className="px-4 py-6 max-w-md mx-auto text-sm bg-[#f9f9fb] min-h-screen">
      <div className="mb-3 text-gray-600 text-sm leading-relaxed">
        Pilih pasangan crypto yang ingin ditukar dan masukkan jumlah untuk melihat estimasi.
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
        <h2 className="text-base font-semibold text-gray-800 mb-4">
          Select pair <span className="text-blue-500 font-bold">1/3</span>
        </h2>

        {/* Network */}
        <div className="mb-4">
          <label className="text-xs text-gray-500 mb-1 block">Network</label>
          <select
            value={data.network}
            onChange={(e) => onChange({ ...data, network: e.target.value as 'TESTNET' | 'MAINNET' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="TESTNET">Testnet</option>
            <option value="MAINNET">Mainnet</option>
          </select>
        </div>

        {/* You Send */}
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">You send</p>
          <div className="flex items-center justify-between">
            <CurrencyDropdown
              value={data.baseCoinSymbol}
              onChange={(val) => onChange({ ...data, baseCoinSymbol: val })}
              coins={baseCoins}
              placeholder="Select coin"
              noBox
            />
            <input
              type="number"
              inputMode="decimal"
              className="w-1/2 text-right text-lg font-semibold text-gray-800 bg-transparent outline-none placeholder:text-gray-400"
              placeholder="0.00"
              value={data.amount}
              onChange={(e) => handleAmountChange(e.target.value)}
            />
          </div>
        </div>

        {/* Payment Method */}
        <div className="mb-4">
          <label className="text-xs text-gray-500 mb-1 block">Payment Method</label>
          <select
            value={data.protocol || ''}
            onChange={e => onChange({ ...data, protocol: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">Select Method</option>
            {PROTOCOLS.map((p) => (
              <option key={p} value={p}>{p} ({data.network})</option>
            ))}
          </select>
        </div>

        <div className="border-t border-gray-300 my-4 opacity-70" />

        {/* You Get */}
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">You get</p>
          <div className="flex items-center justify-between">
            <CurrencyDropdown
              value={data.quoteCoinSymbol}
              onChange={(val) => onChange({ ...data, quoteCoinSymbol: val })}
              coins={quoteCoins}
              placeholder="Select coin"
              noBox
            />
            <div className="text-right text-gray-800 font-semibold text-lg">
              {data.receiveAmount || '0.00'}
            </div>
          </div>

          {selectedPair && (
            <p className="mt-2 text-xs text-gray-500">
              Rate: 1 {selectedPair.baseCoin.symbol} = {(selectedPair.priceQuote / selectedPair.priceBase).toFixed(4)} {selectedPair.quoteCoin.symbol}
            </p>
          )}

          {!data.receiveAmount && data.amount && (
            <p className="mt-2 flex items-center text-xs text-purple-600">
              <Info className="mr-1 w-4 h-4" />
              No matching pair found for selected coins
            </p>
          )}
        </div>

        <button
          onClick={onNext}
          disabled={!isValid}
          className={`w-full py-3 mt-2 rounded-xl text-base font-semibold transition-colors ${
            isValid
              ? 'bg-green-300 hover:bg-green-400 text-black'
              : 'bg-green-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Next step
        </button>
      </div>
    </div>
  )
}