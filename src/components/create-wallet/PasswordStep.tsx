import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Unlock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { FormState, ValidationState } from "@/types/password-setup";
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";

interface PasswordStepProps {
  formState: FormState;
  validation: ValidationState;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBack: () => void;
}

export function PasswordStep({
  formState,
  validation,
  onChange,
  onBack,
}: PasswordStepProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              {validation.password === null ? (
                <Lock className="h-5 w-5 text-blue-500" />
              ) : validation.password ? (
                <Unlock className="h-5 w-5 text-green-500" />
              ) : (
                <Lock className="h-5 w-5 text-red-500" />
              )}
            </TooltipTrigger>
            <TooltipContent>
              Password must be at least 8 characters long
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        Set Password
      </h3>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formState.password}
          onChange={onChange}
          placeholder="Enter your password"
          className={cn(
            "transition-colors",
            validation.password === true && "border-green-500",
            validation.password === false && "border-red-500"
          )}
        />
        <PasswordStrengthIndicator password={formState.password} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formState.confirmPassword}
          onChange={onChange}
          placeholder="Confirm your password"
          className={cn(
            "transition-colors",
            validation.password === true && "border-green-500",
            validation.password === false && "border-red-500"
          )}
        />
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onBack}
        >
          Back
        </Button>
        <Button type="submit" className="flex-1">
          Create Wallet
        </Button>
      </div>
    </div>
  );
}
