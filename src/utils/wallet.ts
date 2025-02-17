import "../polyfills/buffer";
import { Buffer } from "buffer";
import { Keypair } from "@solana/web3.js";
import * as bip39 from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english";
import { derivePath } from "ed25519-hd-key";
import { ethers } from "ethers";
import * as bitcoin from "bitcoinjs-lib";
import * as ecc from "@bitcoinerlab/secp256k1";
import BIP32Factory from "bip32";

const bip32 = BIP32Factory(ecc);

import { ChainType, WalletKey } from "../types/chains";

function validateAndGetSeed(mnemonic: string): Uint8Array {
  if (!bip39.validateMnemonic(mnemonic, wordlist)) {
    throw new Error("Invalid mnemonic phrase");
  }
  return bip39.mnemonicToSeedSync(mnemonic);
}

function deriveSolanaKey(mnemonic: string): WalletKey {
  const seed = validateAndGetSeed(mnemonic);
  const derivedSeed = derivePath(
    "m/44'/501'/0'/0'",
    Buffer.from(seed).toString("hex")
  ).key;
  const keypair = Keypair.fromSeed(derivedSeed);

  return {
    address: keypair.publicKey.toString(),
    privateKey: Buffer.from(keypair.secretKey).toString("hex"),
  };
}

function deriveEthereumKey(mnemonic: string): WalletKey {
  const seed = validateAndGetSeed(mnemonic);
  const hdNode = ethers.HDNodeWallet.fromSeed(seed);
  const wallet = hdNode.derivePath("m/44'/60'/0'/0/0");

  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
  };
}

function deriveBitcoinKey(mnemonic: string): WalletKey {
  const seed = validateAndGetSeed(mnemonic);
  const network = bitcoin.networks.bitcoin;
  const root = bip32.fromSeed(Buffer.from(seed));
  const child = root.derivePath("m/44'/0'/0'/0/0");
  const { address } = bitcoin.payments.p2pkh({
    pubkey: Buffer.from(child.publicKey),
    network,
  });

  return {
    address: address!,
    privateKey: child.toWIF(),
  };
}

export function deriveWalletKey(chain: ChainType, mnemonic: string): WalletKey {
  switch (chain) {
    case ChainType.SOLANA:
      return deriveSolanaKey(mnemonic);
    case ChainType.ETHEREUM:
      return deriveEthereumKey(mnemonic);
    case ChainType.BITCOIN:
      return deriveBitcoinKey(mnemonic);
    default:
      throw new Error(`Unsupported chain: ${chain}`);
  }
}

export function generateMnemonic(): string {
  return bip39.generateMnemonic(wordlist, 128);
}
