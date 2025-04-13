import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
  SendTransactionError,
} from "@solana/web3.js";
import { useState, useEffect, useMemo } from "react";
import bs58 from "bs58";

const LAMPORTS_PER_SOL = 1000000000;

export type CurrencyUnit = "lamports" | "sol";

export function useTransaction({
  privateKey,
}: {
  privateKey: string;
  solPrice?: number;
}) {
  const [address, setAddress] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [currencyUnit, setCurrencyUnit] = useState<CurrencyUnit>("sol");
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [addressError, setAddressError] = useState("");

  const convertToLamports = (value: number, fromUnit: CurrencyUnit): number => {
    switch (fromUnit) {
      case "lamports":
        return Math.floor(value);
      case "sol":
        return Math.floor(value * LAMPORTS_PER_SOL);
      default:
        return Math.floor(value);
    }
  };

  const getEquivalentValue = (
    value: number,
    fromUnit: CurrencyUnit,
    toUnit: CurrencyUnit
  ): number => {
    const lamports = convertToLamports(value, fromUnit);

    switch (toUnit) {
      case "lamports":
        return lamports;
      case "sol":
        return parseFloat((lamports / LAMPORTS_PER_SOL).toFixed(9));
      default:
        return value;
    }
  };

  const formatCurrency = (value: number, unit: CurrencyUnit): string => {
    switch (unit) {
      case "lamports":
        return value.toLocaleString(undefined, { maximumFractionDigits: 0 });
      case "sol":
        return value.toLocaleString(undefined, { maximumFractionDigits: 9 });
      default:
        return value.toString();
    }
  };

  const lamportsToSend = useMemo(
    () => convertToLamports(amount, currencyUnit),
    [amount, currencyUnit]
  );

  useEffect(() => {
    if (transactionStatus !== "idle") {
      const timer = setTimeout(() => {
        setTransactionStatus("idle");
        setErrorMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [transactionStatus]);

  useEffect(() => {
    if (transactionStatus === "success") {
      setTimeout(() => {
        resetSendForm();
      }, 3000);
    }
  }, [transactionStatus]);

  const validateAddress = (addr: string) => {
    if (!addr) return "Recipient address is required";

    try {
      new PublicKey(addr);
      return "";
    } catch (error) {
      return "Invalid Solana address format";
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddress(value);
    setAddressError(value ? validateAddress(value) : "");
  };

  const sendSolana = async (
    recipientAddress: string,
    amountToSend: number
  ): Promise<string> => {
    if (!privateKey) {
      throw new Error("Private key is required to send transactions");
    }

    try {
      const lamportsToSend = convertToLamports(amountToSend, currencyUnit);
      console.log(`Sending ${lamportsToSend} lamports to ${recipientAddress}`);

      const connection = new Connection(
        import.meta.env.VITE_SOLANA_RPC_URL,
        "confirmed"
      );

      const decodedPrivateKey = bs58.decode(privateKey);
      const senderKeypair = Keypair.fromSecretKey(decodedPrivateKey);

      console.log(`Sender public key: ${senderKeypair.publicKey.toString()}`);

      // Validate recipient address before proceeding
      let recipientPubKey: PublicKey;
      try {
        recipientPubKey = new PublicKey(recipientAddress);
      } catch (error) {
        throw new Error("Invalid recipient address");
      }

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: senderKeypair.publicKey,
          toPubkey: recipientPubKey,
          lamports: lamportsToSend,
        })
      );

      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [senderKeypair]
      );

      return signature;
    } catch (error) {
      console.error("Transaction failed:", error);
      throw error;
    }
  };

  const handleSend = async () => {
    if (address && amount > 0) {
      setIsSending(true);
      setTransactionStatus("pending");
      try {
        const success = await sendSolana(address, amount);
        setTransactionStatus(success ? "success" : "error");
        if (success) {
          setConfirmOpen(false);
        } else {
          setErrorMessage("Transaction failed. Please try again.");
        }
      } catch (error) {
        setTransactionStatus("error");

        if (error instanceof SendTransactionError) {
          const detailedError = error.message || "";
          console.error(
            "Transaction error details:",
            error.logs ? error.logs : "No logs available"
          );

          if (detailedError.includes("found no record of a prior credit")) {
            setErrorMessage(
              "Insufficient funds in your wallet to complete this transaction."
            );
          } else {
            setErrorMessage(
              `Transaction error: ${detailedError.split(".")[0]}`
            );
          }
        } else {
          setErrorMessage(
            error instanceof Error ? error.message : "Unknown error occurred"
          );
        }
      } finally {
        setIsSending(false);
      }
    }
  };

  const resetSendForm = () => {
    setAddress("");
    setAmount(0);
    setAddressError("");
    setSendDialogOpen(false);
  };

  const handleProceedToConfirmation = () => {
    if (address && amount > 0 && !addressError) {
      setSendDialogOpen(false);
      setConfirmOpen(true);
    }
  };

  return {
    address,
    amount,
    currencyUnit,
    sendDialogOpen,
    confirmOpen,
    isSending,
    transactionStatus,
    errorMessage,
    addressError,
    lamportsToSend,

    setAddress,
    setAmount,
    setCurrencyUnit,
    setSendDialogOpen,
    setConfirmOpen,

    convertToLamports,
    getEquivalentValue,
    formatCurrency,
    handleAddressChange,
    handleSend,
    resetSendForm,
    handleProceedToConfirmation,
    validateAddress,
  };
}
