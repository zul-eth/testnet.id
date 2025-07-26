// Tambah ke route.ts
export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get('orderId')
  if (!orderId) {
    return NextResponse.json({ error: 'Missing orderId' }, { status: 400 })
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      paymentAddress: true,
      paymentAddressIndex: true,
      protocol: true,
    },
  })

  if (!order?.paymentAddress) {
    return NextResponse.json({ error: 'Payment address not found' }, { status: 404 })
  }

  return NextResponse.json(order)
}