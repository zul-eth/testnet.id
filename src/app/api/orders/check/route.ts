import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { JsonRpcProvider } from 'ethers'

const provider = new JsonRpcProvider(process.env.RPC_URL || '')

export async function POST() {
  const pending = await prisma.order.findMany({
    where: { status: 'PENDING', paymentAddress: { not: null } },
    include: { paymentRoute: true },
  })

  for (const ord of pending) {
    try {
      const balance = await provider.getBalance(ord.paymentAddress as string)
      if (balance > 0n) {
        await prisma.order.update({
          where: { id: ord.id },
          data: { status: 'CONFIRMED' },
        })
        await prisma.orderHistory.create({
          data: {
            orderId: ord.id,
            network: ord.network,
            txHash: 'unknown',
            confirmedAt: new Date(),
          },
        })
      }
    } catch (e) {
      console.error('check payment failed', e)
    }
  }

  return NextResponse.json({ checked: pending.length })
}
