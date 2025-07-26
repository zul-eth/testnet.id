import { HDNodeWallet, Mnemonic, Wallet } from 'ethers'

// Derive address from mnemonic or xpub
// Use HD_WALLET_MNEMONIC or HD_WALLET_XPRV/XPUB
const mnemonic = process.env.HD_WALLET_MNEMONIC
const xprv = process.env.HD_WALLET_XPRV
const xpub = process.env.HD_WALLET_XPUB

let root: HDNodeWallet

if (xprv) {
  root = HDNodeWallet.fromPhrase(xprv)
} else if (mnemonic) {
  root = HDNodeWallet.fromPhrase(mnemonic)
} else if (xpub) {
  root = HDNodeWallet.fromExtendedKey(xpub)
} else {
  throw new Error('HD wallet key not configured')
}

export function deriveAddress(index: number): string {
  const child = root.derivePath(`0/${index}`)
  return child.address
}
