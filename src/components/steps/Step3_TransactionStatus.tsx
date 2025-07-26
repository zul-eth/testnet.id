'use client'

import { useEffect, useState } from 'react'
import { Copy, Clock } from 'lucide-react'

interface FormState {
  amount: string
  baseCoinSymbol: string
  quoteCoinSymbol: string
  receiveAmount: string
  address: string
  network: 'TESTNET' | 'MAINNET'
  pairId?: string
  paymentRouteId?: string
  paymentAddress?: string // Tambahkan
  protocol?: string       // Tambahkan
  orderId?: string
  orderHash?: string
}

interface Props {
  data: FormState
  onBack: () => void
  onCancel: () => void
}

export default function Step3_TransactionStatus({ data, onBack, onCancel }: Props) {
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState(15 * 60) // 15 minutes
  const [paymentAddress, setPaymentAddress] = useState<string>(data.paymentAddress || '')
  const [protocol, setProtocol] = useState<string>(data.protocol || '')

  // Jika paymentAddress/protocol belum diisi, fetch order detail (misal, order baru dibuat di Step 2)
  useEffect(() => {
    // Asumsi orderHash sudah ada setelah Step 2
    if ((!paymentAddress || !protocol) && data.orderHash) {
      fetch(`/api/orders/${data.orderHash}`)
        .then(res => res.json())
        .then(order => {
          if (order.paymentAddress) {
            setPaymentAddress(order.paymentAddress)
          } else if (order.paymentRoute) {
            setPaymentAddress(order.paymentRoute.address)
          }
          if (order.paymentRoute) {
            setProtocol(order.paymentRoute.protocol)
          }
        })
    }
  }, [data.orderHash, paymentAddress, protocol])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  if (!data.orderId || !data.orderHash) {
    return (
      <div className="p-6 text-center text-red-500 font-medium">
        ❌ Order not found. Please go back and try again.
      </div>
    )
  }

  return (
    <div className="px-4 pt-6 pb-16 max-w-md mx-auto text-sm bg-[#f9f9fb] min-h-screen">
      <div className="mb-4 text-gray-600 text-sm leading-relaxed">
        Order berhasil dibuat! Silakan kirim pembayaran ke alamat yang tertera di bawah ini.
        Transaksi akan diproses secara otomatis setelah pembayaran diterima.
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
        {/* Top Nav */}
        <div className="flex justify-between items-center mb-3">
          <button className="text-sm text-blue-600 font-medium" onClick={onBack}>
            ← Back
          </button>
          <button className="text-sm text-red-500 font-medium" onClick={onCancel}>
            Cancel Order
          </button>
        </div>

        {/* Header */}
        <h2 className="text-base font-semibold text-gray-800 mb-1">
          Waiting for payment <span className="text-blue-500">3/3</span>
        </h2>

        {/* Countdown */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="w-4 h-4 text-orange-600 mr-2" />
            <span className="text-sm text-orange-800">Time remaining</span>
          </div>
          <span className="font-mono font-bold text-orange-800">
            {formatTime(timeLeft)}
          </span>
        </div>

        {/* Order Detail */}
        <div className="space-y-3 mb-4">
          <div>
            <p className="text-gray-500 text-xs">Order Hash</p>
            <div className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded">
              <span className="font-mono text-xs truncate">{data.orderHash}</span>
              <button 
                onClick={() => handleCopy(data.orderHash || '')} 
                className="text-blue-600 text-xs ml-2 flex items-center"
              >
                <Copy className="w-3 h-3 mr-1" />
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div>
            <p className="text-gray-500 text-xs">Network</p>
            <p className="text-sm font-medium">{data.network}</p>
          </div>

          <div>
            <p className="text-gray-500 text-xs">You send</p>
            <p className="text-lg font-semibold">{data.amount} {data.baseCoinSymbol}</p>
          </div>

          <div>
            <p className="text-gray-500 text-xs">You will receive</p>
            <p className="text-lg font-semibold">~ {data.receiveAmount} {data.quoteCoinSymbol}</p>
          </div>

          <div>
            <p className="text-gray-500 text-xs">To address</p>
            <div className="bg-gray-100 px-3 py-2 rounded">
              <span className="text-xs font-mono break-all">{data.address}</span>
            </div>
          </div>
        </div>

        {/* Payment Address */}
        {paymentAddress && (
          <div className="mb-4">
            <p className="text-gray-500 text-xs mb-1">Send payment to address below:</p>
            <div className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded mb-1">
              <span className="font-mono text-xs break-all">{paymentAddress}</span>
              <button 
                onClick={() => handleCopy(paymentAddress)}
                className="text-blue-600 text-xs ml-2 flex items-center"
              >
                <Copy className="w-3 h-3 mr-1" />
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            {protocol && (
              <span className="text-xs text-gray-500">
                Network/Protocol: <b>{protocol}</b>
              </span>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-blue-900 mb-2">Payment Instructions:</h3>
          <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
            <li>
              Send exactly <strong>{data.amount} {data.baseCoinSymbol}</strong> to the payment address above
            </li>
            <li>Use <strong>{protocol || data.network}</strong> network only</li>
            <li>Payment will be detected automatically</li>
            <li>You will receive {data.quoteCoinSymbol} at the address provided</li>
          </ol>
        </div>

        {/* Status */}
        <div className="text-center text-sm text-gray-600">
          <div className="flex items-center justify-center mb-2">
            <div className="animate-pulse w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
            <span>Waiting for payment...</span>
          </div>
          <p className="text-xs text-gray-500">
            Order link: 
            <a 
              href={`/order?hash=${data.orderHash}`} 
              className="text-blue-600 ml-1 underline"
              target="_blank"
            >
              View order status
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}