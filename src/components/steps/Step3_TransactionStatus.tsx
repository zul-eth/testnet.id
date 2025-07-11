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
}

export default function Step3_TransactionStatus({ data }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(data.address)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="px-4 pt-6 pb-16 max-w-md mx-auto text-sm">
      <h2 className="text-lg font-bold text-gray-800 mb-2">Transaction in progress</h2>
      <p className="text-gray-600 mb-4">
        Your transaction is currently in progress and everything is running smoothly.
      </p>

      {/* Transaction Details */}
      <div className="bg-white border rounded-xl p-4 shadow-sm mb-4">
        <div className="mb-2">
          <p className="text-gray-500">You send</p>
          <p className="text-lg font-semibold">{data.amount} {data.currency}</p>
        </div>
        <div className="mb-2">
          <p className="text-gray-500">You get</p>
          <p className="text-lg font-semibold">~ {data.receiveAmount} {data.receiveCurrency}</p>
        </div>
        <div className="mb-2">
          <p className="text-gray-500">Recipient address</p>
          <div className="flex items-center justify-between bg-gray-100 px-2 py-1 rounded">
            <span className="truncate">{data.address}</span>
            <button onClick={handleCopy} className="text-blue-600 text-xs ml-2 flex items-center">
              <IoIosCopy className="mr-1" />
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
        {data.txId && (
          <div className="mt-2 text-gray-500 text-xs">
            <strong>Tx ID:</strong> {data.txId}
          </div>
        )}
      </div>

      {/* Payment Action */}
      <button
        className="w-full bg-green-300 hover:bg-green-400 py-3 rounded-xl text-black font-bold text-base"
        onClick={() => alert('Proceeding to payment... (dummy)')}
      >
        Proceed to payment
      </button>

      {/* WalletConnect option */}
      <div className="mt-4 text-center text-sm text-gray-600">
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
  )
}
