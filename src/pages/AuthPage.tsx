import { useEffect } from "react";
import { useNavigate } from "react-router";
import { walletDB } from "@/utils/storage";
import LoginForm from "../components/LoginForm";
import { useWallet } from "@/context/wallet.context";

export default function AuthPage() {
  const wallet = useWallet();
  const navigate = useNavigate();

  useEffect(() => {
    async function checkWallet() {
      const storedWallet = await walletDB.wallets.toCollection().first();

      if (!storedWallet) {
        navigate("/create-wallet");
      } else if (wallet) {
        navigate("/");
      }
    }

    checkWallet();
  }, [wallet, navigate]);

  return <LoginForm />;
}
