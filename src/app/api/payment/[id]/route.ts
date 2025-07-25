// src/app/api/payment/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  try {
    await prisma.paymentRoute.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('GAGAL HAPUS PAYMENT ROUTE:', err)
    return NextResponse.json({ error: 'Failed to delete route', detail: err.message }, { status: 500 })
  }
}