import { writeFile } from 'fs/promises'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const coinId = params.id
    const formData = await req.formData()

    const name = formData.get('name')?.toString()
    const label = formData.get('label')?.toString()
    const rawNetwork = formData.get('network')?.toString()
    const iconFile = formData.get('icon') as File | null

    if (!coinId || !name || !label || (rawNetwork !== 'MAINNET' && rawNetwork !== 'TESTNET')) {
      return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 })
    }

    let iconUrl: string | undefined

    // Kalau admin upload ikon baru
    if (iconFile && iconFile.size > 0) {
      const bytes = await iconFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const fileName = `${Date.now()}-${iconFile.name}`
      const filePath = path.join(process.cwd(), 'public/uploads', fileName)
      await writeFile(filePath, buffer)
      iconUrl = `/uploads/${fileName}`
    }

    const updatedCoin = await prisma.coin.update({
      where: { id: coinId },
      data: {
        name,
        symbol: label,
        network: rawNetwork,
        ...(iconUrl && { iconUrl }), // hanya update icon kalau ada
      },
    })

    return NextResponse.json(updatedCoin)
  } catch (err: any) {
    console.error('GAGAL UPDATE COIN:', err)
    return NextResponse.json({ error: 'Internal Server Error', detail: err.message }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const coinId = params.id
  try {
    await prisma.coin.delete({
      where: { id: coinId },
    })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}