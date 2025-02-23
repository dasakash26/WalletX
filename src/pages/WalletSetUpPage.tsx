import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { WalletSetupHeader } from "@/components/wallet-setup/WalletSetupHeader";
import { WalletActionButtons } from "@/components/wallet-setup/WalletActionButtons";

export default function WalletSetupPage() {
  return (
    <div className="flex items-center justify-center p-6 ">
      <div className="absolute inset-0 bg-foreground/[0.02] -z-[1]" />
      <Card className="w-[90%] max-w-[440px] mx-auto bg-background/10 backdrop-blur-xl border-primary/20 shadow-2xl">
        <CardHeader className="pb-6">
          <WalletSetupHeader />
        </CardHeader>
        <CardContent className="space-y-8 px-6 pb-8">
          <WalletActionButtons />
        </CardContent>
      </Card>
    </div>
  );
}
