import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router";

export function WalletActionButtons() {
  const navigate = useNavigate();

  return (
    <CardContent className="flex flex-col space-y-6">
      <Button
        onClick={() => navigate("/create-wallet")}
        className="w-full bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 transition-all duration-300"
        size="lg"
      >
        Create New Wallet
      </Button>

      <Button
        onClick={() => navigate("/import-wallet")}
        variant="outline"
        className="w-full border-2 hover:bg-primary/5 transition-all duration-300"
        size="lg"
      >
        Import Existing Wallet
      </Button>
    </CardContent>
  );
}
