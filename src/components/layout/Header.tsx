import { Logo } from "./Logo";
import { ModeToggle } from "../theme/mode-toggle";
import ChainSwitcher from "../ChainSwitcher";
import { Button } from "../ui/button";
import { Plus, LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { clearWallets } from "@/utils/storage";
import { useWallet } from "@/context/wallet.context";

export function Header() {
  const navigate = useNavigate();
  const { wallets } = useWallet();
  const handleLogout = () => {
    clearWallets();
    navigate("/auth");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 sm:h-16 items-center justify-between px-4 max-w-7xl mx-auto ">
        <div className="flex items-center">
          <Logo />
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  onClick={() => navigate("/wallet-setup")}
                  className="bg-primary/10 hover:bg-primary/30"
                >
                  <Plus className="h-6 w-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create New Wallet</p>
              </TooltipContent>
            </Tooltip>
            {wallets && wallets.length > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    onClick={handleLogout}
                    variant={"secondary"}
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Logout</p>
                </TooltipContent>
              </Tooltip>
            )}
            <div className="hidden sm:block">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <ChainSwitcher />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Switch Network</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <ModeToggle />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle Theme</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
}
