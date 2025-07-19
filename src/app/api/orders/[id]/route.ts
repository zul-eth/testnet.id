import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: { hash: string } }) {
  try {
    const order = await prisma.order.findUnique({
      where: { orderHash: params.hash },
      include: {
        pair: {
          include: {
            baseCoin: true,
            quoteCoin: true,
          },
        },
        history: true,
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (err: any) {
    console.error('GAGAL GET ORDER:', err)
    return NextResponse.json({ error: 'Internal Server Error', detail: err.message }, { status: 500 })
  }
}