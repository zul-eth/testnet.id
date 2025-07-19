'use client'

import { HiOutlineInformationCircle } from 'react-icons/hi'
import { FormState } from '@/types/form'
import CurrencyDropdown from '@/components/shared/CurrencyDropdown'
import { useEffect, useState } from 'react'

type Props = {
  data: FormState
  onChange: (form: FormState) => void
  onNext: () => void
}

export default function Step1_ExchangeForm({ data, onChange, onNext }: Props) {
  const [stableCoins, setStableCoins] = useState([])
  const [cryptoCoins, setCryptoCoins] = useState([])
  const [loading, setLoading] = useState(true)

  // Ambil data koin dari API
  useEffect(() => {
    const fetchCoins = async () => {
      const [sendRes, receiveRes] = await Promise.all([
        fetch('/api/supported-send-coins'),
        fetch('/api/supported-receive-coins')
      ])
      const sendData = await sendRes.json()
      const receiveData = await receiveRes.json()
      setStableCoins(sendData)
      setCryptoCoins(receiveData)
      setLoading(false)
    }
    fetchCoins()
  }, [])

  // Hitung estimasi receiveAmount dari API rate
  const handleAmountChange = async (amount: string) => {
    const amountNum = parseFloat(amount)
    let estimated = ''

    if (!isNaN(amountNum) && data.currency && data.receiveCurrency) {
      try {
        const res = await fetch(`/api/rates?from=${data.currency}&to=${data.receiveCurrency}`)
        const rateData = await res.json()
        if (rateData?.rate) {
          estimated = (amountNum * rateData.rate).toFixed(6)
        }
      } catch (err) {
        console.error('Error fetching rate:', err)
      }
    }

    onChange({ ...data, amount, receiveAmount: estimated })
  }

  const isValid = data.amount && parseFloat(data.amount) > 0

  if (loading) {
    return (
      <div className="text-center text-gray-400 p-6">Loading coins...</div>
    )
  }

  return (
    <div className="px-4 py-6 max-w-md mx-auto text-sm bg-[#f9f9fb] min-h-screen">
      {/* Deskripsi Step */}
      <div className="mb-3 text-gray-600 text-sm leading-relaxed">
        Langkah pertama, pilih pasangan stablecoin dan crypto yang ingin kamu tukarkan. 
        Masukkan jumlah untuk melihat estimasi jumlah yang akan kamu dapatkan.
      </div>

      {/* Card Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
        <h2 className="text-base font-semibold text-gray-800 mb-4">
          Select pair <span className="text-blue-500 font-bold">1/3</span>
        </h2>

        {/* You Send */}
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">You send</p>
          <div className="flex items-center justify-between">
            <CurrencyDropdown
              value={data.currency}
              onChange={(val) => {
                onChange({ ...data, currency: val })
                handleAmountChange(data.amount)
              }}
              items={stableCoins}
              noBox
            />
            <input
              type="number"
              inputMode="decimal"
              className="w-1/2 text-right text-lg font-semibold text-gray-800 bg-transparent outline-none focus:outline-none placeholder:text-gray-400"
              placeholder="You send"
              value={data.amount}
              onChange={(e) => handleAmountChange(e.target.value)}
            />
          </div>
        </div>

        <div className="border-t border-gray-300 my-4 opacity-70" />

        {/* You Get */}
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">You get</p>
          <div className="flex items-center justify-between">
            <CurrencyDropdown
              value={data.receiveCurrency}
              onChange={(val) => {
                onChange({ ...data, receiveCurrency: val })
                handleAmountChange(data.amount)
              }}
              items={cryptoCoins}
              noBox
            />
            <div className="text-right text-gray-800 font-semibold text-lg flex items-center gap-2">
              {data.receiveAmount ? `~ ${data.receiveAmount}` : 'You get'}
              {data.receiveAmount && (
                <span className="text-xs font-semibold bg-gray-200 text-gray-800 px-2 py-0.5 rounded">
                  {data.receiveCurrency}
                </span>
              )}
            </div>
          </div>

          {!data.receiveAmount && (
            <p className="mt-2 flex items-center text-xs text-purple-600">
              <HiOutlineInformationCircle className="mr-1 text-base" />
              Enter the amount to view the offers
            </p>
          )}
        </div>

        {/* Button */}
        <button
          onClick={onNext}
          disabled={!isValid}
          className={`w-full py-3 mt-2 rounded-xl text-base font-semibold ${
            isValid
              ? 'bg-green-300 hover:bg-green-400 text-black'
              : 'bg-green-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Next step
        </button>

        {/* Promo */}
        <div className="mt-4 text-center text-sm">
          <span className="inline-flex items-center justify-center text-green-500 font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-blue-500 mr-1"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M5 3a1 1 0 00-1 1v2a2 2 0 002 2h1v6H6a2 2 0 00-2 2v2a1 1 0 001 1h14a1 1 0 001-1v-2a2 2 0 00-2-2h-1V8h1a2 2 0 002-2V4a1 1 0 00-1-1H5z" />
            </svg>
            <a href="#" className="underline">I have a promo code</a>
          </span>
        </div>
      </div>
    </div>
  )
}