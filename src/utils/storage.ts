import Dexie from "dexie";
import CryptoJS from "crypto-js";

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
      wallets: "@id, chain, publicKey, encryptedPrivateKey",
    });

    this.wallets = this.table("wallets");
  }
}

export const walletDB = new WalletDatabase();

export async function saveWallet(
  privateKey: string,
  password: string,
  publicKey: string,
  chain: string
): Promise<number> {
  try {
    if (!privateKey || !password || !publicKey || !chain) {
      throw new Error("All parameters are required");
    }

    console.log("Saving wallet for chain:", chain);
    const encryptedPrivateKey = CryptoJS.AES.encrypt(
      privateKey,
      password
    ).toString();

    const id = await walletDB.wallets.add({
      encryptedPrivateKey,
      publicKey,
      chain,
    });

    console.log("Wallet saved successfully with id:", id);
    return id;
  } catch (error) {
    console.error("Failed to save wallet:", error);
    throw error;
  }
}

export async function getWallet(
  password: string,
  chain = "solana"
): Promise<{ privateKey: string; publicKey: string } | null> {
  if (!password) {
    console.error("Password is required");
    return null;
  }

  console.log("Fetching wallet for chain:", chain);
  const wallet = await walletDB.wallets.where("chain").equals(chain).first();

  if (!wallet) {
    console.log("No wallet found for chain:", chain);
    return null;
  }

  console.log("Wallet found, attempting decryption");

  try {
    const decryptedBytes = CryptoJS.AES.decrypt(
      wallet.encryptedPrivateKey,
      password
    );
    const decryptedPrivateKey = decryptedBytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedPrivateKey) {
      console.error("Decryption resulted in empty string");
      throw new Error("Incorrect password");
    }

    console.log("Wallet decrypted successfully");
    return {
      privateKey: decryptedPrivateKey,
      publicKey: wallet.publicKey,
    };
  } catch (error) {
    console.error("Failed to decrypt wallet:", error);
    return null;
  }
}
