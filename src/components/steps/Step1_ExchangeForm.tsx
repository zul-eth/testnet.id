'use client'

import { HiOutlineInformationCircle } from 'react-icons/hi'
import { FormState } from '@/types/form'
import CurrencyDropdown from '@/components/shared/CurrencyDropdown'
import { supportedStableCoins, supportedCoins } from '@/utils/currencies'
type Props = {
  data: FormState
  onChange: (form: FormState) => void
  onNext: () => void
}

export default function Step1_ExchangeForm({ data, onChange, onNext }: Props) {
  const isValid = data.amount && parseFloat(data.amount) > 0

  return (
    <div className="px-4 pt-4 pb-16 max-w-md mx-auto text-sm bg-[#f9f9fb] min-h-screen">
      {/* Step header */}
      <div className="mb-4">
        <h2 className="text-base font-semibold text-gray-800">
          Select pair <span className="text-blue-500 font-bold">1/3</span>
        </h2>
        <div className="w-full h-1 mt-1 rounded-full bg-blue-100 overflow-hidden">
          <div className="h-1 bg-blue-500 w-1/3 rounded-full" />
        </div>
      </div>

      {/* You Send */}
      <div className="mb-4 p-4 rounded-2xl border border-gray-200 bg-white shadow-sm">
        <p className="text-sm text-gray-500 mb-2">You send</p>
        <div className="flex items-center justify-between">
          <CurrencyDropdown
            value={data.currency}
            onChange={(val) => onChange({ ...data, currency: val })}
            type="stable"
            noBox
          />
          <input
            type="number"
            inputMode="decimal"
            className="w-1/2 text-right text-lg font-semibold text-gray-800 bg-transparent outline-none focus:outline-none placeholder:text-gray-400"
            placeholder="You send"
            value={data.amount}
            onChange={(e) => onChange({ ...data, amount: e.target.value })}
          />
        </div>
        <p className="mt-1 text-xs text-gray-400">
            {[...supportedStableCoins, ...supportedCoins].find(c => c.value === data.currency)?.label}
        </p>
      </div>
      
      

      {/* You Get */}
      <div className="mb-4 p-4 rounded-2xl border border-gray-200 bg-gray-50 shadow-sm">
        <p className="text-sm text-gray-500 mb-2">You get</p>
        <div className="flex items-center justify-between">
          <CurrencyDropdown
            value={data.receiveCurrency}
            onChange={(val) => onChange({ ...data, receiveCurrency: val })}
            type="coin"
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

      {/* Next Step */}
      <button
        onClick={onNext}
        disabled={!isValid}
        className={`w-full py-3 mt-4 rounded-xl text-base font-semibold ${
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
  )
}
