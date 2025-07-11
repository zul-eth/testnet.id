'use client'

import Image from 'next/image'
import InputField from '../shared/InputField'
import { HiArrowNarrowRight } from 'react-icons/hi'

type Props = {
  data: any
  onChange: (form: any) => void
  onNext: () => void
  onBack: () => void
}

export default function Step2_AddressForm({ data, onChange, onNext, onBack }: Props) {
  return (
    <div className="max-w-md mx-auto px-4 py-6 bg-white rounded-xl shadow">
      {/* Back Button */}
      <button className="text-sm mb-3 text-blue-600 font-medium" onClick={onBack}>
        ← Back
      </button>

      {/* Title + Progress */}
      <h2 className="text-lg font-semibold text-gray-800 mb-1">Enter address <span className="text-blue-500">2/3</span></h2>
      <div className="w-full h-1 mb-4 rounded-full bg-blue-100 overflow-hidden">
        <div className="h-1 bg-blue-500 w-2/3 rounded-full" />
      </div>

      {/* Exchange Summary */}
      <div className="bg-gray-100 rounded-lg px-4 py-3 mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">You send {data.amount} {data.currency}</p>
          <p className="text-sm text-gray-500">You get ~ {data.receiveAmount} {data.receiveCurrency}</p>
        </div>
        <HiArrowNarrowRight className="text-2xl text-green-500" />
      </div>

      {/* Destination Address Input */}
      <InputField
        label={`Destination address (${data.receiveCurrency})`}
        value={data.address}
        onChange={(val) => onChange({ ...data, address: val })}
        placeholder="0xABC... or recipient address"
      />

      {/* Info */}
      <p className="text-xs text-gray-500 mt-2">
        Please make sure the address supports {data.receiveCurrency}. This will be the target of your on-chain swap.
      </p>

      {/* Submit */}
      <button
        onClick={onNext}
        disabled={!data.address}
        className={`w-full mt-4 py-3 rounded-xl text-lg font-bold ${
          data.address
            ? 'bg-green-300 hover:bg-green-400 text-black'
            : 'bg-green-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        Next step
      </button>
    </div>
  )
}
