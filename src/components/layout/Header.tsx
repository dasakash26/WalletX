import { Logo } from "./Logo";
import { ModeToggle } from "../theme/mode-toggle";
import ChainSwitcher from "../ChainSwitcher";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 sm:h-16 items-center justify-between px-4 max-w-7xl mx-auto">
        <div className="flex items-center">
          <Logo />
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <ChainSwitcher />
          </div>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
