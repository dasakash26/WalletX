import Dexie from "dexie";
import CryptoJS from "crypto-js";

// Define the IndexedDB Schema
class WalletDatabase extends Dexie {
  wallets: Dexie.Table<
    {
      id?: number;
      encryptedPrivateKey: string;
      publicKey: string;
      chain: string;
    },
    number
  >;

  constructor() {
    super("MultiChainWalletDB");
    this.version(1).stores({
      wallets: "++id, chain, publicKey, encryptedPrivateKey",
    });

    this.wallets = this.table("wallets");
  }
}

export const walletDB = new WalletDatabase();

// Encrypt and Save Wallet Key
export async function saveWallet(
  privateKey: string,
  password: string,
  publicKey: string,
  chain: string
): Promise<number> {
  const encryptedPrivateKey = CryptoJS.AES.encrypt(
    privateKey,
    password
  ).toString();
  return await walletDB.wallets.add({ encryptedPrivateKey, publicKey, chain });
}

// Retrieve and Decrypt Wallet Key
export async function getWallet(
  password: string,
  chain: string
): Promise<{ privateKey: string; publicKey: string } | null> {
  const wallet = await walletDB.wallets.where("chain").equals(chain).first();
  if (!wallet) return null;

  try {
    const decryptedBytes = CryptoJS.AES.decrypt(
      wallet.encryptedPrivateKey,
      password
    );
    const decryptedPrivateKey = decryptedBytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedPrivateKey) throw new Error("Incorrect password");

    return { privateKey: decryptedPrivateKey, publicKey: wallet.publicKey };
  } catch (error) {
    console.error("Failed to decrypt wallet", error);
    return null;
  }
}
