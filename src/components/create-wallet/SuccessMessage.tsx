import {
  ArrowRight,
  CheckCircle2,
  CircleDollarSign,
  Coins,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export function SuccessMessage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center gap-12 p-16">
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <CircleDollarSign
            className="h-16 w-16 text-green-500/80"
            strokeWidth={2}
          />
          <Coins className="h-16 w-16 text-green-500/80" strokeWidth={2} />
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-green-500/20 dark:bg-green-500/10 rounded-full blur-2xl opacity-60 animate-pulse" />
          <CheckCircle2
            className="h-32 w-32 text-green-500 animate-in fade-in zoom-in duration-500"
            strokeWidth={2.5}
          />
        </div>
      </div>

      <Button
        size="lg"
        className="text-lg font-medium px-8 py-6 h-auto rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500"
        onClick={() => navigate("/")}
      >
        Go to Wallet
        <ArrowRight className="h-5 w-5 ml-2" />
      </Button>
    </div>
  );
}
