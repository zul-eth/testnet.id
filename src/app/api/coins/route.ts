import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import { prisma } from '@/lib/prisma'

// GET /api/coins?network=TESTNET|MAINNET
export async function GET(req: NextRequest) {
  const network = req.nextUrl.searchParams.get('network')

  if (network !== 'TESTNET' && network !== 'MAINNET') {
    return NextResponse.json({ error: 'Invalid network' }, { status: 400 })
  }

  const coins = await prisma.coin.findMany({
    where: { network },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(coins)
}

// POST /api/coins
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    const name = formData.get('name')?.toString()
    const label = formData.get('label')?.toString()
    const rawNetwork = formData.get('network')?.toString()
    const file = formData.get('icon') as File

    if (!name || !label || !file || (rawNetwork !== 'MAINNET' && rawNetwork !== 'TESTNET')) {
      return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 })
    }

    // Simpan file ke public/uploads
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filename = `${Date.now()}-${file.name}`
    const filePath = path.join(process.cwd(), 'public/uploads', filename)
    await writeFile(filePath, buffer)
    const iconUrl = `/uploads/${filename}`

    const coin = await prisma.coin.create({
      data: {
        name,
        symbol: label,   // gunakan label sebagai symbol
        iconUrl,
        network: rawNetwork, // enum: 'TESTNET' atau 'MAINNET'
      },
    })

    return NextResponse.json(coin)
  } catch (err: any) {
    console.error('GAGAL SIMPAN COIN:', err)
    return NextResponse.json({ error: 'Internal Server Error', detail: err.message }, { status: 500 })
  }
}