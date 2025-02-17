export type StepStatus = "pending" | "current" | "complete";

export interface WalletStep {
  number: number;
  title: string;
  description: string;
  status: StepStatus;
}
