import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { deriveAddress } from '@/lib/hdwallet'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { orderId, protocol, coinId, network } = body

    if (!orderId || !protocol || !coinId || !network) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Cari order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (order.paymentAddress) {
      return NextResponse.json({ error: 'Order already has a payment address' }, { status: 400 })
    }

    // Cari index terakhir yang digunakan
    const latestOrderWithIndex = await prisma.order.findFirst({
      where: {
        network,
        paymentAddressIndex: {
          not: null,
        },
      },
      orderBy: {
        paymentAddressIndex: 'desc',
      },
      select: {
        paymentAddressIndex: true,
      },
    })

    const nextIndex = (latestOrderWithIndex?.paymentAddressIndex ?? -1) + 1

    // Generate address dari HD wallet
    const paymentAddress = deriveAddress(nextIndex, protocol)

    // Simpan ke order
    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentAddress,
        paymentAddressIndex: nextIndex,
      },
    })

    return NextResponse.json({
      success: true,
      paymentAddress,
      paymentAddressIndex: nextIndex,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}