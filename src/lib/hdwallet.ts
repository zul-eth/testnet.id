import { HDNodeWallet } from "ethers"
import { mnemonicToSeedSync } from "bip39"
import { derivePath as ed25519DerivePath } from "ed25519-hd-key"
import { Keypair } from "@solana/web3.js"

const mnemonic = process.env.HD_WALLET_MNEMONIC || ''

export function deriveAddress(index: number, protocol: string): string {
  if (!mnemonic) throw new Error('HD_WALLET_MNEMONIC not set')

  if (protocol.toUpperCase() === 'SOLANA') {
    const seed = mnemonicToSeedSync(mnemonic)
    const { key } = ed25519DerivePath(`m/44'/501'/0'/0'/${index}`, seed)
    const kp = Keypair.fromSeed(key)
    return kp.publicKey.toBase58()
  }

  const path = `m/44'/60'/0'/0/${index}`
  const wallet = HDNodeWallet.fromPhrase(mnemonic, undefined, path)
  return wallet.address
}