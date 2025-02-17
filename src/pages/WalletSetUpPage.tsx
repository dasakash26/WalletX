import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { WalletSetupHeader } from "@/components/wallet-setup/WalletSetupHeader";
import { WalletActionButtons } from "@/components/wallet-setup/WalletActionButtons";

export default function WalletSetupPage() {
  return (
    <div className="min-h-[100vh] w-full flex items-center justify-center p-6">
      <Card className="w-[90%] max-w-[440px] shadow-lg mx-auto">
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
