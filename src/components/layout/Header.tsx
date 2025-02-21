import { Logo } from "./Logo";
import { ModeToggle } from "../theme/mode-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-14 sm:h-16 items-center justify-between px-4 sm:px-8 md:px-12 lg:px-16 mx-auto">
        <div className="flex items-center">
          <Logo />
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
