import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/pairs?network=TESTNET|MAINNET
export async function GET(req: NextRequest) {
  const network = req.nextUrl.searchParams.get('network') as 'TESTNET' | 'MAINNET' | null

  if (!network || (network !== 'TESTNET' && network !== 'MAINNET')) {
    return NextResponse.json({ error: 'Invalid or missing network' }, { status: 400 })
  }

  const pairs = await prisma.pair.findMany({
    where: { network },
    include: {
      baseCoin: true,
      quoteCoin: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(pairs)
}

// POST /api/pairs
export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const {
      baseCoinId,
      quoteCoinId,
      network,
      priceBase,
      priceQuote,
    } = data

    if (!baseCoinId || !quoteCoinId || !network || !priceBase || !priceQuote) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const pair = await prisma.pair.create({
      data: {
        baseCoinId,
        quoteCoinId,
        network,
        priceBase: parseFloat(priceBase),
        priceQuote: parseFloat(priceQuote),
      },
      include: {
        baseCoin: true,
        quoteCoin: true,
      },
    })

    return NextResponse.json(pair)
  } catch (err: any) {
    console.error('GAGAL POST PAIR:', err)
    return NextResponse.json({ error: 'Internal Server Error', detail: err.message }, { status: 500 })
  }
}