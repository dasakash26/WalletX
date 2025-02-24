import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({
  password,
}: PasswordStrengthIndicatorProps) {
  const getStrength = () => {
    if (password.length === 0) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    if (password.match(/[^A-Za-z0-9]/)) strength += 25;
    return strength;
  };

  const strength = getStrength();
  const getLabel = () => {
    if (strength === 100) return { text: "Strong", color: "text-green-500" };
    if (strength >= 75) return { text: "Good", color: "text-blue-500" };
    if (strength >= 50) return { text: "Medium", color: "text-yellow-500" };
    return { text: "Weak", color: "text-red-500" };
  };

  const strengthLabel = getLabel();

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Progress value={strength} className={cn("h-2 flex-1")} />
        <span className={cn("ml-2 text-sm font-medium", strengthLabel.color)}>
          {strengthLabel.text}
        </span>
      </div>
      <ul className="text-sm text-muted-foreground space-y-1">
        <li className={cn(password.length >= 8 ? "text-green-500" : "")}>
          • At least 8 characters
        </li>
        <li className={cn(password.match(/[A-Z]/) ? "text-green-500" : "")}>
          • One uppercase letter
        </li>
        <li className={cn(password.match(/[0-9]/) ? "text-green-500" : "")}>
          • One number
        </li>
        <li
          className={cn(password.match(/[^A-Za-z0-9]/) ? "text-green-500" : "")}
        >
          • One special character
        </li>
      </ul>
    </div>
  );
}
