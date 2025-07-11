export type CurrencyCode =
  | 'ETH'
  | 'USDT'
  | 'USDC'
  | 'DOGE'
  | 'AVAX'
  | 'TON'
  | 'SUI'
  | 'SOL'
  | 'TRX'
  | 'ARB'
  | 'POL'
  | 'IDR'

export type Currency = {
  label: string
  value: CurrencyCode
}

export type FormState = {
  amount: string
  currency: CurrencyCode
  receiveCurrency: CurrencyCode
  receiveAmount: string
  address: string
  txId: string
}
