import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { OrderStatus } from '@prisma/client'

<<<<<<< ours
export async function GET(_req: NextRequest, { params }: { params: { hash: string } }) {
  const order = await prisma.order.findUnique({
    where: { orderHash: params.hash },
    include: {
      pair: { include: { baseCoin: true, quoteCoin: true } },
      paymentRoute: { include: { coin: true } },
    },
  })

  if (!order) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(order)
=======
// GET /api/orders/[hash]
export async function GET(
  req: NextRequest,
  { params }: { params: { hash: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: { orderHash: params.hash },
      include: { paymentRoute: true },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (err: any) {
    console.error('GAGAL GET ORDER:', err)
    return NextResponse.json(
      { error: 'Internal Server Error', detail: err.message },
      { status: 500 }
    )
  }
>>>>>>> theirs
}

export async function PATCH(req: NextRequest, { params }: { params: { hash: string } }) {
  try {
    const body = await req.json()
    const { status } = body

    if (!status || !Object.values(OrderStatus).includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 })
    }

    const order = await prisma.order.update({
      where: { orderHash: params.hash },
      data: { status },
    })

    return NextResponse.json(order)
  } catch (err: any) {
    console.error('GAGAL UPDATE ORDER STATUS:', err)
    return NextResponse.json({ error: 'Internal Server Error', detail: err.message }, { status: 500 })
  }
}