import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const pairId = params.id
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

    const updated = await prisma.pair.update({
      where: { id: pairId },
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

    return NextResponse.json(updated)
  } catch (err: any) {
    console.error('GAGAL PUT PAIR:', err)
    return NextResponse.json({ error: 'Failed to update pair', detail: err.message }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const pairId = params.id

  try {
    await prisma.pair.delete({
      where: { id: pairId },
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('GAGAL DELETE PAIR:', err)
    return NextResponse.json({ error: 'Failed to delete pair', detail: err.message }, { status: 500 })
  }
}