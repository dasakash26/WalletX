import { useWallet } from "@/context/wallet.context";
import { Navigate } from "react-router";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { wallets } = useWallet();
  return wallets && wallets.length > 0 ? children : <Navigate to="/auth" />;
}
