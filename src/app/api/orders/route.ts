import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'
import { addMinutes } from 'date-fns'
import { deriveAddress } from '@/lib/hdwallet'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { pairId, amount, addressDestination, network, protocol } = data

    if (!pairId || !amount || !addressDestination || !network || !protocol) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const orderHash = uuidv4()
    const expiresAt = addMinutes(new Date(), 15)

    // Ambil hdIndex terakhir untuk network tersebut
    const latestOrder = await prisma.order.findFirst({
      where: {
        network,
        hdIndex: {
          not: null,
        },
      },
      orderBy: {
        hdIndex: 'desc',
      },
      select: {
        hdIndex: true,
      },
    })

    const nextIndex = (latestOrder?.hdIndex ?? -1) + 1
    const paymentAddress = deriveAddress(nextIndex, protocol)

    const order = await prisma.order.create({
      data: {
        pair: {
          connect: { id: pairId },
        },
        amount: parseFloat(amount),
        addressDestination,
        network,
        orderHash,
        expiresAt,
        paymentAddress,
        hdIndex: nextIndex,
        protocol,
      },
    })

    return NextResponse.json({
      orderId: order.id,
      orderHash: order.orderHash,
      paymentAddress: order.paymentAddress,
      hdIndex: order.hdIndex,
      protocol: order.protocol,
    })
  } catch (err: any) {
    console.error('GAGAL BUAT ORDER:', err)
    return NextResponse.json({
      error: 'Internal Server Error',
      detail: err.message,
      stack: err.stack,
    }, { status: 500 })
  }
}