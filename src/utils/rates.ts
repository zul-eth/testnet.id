export const dummyRates: Record<string, number> = {
  'USDT_ETH': 0.00032,
  'ETH_USDT': 3120,
  'USDC_ETH': 0.00031,
  'ETH_USDC': 3190,
  'IDR_ETH': 0.000000021,
  'USDT_DOGE': 48000000,
  'USDT_AVAX': 48000000,
  'USDT_TON': 48000000,
  'USDT_SUI': 48000000,
  'USDT_SOL': 48000000,
  'USDT_TRX': 48000000,
  'USDT_ARB': 48000000,
  'USDT_POL': 48000000,
}

export function getRate(from: string, to: string): number | undefined {
  return dummyRates[`${from}_${to}`]
}
