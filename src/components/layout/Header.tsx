import { Logo } from "./Logo";
import { ModeToggle } from "../theme/mode-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex flex-row h-16 max-w-7xl items-center justify-between px-4">
        <Logo className="ml-52" />
        <div className="flex items-center gap-4">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
