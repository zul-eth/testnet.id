// src/app/api/payment/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/payment?network=TESTNET|MAINNET
export async function GET(req: NextRequest) {
  const network = req.nextUrl.searchParams.get('network')

  if (network !== 'TESTNET' && network !== 'MAINNET') {
    return NextResponse.json({ error: 'Invalid network' }, { status: 400 })
  }

  const routes = await prisma.paymentRoute.findMany({
    where: { network },
    include: { coin: true },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(routes)
}

// POST /api/payment
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { coinId, protocol, address, network } = body

    if (!coinId || !protocol || !address || (network !== 'MAINNET' && network !== 'TESTNET')) {
      return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 })
    }

    const newRoute = await prisma.paymentRoute.create({
      data: {
        coinId,
        protocol,
        address,
        network,
      },
      include: { coin: true },
    })

    return NextResponse.json(newRoute)
  } catch (err: any) {
    console.error('GAGAL BUAT PAYMENT ROUTE:', err)
    return NextResponse.json({ error: 'Internal Server Error', detail: err.message }, { status: 500 })
  }
}