'use client'

import { useEffect, useState } from 'react'

interface Coin {
  id: string
  name: string
  symbol: string
}

interface PaymentRoute {
  id: string
  coinId: string
  coin: Coin
  protocol: string
  address: string
  network: 'MAINNET' | 'TESTNET'
}

export default function AdminPaymentPage() {
  const [routes, setRoutes] = useState<PaymentRoute[]>([])
  const [coinId, setCoinId] = useState('')
  const [protocol, setProtocol] = useState('')
  const [address, setAddress] = useState('')
  const [network, setNetwork] = useState<'TESTNET' | 'MAINNET'>('TESTNET')
  const [coins, setCoins] = useState<Coin[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const [coinRes, routeRes] = await Promise.all([
        fetch(`/api/coins?network=${network}`),
        fetch(`/api/payment?network=${network}`),
      ])
      const coinsData = await coinRes.json()
      const routesData = await routeRes.json()
      setCoins(coinsData)
      setRoutes(routesData)
      setLoading(false)
    }
    fetchData()
  }, [network])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!coinId || !protocol || !address) {
      return alert('Semua field wajib diisi')
    }

    const res = await fetch('/api/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coinId, protocol, address, network }),
    })

    if (res.ok) {
      const newRoute = await res.json()
      setRoutes(prev => [newRoute, ...prev])
      // Reset form
      setCoinId('')
      setProtocol('')
      setAddress('')
    } else {
      const err = await res.json()
      alert('Gagal menyimpan:\n' + err?.detail || 'Unknown error')
    }
  }

  const handleDelete = async (id: string) => {
    const confirmDel = confirm('Yakin hapus payment route ini?')
    if (!confirmDel) return

    const res = await fetch(`/api/payment/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setRoutes(prev => prev.filter(route => route.id !== id))
    } else {
      alert('Gagal menghapus route')
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Payment Route Management</h1>

      <form onSubmit={handleSubmit} className="space-y-3 border p-4 rounded-md max-w-lg">
        <h2 className="text-lg font-semibold">Tambah Payment Route</h2>

        <select
          value={coinId}
          onChange={e => setCoinId(e.target.value)}
          className="select select-bordered w-full"
          required
        >
          <option value="">Pilih Coin</option>
          {coins.map(coin => (
            <option key={coin.id} value={coin.id}>
              {coin.symbol} - {coin.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Protocol (contoh: EVM, Solana, Tron)"
          value={protocol}
          onChange={e => setProtocol(e.target.value)}
          className="input input-bordered w-full"
          required
        />

        <input
          type="text"
          placeholder="Payment Address"
          value={address}
          onChange={e => setAddress(e.target.value)}
          className="input input-bordered w-full"
          required
        />

        <select
          value={network}
          onChange={(e) => setNetwork(e.target.value as 'TESTNET' | 'MAINNET')}
          className="select select-bordered w-full"
        >
          <option value="TESTNET">Testnet</option>
          <option value="MAINNET">Mainnet</option>
        </select>

        <button type="submit" className="btn btn-primary">Simpan Route</button>
      </form>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Daftar Payment Routes ({network})</h2>

        {loading ? (
          <p>Loading...</p>
        ) : routes.length === 0 ? (
          <p className="text-gray-500">Belum ada data.</p>
        ) : (
          <table className="table w-full border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th>Coin</th>
                <th>Protocol</th>
                <th>Address</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((route) => (
                <tr key={route.id}>
                  <td>{route.coin.symbol}</td>
                  <td>{route.protocol}</td>
                  <td className="text-xs font-mono break-all">{route.address}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(route.id)}
                      className="btn btn-xs btn-error"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}