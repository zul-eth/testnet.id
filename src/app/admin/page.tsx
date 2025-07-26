import Link from 'next/link'

export default function AdminHomePage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      <ul className="list-disc pl-6 space-y-2">
        <li><Link href="/admin/coins" className="text-blue-600 hover:underline">Manage Coins</Link></li>
        <li><Link href="/admin/pairs" className="text-blue-600 hover:underline">Manage Pairs</Link></li>
        <li><Link href="/admin/payment" className="text-blue-600 hover:underline">Payment Routes</Link></li>
      </ul>
    </div>
  )
}
