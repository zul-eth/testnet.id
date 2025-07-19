'use client'

import { useEffect, useState } from 'react'

interface Coin {
  id: string
  name: string
  symbol: string
}

interface Pair {
  id: string
  baseCoin: Coin
  quoteCoin: Coin
  priceBase: number
  priceQuote: number
  network: 'MAINNET' | 'TESTNET'
}

export default function AdminPairsPage() {
  const [pairs, setPairs] = useState<Pair[]>([])
  const [coins, setCoins] = useState<Coin[]>([])
  const [network, setNetwork] = useState<'MAINNET' | 'TESTNET'>('TESTNET')
  const [activeNetwork, setActiveNetwork] = useState<'MAINNET' | 'TESTNET'>('TESTNET')
  const [editId, setEditId] = useState<string | null>(null)

  const [baseCoinId, setBaseCoinId] = useState('')
  const [quoteCoinId, setQuoteCoinId] = useState('')
  const [priceBase, setPriceBase] = useState('')
  const [priceQuote, setPriceQuote] = useState('')

  // Fetch coins & pairs
  useEffect(() => {
    fetch(`/api/coins?network=${activeNetwork}`)
      .then(res => res.json())
      .then(data => setCoins(data))

    fetch(`/api/pairs?network=${activeNetwork}`)
      .then(res => res.json())
      .then(data => setPairs(data))
  }, [activeNetwork])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      baseCoinId,
      quoteCoinId,
      priceBase,
      priceQuote,
      network,
    }

    const endpoint = editId ? `/api/pairs/${editId}` : '/api/pairs'
    const method = editId ? 'PUT' : 'POST'

    const res = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      const result = await res.json()
      if (editId) {
        setPairs(prev => prev.map(p => (p.id === result.id ? result : p)))
      } else {
        setPairs(prev => [...prev, result])
      }

      resetForm()
    } else {
      const err = await res.text()
      alert('Gagal menyimpan pair: ' + err)
    }
  }

  const startEdit = (pair: Pair) => {
    setEditId(pair.id)
    setNetwork(pair.network)
    setBaseCoinId(pair.baseCoin.id)
    setQuoteCoinId(pair.quoteCoin.id)
    setPriceBase(pair.priceBase.toString())
    setPriceQuote(pair.priceQuote.toString())
  }

  const handleDelete = async (id: string) => {
    const confirm = window.confirm('Yakin ingin menghapus pair ini?')
    if (!confirm) return

    const res = await fetch(`/api/pairs/${id}`, { method: 'DELETE' })

    if (res.ok) {
      setPairs(prev => prev.filter(p => p.id !== id))
    } else {
      const err = await res.text()
      alert('Gagal menghapus pair: ' + err)
    }
  }

  const resetForm = () => {
    setEditId(null)
    setBaseCoinId('')
    setQuoteCoinId('')
    setPriceBase('')
    setPriceQuote('')
    setNetwork('TESTNET')
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Pair Management</h1>

      <form onSubmit={handleSubmit} className="border p-4 rounded-md space-y-3">
        <h2 className="text-lg font-semibold">{editId ? 'Edit Pair' : 'Tambah Pair'}</h2>

        <select value={baseCoinId} onChange={e => setBaseCoinId(e.target.value)} className="select select-bordered w-full" required>
          <option value="">Pilih Base Coin</option>
          {coins.map(c => (
            <option key={c.id} value={c.id}>{c.name} ({c.symbol})</option>
          ))}
        </select>

        <select value={quoteCoinId} onChange={e => setQuoteCoinId(e.target.value)} className="select select-bordered w-full" required>
          <option value="">Pilih Quote Coin</option>
          {coins.map(c => (
            <option key={c.id} value={c.id}>{c.name} ({c.symbol})</option>
          ))}
        </select>

        <input
          type="number"
          step="0.0001"
          placeholder="Harga Dasar"
          value={priceBase}
          onChange={e => setPriceBase(e.target.value)}
          className="input input-bordered w-full"
          required
        />
        <input
          type="number"
          step="0.0001"
          placeholder="Harga Lawan"
          value={priceQuote}
          onChange={e => setPriceQuote(e.target.value)}
          className="input input-bordered w-full"
          required
        />

        <select value={network} onChange={e => setNetwork(e.target.value as 'MAINNET' | 'TESTNET')} className="select select-bordered w-full">
          <option value="TESTNET">Testnet</option>
          <option value="MAINNET">Mainnet</option>
        </select>

        <div className="flex gap-3">
          <button type="submit" className="btn btn-primary">{editId ? 'Update' : 'Simpan'}</button>
          {editId && <button type="button" onClick={resetForm} className="btn btn-ghost">Batal</button>}
        </div>
      </form>

      <div className="flex gap-4 items-center">
        <span className="font-medium">Tampilkan:</span>
        <button
          onClick={() => setActiveNetwork('TESTNET')}
          className={`btn ${activeNetwork === 'TESTNET' ? 'btn-primary' : 'btn-outline'}`}
        >
          Testnet
        </button>
        <button
          onClick={() => setActiveNetwork('MAINNET')}
          className={`btn ${activeNetwork === 'MAINNET' ? 'btn-primary' : 'btn-outline'}`}
        >
          Mainnet
        </button>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Daftar Pair ({activeNetwork})</h2>
        <table className="table w-full border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th>Base</th>
              <th>Quote</th>
              <th>Harga Dasar</th>
              <th>Harga Lawan</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pairs.map(pair => (
              <tr key={pair.id}>
                <td>{pair.baseCoin.symbol}</td>
                <td>{pair.quoteCoin.symbol}</td>
                <td>{pair.priceBase}</td>
                <td>{pair.priceQuote}</td>
                <td className="flex gap-2">
                  <button onClick={() => startEdit(pair)} className="btn btn-xs btn-outline">Edit</button>
                  <button onClick={() => handleDelete(pair.id)} className="btn btn-xs btn-error">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}