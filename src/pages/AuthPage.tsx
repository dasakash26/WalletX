import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { walletDB } from "@/utils/storage";
import LoginForm from "../components/LoginForm";
import { useWallet } from "@/context/wallet.context";

export default function AuthPage() {
  const wallet = useWallet();
  const navigate = useNavigate();
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const isNavigatingRef = useRef(false);
  const navigationTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    let mounted = true;

    async function checkWallet() {
      if (isNavigatingRef.current) return;
      isNavigatingRef.current = true;

      try {
        const storedWallet = await walletDB.wallets.toCollection().first();

        if (!mounted) return;

        if (!storedWallet) {
          // Clear any pending navigation
          if (navigationTimeoutRef.current) {
            clearTimeout(navigationTimeoutRef.current);
          }

          // Debounce navigation
          navigationTimeoutRef.current = setTimeout(() => {
            navigate("/create-wallet");
          }, 100);
        } else if (wallet && !initialCheckDone) {
          // Clear any pending navigation
          if (navigationTimeoutRef.current) {
            clearTimeout(navigationTimeoutRef.current);
          }

          // Debounce navigation
          navigationTimeoutRef.current = setTimeout(() => {
            navigate("/");
          }, 100);
        }

        setInitialCheckDone(true);
      } finally {
        isNavigatingRef.current = false;
      }
    }

    if (!initialCheckDone) {
      checkWallet();
    }

    return () => {
      mounted = false;
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, [initialCheckDone, wallet, navigate]);

  return <LoginForm />;
}
