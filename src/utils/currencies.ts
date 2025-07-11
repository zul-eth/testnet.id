import type { Currency } from '@/types/form'

export const supportedStableCoins: Currency[] = [
  { label: 'Tether USD (USDT)', value: 'USDT' },
  { label: 'USD Coin (USDC)', value: 'USDC' },
  { label: 'Rupiah Token (IDR)', value: 'IDR' },
]

export const supportedCoins: Currency[] = [
  { label: 'Ethereum (ETH)', value: 'ETH' },
  { label: 'Dogecoin (DOGE)', value: 'DOGE' },
  { label: 'Avalanche (AVAX)', value: 'AVAX' },
  { label: 'Toncoin (TON)', value: 'TON' },
  { label: 'SUI', value: 'SUI' },
  { label: 'Solana (SOL)', value: 'SOL' },
  { label: 'TRON (TRX)', value: 'TRX' },
  { label: 'Arbitrum (ARB)', value: 'ARB' },
  { label: 'Polygon (POL)', value: 'POL' },
]
