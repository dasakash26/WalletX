import { derivePath } from "ed25519-hd-key";
import { ChainType, WalletKey } from "../types/chains";
import { mnemonicToSeedSync, validateMnemonic } from "bip39";
import { Keypair } from "@solana/web3.js";
import { ethers } from "ethers";

export function validateAndGetSeed(mnemonic: string): Uint8Array {
  if (!validateMnemonic(mnemonic)) {
    throw new Error("Invalid mnemonic phrase");
  }
  return mnemonicToSeedSync(mnemonic);
}

export function deriveSolanaKey(mnemonic: string) {
  try {
    const seed = validateAndGetSeed(mnemonic);
    console.log("> seed:", seed);
    const derivedSeed = derivePath(
      `m/44'/501'/0'/0'`,
      Buffer.from(seed).toString("hex")
    ).key;
    console.log("> derived seed:", derivedSeed);
    const keypair = Keypair.fromSeed(derivedSeed.slice(0, 32));
    console.log("> keypair:", keypair);
    return {
      address: keypair.publicKey.toString(),
      privateKey: Buffer.from(keypair.secretKey).toString("hex"),
    };
  } catch (e) {
    console.error("Error deriving Solana key:", e);
    throw new Error("Error deriving Solana key");
  }
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
  // const seed = validateAndGetSeed(mnemonic);
  // const network = bitcoin.networks.bitcoin;
  // const root = getMasterKeyFromSeed(Buffer.from(seed));
  // const child = root.derivePath("m/44'/0'/0'/0/0");
  // const { address } = bitcoin.payments.p2pkh({
  //   pubkey: Buffer.from(child.publicKey),
  //   network,
  // });

  console.log(mnemonic);
  const address = "bitcoin address";
  const child = "bitcoin private key";

  return {
    address: address!,
    privateKey: child,
  };
}

export function deriveWalletKey(
  chain: ChainType,
  mnemonic: string
): WalletKey | undefined {
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
