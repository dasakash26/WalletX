import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FormState, ValidationState } from "@/types/password-setup";

interface VerificationStepProps {
  formState: FormState;
  validation: ValidationState;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNext: () => void;
}

export function VerificationStep({
  formState,
  validation,
  onChange,
  onNext,
}: VerificationStepProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              {validation.firstWord === null || validation.lastWord === null ? (
                <span className="h-5 w-5 rounded-full border-2 animate-pulse" />
              ) : validation.firstWord && validation.lastWord ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : (
                <X className="h-5 w-5 text-red-500" />
              )}
            </TooltipTrigger>
            <TooltipContent>
              Please verify you have safely stored your recovery phrase
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        Verify Recovery Phrase
      </h3>

      <div className="space-y-4">
        <div className="rounded-lg bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            For security purposes, please enter the first and last words of your
            recovery phrase.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="firstWord">First Word of Recovery Phrase</Label>
          <Input
            id="firstWord"
            name="firstWord"
            value={formState.firstWord}
            onChange={onChange}
            placeholder="Enter the first word"
            className={cn(
              "transition-colors",
              validation.firstWord === true && "border-green-500",
              validation.firstWord === false && "border-red-500"
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastWord">Last Word of Recovery Phrase</Label>
          <Input
            id="lastWord"
            name="lastWord"
            value={formState.lastWord}
            onChange={onChange}
            placeholder="Enter the last word"
            className={cn(
              "transition-colors",
              validation.lastWord === true && "border-green-500",
              validation.lastWord === false && "border-red-500"
            )}
          />
        </div>
      </div>

      <Button
        type="button"
        className="w-full"
        onClick={onNext}
        disabled={!validation.firstWord || !validation.lastWord}
      >
        Next
      </Button>
    </div>
  );
}
