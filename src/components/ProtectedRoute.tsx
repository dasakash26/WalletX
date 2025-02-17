import { useWallet } from "../context/WalletProvider";
import { Navigate } from "react-router";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { wallet } = useWallet();
  return wallet ? children : <Navigate to="/auth" />;
}
