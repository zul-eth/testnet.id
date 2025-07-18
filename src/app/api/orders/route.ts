import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'
import { addMinutes } from 'date-fns'

// GET all orders (opsional - bisa dipakai untuk admin dashboard)
export async function GET() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      pair: {
        include: {
          baseCoin: true,
          quoteCoin: true,
        },
      },
    },
  })

  return NextResponse.json(orders)
}

// POST /api/orders
export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { pairId, amount, addressDestination, network } = data

    if (!pairId || !amount || !addressDestination || !network) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const orderHash = uuidv4()
    const expiresAt = addMinutes(new Date(), 15)

    const order = await prisma.order.create({
      data: {
        pairId,
        amount: parseFloat(amount),
        addressDestination,
        network,
        orderHash,
        expiresAt,
      },
      include: {
        pair: {
          include: {
            baseCoin: true,
            quoteCoin: true,
          },
        },
      },
    })

    return NextResponse.json(order)
  } catch (err: any) {
    console.error('GAGAL BUAT ORDER:', err)
    return NextResponse.json({ error: 'Internal Server Error', detail: err.message }, { status: 500 })
  }
}