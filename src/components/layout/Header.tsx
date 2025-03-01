import { useNavigate } from "react-router";
import { useWallet } from "@/context/wallet.context";
import { Logo } from "./Logo";
import { HeaderActions } from "./HeaderActions";
import { ModeToggle } from "../theme/mode-toggle";

export function Header() {
  const navigate = useNavigate();
  const { wallets } = useWallet();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 sm:h-16 items-center justify-between px-4 max-w-7xl mx-auto">
        <div className="flex items-center">
          <Logo />
        </div>
        <div className="bg-background flex items-center gap-2">
          <ModeToggle />
          <HeaderActions navigate={navigate} wallets={wallets} />
        </div>
      </div>
    </header>
  );
}
