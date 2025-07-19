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
  const isValid = data.address?.length > 0

  return (
    <div className="px-4 py-6 max-w-md mx-auto text-sm bg-[#f9f9fb] min-h-screen">

      {/* Deskripsi Step */}
      <div className="mb-3 text-gray-600 text-sm leading-relaxed">
        Langkah kedua, masukkan alamat wallet yang akan menerima aset kripto. 
        Pastikan alamat tersebut sesuai dengan jaringan dan jenis koin.
      </div>

      {/* Card Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">

        {/* Back Button */}
        <button className="text-sm mb-3 text-blue-600 font-medium" onClick={onBack}>
          ← Back
        </button>

        {/* Title */}
        <h2 className="text-base font-semibold text-gray-800 mb-4">
          Enter address <span className="text-blue-500">2/3</span>
        </h2>

        {/* Exchange Summary */}
        <div className="bg-gray-100 rounded-xl px-4 py-3 mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">You send {data.amount} {data.currency}</p>
            <p className="text-sm text-gray-500">You get ~ {data.receiveAmount} {data.receiveCurrency}</p>
          </div>
          <HiArrowNarrowRight className="text-2xl text-green-500" />
        </div>

        {/* Input Address */}
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

        {/* Button */}
        <button
          onClick={onNext}
          disabled={!isValid}
          className={`w-full mt-5 py-3 rounded-xl text-base font-semibold ${
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