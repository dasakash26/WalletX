interface LogoProps {
  className?: string;
}

export function Logo({ className = "" }: LogoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <span className="text-2xl font-bold">
        Wallet<span className="text-blue-500">X</span>
      </span>
    </div>
  );
}
