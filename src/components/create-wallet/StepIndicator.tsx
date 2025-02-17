import { CheckCircle2 } from "lucide-react";
import type { WalletStep } from "@/types";

interface StepIndicatorProps {
  steps: readonly WalletStep[];
}

export function StepIndicator({ steps }: StepIndicatorProps) {
  return (
    <div className="flex justify-center mb-8 relative">
      <div className="flex items-center gap-4">
        {steps.map((step) => (
          <div key={step.number} className="flex items-center group relative">
            <div className="text-center">
              <div
                className={`
                  rounded-full h-10 w-10 flex items-center justify-center
                  transition-all duration-200 mb-2
                  ${
                    step.status === "complete"
                      ? "bg-green-500 text-white"
                      : step.status === "current"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }
                `}
              >
                {step.status === "complete" ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  step.number
                )}
              </div>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-sm">
                {step.title}
              </div>
            </div>
            {step.number < steps.length && (
              <div
                className={`h-0.5 w-16 mx-2 transition-all duration-200 ${
                  step.status === "complete" ? "bg-green-500" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
