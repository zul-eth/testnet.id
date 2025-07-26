'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface Coin {
  name: string
  symbol: string
  iconUrl: string
}


interface Pair {
  baseCoin: Coin
  quoteCoin: Coin
  priceBase: number
  priceQuote: number
}

interface Order {
  id: string
  orderHash: string
  network: 'TESTNET' | 'MAINNET'
  pair: Pair
  amount: number
  addressDestination: string
  status: 'PENDING' | 'CONFIRMED' | 'EXPIRED' | 'FAILED'
  expiresAt: string
  createdAt: string
  paymentAddress: string
  protocol: string
  history?: {
    txHash: string
    confirmedAt: string
  }
}

export default function OrderStatusPage() {
  const params = useParams()
  const hash = params.hash as string

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    if (!hash) return

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${hash}`)
        if (!res.ok) throw new Error('Order not found')

        const data = await res.json()
        setOrder(data)

        // Calculate time left
        const expiresAt = new Date(data.expiresAt).getTime()
        const now = new Date().getTime()
        const diff = Math.max(0, Math.floor((expiresAt - now) / 1000))
        setTimeLeft(diff)

        setLoading(false)
      } catch (err: any) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchOrder()
    // Refresh every 10 seconds
    const interval = setInterval(fetchOrder, 10000)
    return () => clearInterval(interval)
  }, [hash])

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0 || order?.status !== 'PENDING') return

    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1))
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, order?.status])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'CONFIRMED': return 'text-green-600 bg-green-50 border-green-200'
      case 'EXPIRED': return 'text-gray-600 bg-gray-50 border-gray-200'
      case 'FAILED': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="w-5 h-5" />
      case 'CONFIRMED': return <CheckCircle className="w-5 h-5" />
      case 'EXPIRED': return <XCircle className="w-5 h-5" />
      case 'FAILED': return <AlertCircle className="w-5 h-5" />
      default: return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-sm p-6 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-sm p-6 max-w-md w-full text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!order) return null

  const { baseCoin, quoteCoin } = order.pair
  const rate = order.pair.priceQuote / order.pair.priceBase
  const receiveAmount = (order.amount * rate).toFixed(6)

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Order Status</h1>

        {/* Status Badge */}
        <div className={`inline-flex items-center px-4 py-2 rounded-lg border ${getStatusColor(order.status)} mb-6`}>
          {getStatusIcon(order.status)}
          <span className="ml-2 font-semibold">{order.status}</span>
          {order.status === 'PENDING' && timeLeft > 0 && (
            <span className="ml-3 font-mono">{formatTime(timeLeft)}</span>
          )}
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
          <h2 className="text-lg font-semibold mb-4">Order Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Order ID</span>
              <span className="font-mono text-sm">{order.orderHash}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Network</span>
              <span className="font-medium">{order.network}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Created</span>
              <span>{new Date(order.createdAt).toLocaleString()}</span>
            </div>
            {order.status === 'PENDING' && (
              <div className="flex justify-between">
                <span className="text-gray-500">Expires</span>
                <span>{new Date(order.expiresAt).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Payment Instruction Card */}
        {order.paymentAddress && (
          <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-6 mb-4">
            <h2 className="text-lg font-semibold mb-4 text-blue-700">Payment Instruction</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Pay To</span>
                <span className="font-mono text-xs break-all">{order.paymentAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Protocol</span>
                <span className="font-medium">{order.protocol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Coin</span>
                <span className="font-medium">{baseCoin.symbol}</span>
              </div>
            </div>
            <div className="mt-4 text-xs text-blue-700 bg-blue-50 p-2 rounded">
              Kirim <b>{order.amount} {baseCoin.symbol}</b> ke alamat di atas menggunakan <b>{order.protocol}</b>. Order akan terkonfirmasi otomatis setelah pembayaran diterima.
            </div>
          </div>
        )}

        {/* Exchange Details Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
          <h2 className="text-lg font-semibold mb-4">Exchange Details</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-gray-500 text-sm">You send</p>
              <div className="flex items-center gap-3">
                <img src={baseCoin.iconUrl} alt={baseCoin.symbol} className="w-8 h-8 rounded-full" />
                <div>
                  <p className="font-semibold">{order.amount} {baseCoin.symbol}</p>
                  <p className="text-sm text-gray-500">{baseCoin.name}</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-gray-500 text-sm">You receive</p>
              <div className="flex items-center gap-3">
                <img src={quoteCoin.iconUrl} alt={quoteCoin.symbol} className="w-8 h-8 rounded-full" />
                <div>
                  <p className="font-semibold">~ {receiveAmount} {quoteCoin.symbol}</p>
                  <p className="text-sm text-gray-500">{quoteCoin.name}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Exchange rate: 1 {baseCoin.symbol} = {rate.toFixed(4)} {quoteCoin.symbol}
            </p>
          </div>
        </div>

        {/* Destination Address Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
          <h2 className="text-lg font-semibold mb-4">Destination Address</h2>
          <div className="bg-gray-50 p-3 rounded-lg break-all">
            <code className="text-sm">{order.addressDestination}</code>
          </div>
        </div>

        {/* Transaction History (if confirmed) */}
        {order.history && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Transaction History</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Transaction Hash</span>
                <span className="font-mono text-sm">{order.history.txHash}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Confirmed At</span>
                <span>{new Date(order.history.confirmedAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}