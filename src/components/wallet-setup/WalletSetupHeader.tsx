import { Logo } from "@/components/layout/Logo";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useWallet } from "@/context/wallet.context";
import { motion } from "framer-motion";

export function WalletSetupHeader() {
  const { wallets } = useWallet();

  const getMessage = () => {
    if (!wallets) return "Welcome to WalletX";
    return wallets.length === 0
      ? "Create your first wallet to begin your journey"
      : "Add a new wallet or import an existing one";
  };

  return (
    <CardHeader className="text-center py-8">
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <CardTitle className="text-5xl font-bold flex flex-col gap-6 items-center justify-center mb-2">
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              Welcome {wallets && "back"} to
            </span>
            <motion.div
              initial={{ scale: 0.8, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
            >
              <Logo className="scale-150" />
            </motion.div>
          </CardTitle>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <CardDescription className="text-xl text-muted-foreground/90">
            {getMessage()}
          </CardDescription>
        </motion.div>
      </div>
    </CardHeader>
  );
}
