'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

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
  status: string
  expiresAt: string
  createdAt: string
}

export default function OrderPage() {
  const searchParams = useSearchParams()
  const hash = searchParams.get('hash')

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!hash) return

    fetch(`/api/orders/${hash}`)
      .then(res => {
        if (!res.ok) throw new Error('Order tidak ditemukan')
        return res.json()
      })
      .then(data => {
        setOrder(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [hash])

  if (!hash) return <div className="p-6">Order hash tidak ditemukan di URL.</div>
  if (loading) return <div className="p-6">Memuat detail order...</div>
  if (error) return <div className="p-6 text-red-500">Gagal: {error}</div>
  if (!order) return null

  const { baseCoin, quoteCoin } = order.pair

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Detail Order</h1>

      <div className="border rounded-md p-4 space-y-2">
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Network:</strong> {order.network}</p>
        <p><strong>Order Hash:</strong> {order.orderHash}</p>
        <p><strong>Pair:</strong> {baseCoin.symbol} → {quoteCoin.symbol}</p>
        <p><strong>Jumlah Kirim:</strong> {order.amount} {baseCoin.symbol}</p>
        <p><strong>Alamat Tujuan:</strong> {order.addressDestination}</p>
        <p><strong>Kadaluarsa:</strong> {new Date(order.expiresAt).toLocaleString()}</p>
      </div>

      <div className="border rounded-md p-4">
        <h2 className="font-semibold mb-2">Info Pair</h2>
        <div className="flex items-center gap-4">
          <img src={baseCoin.iconUrl} alt={baseCoin.symbol} className="w-8 h-8" />
          <span>{baseCoin.name} ({baseCoin.symbol})</span>
        </div>
        <div className="flex items-center gap-4 mt-2">
          <img src={quoteCoin.iconUrl} alt={quoteCoin.symbol} className="w-8 h-8" />
          <span>{quoteCoin.name} ({quoteCoin.symbol})</span>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          1 {baseCoin.symbol} ≈ {order.pair.priceQuote / order.pair.priceBase} {quoteCoin.symbol}
        </p>
      </div>
    </div>
  )
}