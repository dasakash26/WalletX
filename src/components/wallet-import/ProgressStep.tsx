import { ImportStepProps } from "@/types/import-wallet";

export const ProgressStep = ({ currentStep, step, index }: ImportStepProps) => {
  const isActive = index + 1 === currentStep;
  const isCompleted = index + 1 < currentStep;

  return (
    <div
      className={`flex flex-col items-center w-1/3 relative ${
        isActive
          ? "text-primary"
          : isCompleted
          ? "text-success"
          : "text-muted-foreground/50"
      }`}
    >
      <div
        className={`
          w-12 h-12 rounded-full flex items-center justify-center text-base
          mb-3 transition-all duration-300 shadow-sm backdrop-blur-sm
          ${
            isActive
              ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground ring-2 ring-primary/20 ring-offset-2"
              : isCompleted
              ? "bg-success/10 text-success border border-success/30"
              : "bg-muted/30 border border-muted-foreground/10"
          }
        `}
      >
        {isCompleted ? (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          step.icon
        )}
      </div>
      <div className="text-sm font-medium">{step.title}</div>
      {index < 2 && (
        <div
          className={`
            absolute top-6 left-[60%] w-[80%] h-[1px] transition-colors duration-300
            ${isCompleted ? "bg-success/30" : "bg-muted-foreground/10"}
          `}
        />
      )}
    </div>
  );
};
