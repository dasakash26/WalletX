import { Wallet } from "lucide-react";

interface LogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
}

export function Logo({
  className = "",
  iconClassName = "h-6 w-6 text-blue-500",
  textClassName = "text-2xl font-bold",
}: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Wallet className={iconClassName} />
      <div className="flex items-center">
        <span className={textClassName}>
          Wallet<span className="text-blue-500">X</span>
        </span>
        <span className="ml-1 animate-pulse text-xs font-medium text-blue-500">
          Beta
        </span>
      </div>
    </div>
  );
}
