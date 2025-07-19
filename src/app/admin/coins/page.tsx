'use client'

import { useEffect, useState } from 'react'

interface Coin {
  id: string
  name: string
  symbol: string
  iconUrl: string
  network: 'MAINNET' | 'TESTNET'
}

export default function AdminCoinsPage() {
  const [coins, setCoins] = useState<Coin[]>([])
  const [name, setName] = useState('')
  const [label, setLabel] = useState('')
  const [icon, setIcon] = useState<File | null>(null)
  const [network, setNetwork] = useState<'MAINNET' | 'TESTNET'>('TESTNET')
  const [activeNetwork, setActiveNetwork] = useState<'MAINNET' | 'TESTNET'>('TESTNET')
  const [editId, setEditId] = useState<string | null>(null)

  const startEdit = (coin: Coin) => {
    setEditId(coin.id)
    setName(coin.name)
    setLabel(coin.symbol)
    setNetwork(coin.network)
    setIcon(null) // biarkan user pilih icon baru kalau mau
  }

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm('Yakin ingin menghapus coin ini?')
    if (!confirmDelete) return

    const res = await fetch(`/api/coins/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setCoins(prev => prev.filter(c => c.id !== id))
    } else {
      const err = await res.text()
      alert('Gagal menghapus coin:\n' + err)
    }
  }

  useEffect(() => {
    fetch(`/api/coins?network=${activeNetwork}`)
      .then(res => res.json())
      .then(data => setCoins(data))
  }, [activeNetwork])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!icon && !editId) return alert('Pilih ikon terlebih dahulu.')

    const formData = new FormData()
    formData.append('name', name)
    formData.append('label', label)
    formData.append('network', network)
    if (icon) formData.append('icon', icon)

    const endpoint = editId ? `/api/coins/${editId}` : '/api/coins'
    const method = editId ? 'PUT' : 'POST'

    const res = await fetch(endpoint, {
      method,
      body: formData,
    })

    if (res.ok) {
      const resultCoin = await res.json()
      if (editId) {
        setCoins(prev => prev.map(c => (c.id === resultCoin.id ? resultCoin : c)))
      } else {
        setCoins(prev => [...prev, resultCoin])
      }

      // reset form
      setEditId(null)
      setName('')
      setLabel('')
      setIcon(null)
      setNetwork('TESTNET')
    } else {
      const errText = await res.text()
      alert('Gagal menyimpan koin.\n\n' + errText)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Coin Management</h1>

      <form onSubmit={handleSubmit} className="border p-4 rounded-md space-y-3">
        <h2 className="text-lg font-semibold">{editId ? 'Edit Coin' : 'Tambah Coin'}</h2>
        <input
          type="text"
          placeholder="Nama Coin"
          value={name}
          onChange={e => setName(e.target.value)}
          className="input input-bordered w-full"
          required
        />
        <input
          type="text"
          placeholder="Label (contoh: ETH)"
          value={label}
          onChange={e => setLabel(e.target.value)}
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
        <input
          type="file"
          accept="image/*"
          onChange={e => setIcon(e.target.files?.[0] || null)}
          className="file-input w-full"
        />
        <button type="submit" className="btn btn-primary">
          {editId ? 'Update' : 'Simpan'}
        </button>
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
        <h2 className="text-lg font-semibold mb-2">Daftar Coin ({activeNetwork})</h2>
        <table className="table w-full border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th>Icon</th>
              <th>Nama</th>
              <th>Label</th>
              <th>Network</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {coins.map((coin) => (
              <tr key={coin.id}>
                <td>
                  <img
                    src={coin.iconUrl}
                    alt={coin.symbol}
                    className="w-8 h-8"
                  />
                </td>
                <td>{coin.name}</td>
                <td>{coin.symbol}</td>
                <td>{coin.network}</td>
                <td className="flex gap-2">
                  <button onClick={() => startEdit(coin)} className="btn btn-xs btn-outline">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(coin.id)} className="btn btn-xs btn-error">
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}