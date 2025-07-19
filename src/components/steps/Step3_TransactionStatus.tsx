'use client'

import { useEffect, useState } from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import { IoIosCopy } from 'react-icons/io'

type Props = {
  data: {
    amount: string
    currency: string
    receiveAmount: string
    receiveCurrency: string
    address: string
    txId?: string
  }
  onBack: () => void
  onCancel: () => void
}

export default function Step3_TransactionStatus({ data, onBack, onCancel }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(data.address)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="px-4 pt-6 pb-16 max-w-md mx-auto text-sm bg-[#f9f9fb] min-h-screen">

      {/* Deskripsi Step */}
      <div className="mb-4 text-gray-600 text-sm leading-relaxed">
        Proses transaksi sedang berlangsung. Silakan lanjutkan pembayaran
        atau hubungkan wallet Anda untuk menyelesaikan swap secara on-chain.
      </div>

      {/* Card Utama */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">

        {/* Back & Cancel */}
        <div className="flex justify-between items-center mb-3">
          <button className="text-sm text-blue-600 font-medium" onClick={onBack}>
            ← Back
          </button>
          <button
            className="text-sm text-red-500 font-medium"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>

        {/* Judul */}
        <h2 className="text-base font-semibold text-gray-800 mb-1">
          Transaction in progress <span className="text-blue-500">3/3</span>
        </h2>

        {/* Rincian Transaksi */}
        <div className="mb-3">
          <p className="text-gray-500">You send</p>
          <p className="text-lg font-semibold">{data.amount} {data.currency}</p>
        </div>
        <div className="mb-3">
          <p className="text-gray-500">You get</p>
          <p className="text-lg font-semibold">~ {data.receiveAmount} {data.receiveCurrency}</p>
        </div>
        <div className="mb-3">
          <p className="text-gray-500">Recipient address</p>
          <div className="flex items-center justify-between bg-gray-100 px-2 py-1 rounded">
            <span className="truncate">{data.address}</span>
            <button onClick={handleCopy} className="text-blue-600 text-xs ml-2 flex items-center">
              <IoIosCopy className="mr-1" />
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* TX ID jika ada */}
        {data.txId && (
          <div className="mt-1 text-gray-500 text-xs">
            <strong>Tx ID:</strong> {data.txId}
          </div>
        )}

        {/* Tombol Payment */}
        <button
          className="w-full mt-5 bg-green-300 hover:bg-green-400 py-3 rounded-xl text-black font-bold text-base"
          onClick={() => alert('Proceeding to payment... (dummy)')}
        >
          Proceed to payment
        </button>

        {/* WalletConnect */}
        <div className="mt-5 text-center text-sm text-gray-600">
          <p>Prefer to pay via wallet?</p>
          <button
            className="mt-2 w-full bg-white border border-gray-300 rounded-lg py-2 flex items-center justify-center hover:shadow-sm"
            onClick={() => window.open('https://www.okx.com/web3', '_blank')}
          >
            <img src="/crypto/eth.png" alt="Wallet" className="w-5 h-5 mr-2" />
            Connect via OKX Wallet
          </button>
        </div>
      </div>
    </div>
  )
}