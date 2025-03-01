import Dexie from "dexie";
import CryptoJS from "crypto-js";

class WalletDatabase extends Dexie {
  wallets: Dexie.Table<
    {
      id?: number;
      name: string;
      encryptedPrivateKey: string;
      publicKey: string;
      chain: string;
    },
    number
  >;

  constructor() {
    super("MultiChainWalletDB");
    this.version(2).stores({
      wallets: "@id, name, chain, publicKey, encryptedPrivateKey",
    });

    this.wallets = this.table("wallets");
  }
}

export const walletDB = new WalletDatabase();

async function getNextDefaultName(chain: string): Promise<string> {
  const wallets = await walletDB.wallets.where("chain").equals(chain).toArray();

  const defaultWallets = wallets
    .map((w) => w.name)
    .filter((name): name is string => {
      if (!name) return false;
      return /^Wallet \d+$/.test(name);
    });

  if (defaultWallets.length === 0) {
    return "Wallet 1";
  }

  const numbers = defaultWallets
    .map((name) => parseInt(name.split(" ")[1]))
    .sort((a, b) => b - a);

  return `Wallet ${numbers[0] + 1}`;
}

export async function saveWallet(
  privateKey: string,
  password: string,
  publicKey: string,
  chain: string,
  name?: string
): Promise<number> {
  try {
    if (!privateKey || !password || !publicKey || !chain) {
      throw new Error("Required parameters missing");
    }

    // Check for existing wallet with same public key
    const existingWallet = await walletDB.wallets
      .where("chain")
      .equals(chain)
      .and((wallet) => wallet.publicKey === publicKey)
      .first();

    if (existingWallet) {
      throw new Error("A wallet with this public key already exists");
    }

    const walletName = name || (await getNextDefaultName(chain));
    console.log("Saving wallet:", walletName, "for chain:", chain);

    const encryptedPrivateKey = CryptoJS.AES.encrypt(
      privateKey,
      password
    ).toString();

    const id = await walletDB.wallets.add({
      name: walletName,
      encryptedPrivateKey,
      publicKey,
      chain,
    });

    console.log("Wallet saved successfully with id:", id);

    console.log("Wallets:", await getWallets(password, chain));
    return id;
  } catch (error) {
    console.error("Failed to save wallet:", error);
    throw error;
  }
}

export async function getWallets(
  password: string,
  chain: string,
  name?: string
): Promise<Array<{ privateKey: string; publicKey: string; name: string }>> {
  if (!password || !chain) {
    console.error("Password and chain are required");
    return [];
  }

  console.log("Fetching wallets for chain:", chain);
  try {
    let query = walletDB.wallets.where("chain").equals(chain);

    if (name) {
      query = walletDB.wallets.where(["chain", "name"]).equals([chain, name]);
    }

    const wallets = await query.toArray();

    if (!wallets.length) {
      console.log("No wallets found for chain:", chain);
      return [];
    }

    console.log("Wallets found, attempting decryption");

    const decryptedWallets = wallets
      .map((wallet) => {
        try {
          const decryptedBytes = CryptoJS.AES.decrypt(
            wallet.encryptedPrivateKey,
            password
          );
          const decryptedPrivateKey = decryptedBytes.toString(
            CryptoJS.enc.Utf8
          );

          if (!decryptedPrivateKey) {
            console.error(
              "Decryption resulted in empty string for wallet:",
              wallet.name
            );
            return null;
          }

          return {
            privateKey: decryptedPrivateKey,
            publicKey: wallet.publicKey,
            name: wallet.name,
          };
        } catch (error) {
          console.error("Failed to decrypt wallet:", wallet.name, error);
          return null;
        }
      })
      .filter(
        (
          wallet
        ): wallet is { privateKey: string; publicKey: string; name: string } =>
          wallet !== null
      );

    const uniqueWallets = decryptedWallets.filter(
      (wallet, index, self) =>
        index === self.findIndex((w) => w.publicKey === wallet.publicKey)
    );

    if (uniqueWallets.length < decryptedWallets.length) {
      console.warn(
        `Found and removed ${
          decryptedWallets.length - uniqueWallets.length
        } duplicate wallet(s)`
      );
    }

    console.log(
      `Successfully decrypted ${uniqueWallets.length} unique wallets`
    );
    return uniqueWallets;
  } catch (error) {
    console.error("Failed to fetch wallets:", error);
    return [];
  }
}

export async function listWallets(
  chain: string
): Promise<Array<{ name: string; publicKey: string }>> {
  try {
    const wallets = await walletDB.wallets
      .where("chain")
      .equals(chain)
      .toArray();

    return wallets.map(({ name, publicKey }) => ({ name, publicKey }));
  } catch (error) {
    console.error("Failed to list wallets:", error);
    return [];
  }
}

export async function clearWallets(chain?: string): Promise<void> {
  try {
    if (chain) {
      console.log(`Clearing all wallets for chain: ${chain}`);
      await walletDB.wallets.where("chain").equals(chain).delete();
    } else {
      console.log("Clearing all wallets from database");
      await walletDB.wallets.clear();
    }
    console.log("Wallets cleared successfully");
  } catch (error) {
    console.error("Failed to clear wallets:", error);
    throw error;
  }
}
