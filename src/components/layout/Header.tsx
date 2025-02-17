import { Logo } from "./Logo";
import { ModeToggle } from "../theme/mode-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 max-w-7xl items-center justify-between pl-4 md:pl-6">
        <Logo className="ml-20" />
        <ModeToggle />
      </div>
    </header>
  );
}
