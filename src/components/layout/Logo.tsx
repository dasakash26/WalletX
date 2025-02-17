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
      <span className={textClassName}>
        Wallet<span className="text-blue-500">X</span>
      </span>
    </div>
  );
}
