import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CopyIcon, CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWalletGeneration } from "@/hooks/useWalletGeneration";

export default function WalletFromMnemonic() {
  const {
    mnemonic,
    setMnemonic,
    isGenerating,
    publicKey,
    privateKey,
    copied,
    mnemonicWords,
    generateWallet,
    copyToClipboard,
  } = useWalletGeneration();

  return (
    <div className="container mx-auto max-w-2xl p-6 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur-3xl" />
      <Card className="border border-border/20 bg-card/10 backdrop-blur-xl shadow-xl relative">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Generate Wallet from Mnemonic
          </CardTitle>
          <CardDescription className="text-center">
            Enter your mnemonic phrase to generate a wallet
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10 backdrop-blur-sm">
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="mnemonic">Mnemonic Phrase</Label>
              <Input
                id="mnemonic"
                placeholder="Enter your mnemonic phrase"
                value={mnemonic}
                onChange={(e) => setMnemonic(e.target.value)}
                className="h-12"
              />

              {mnemonicWords.length > 0 && (
                <div className="mt-4">
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-4 bg-muted rounded-lg backdrop-blur-sm">
                    {mnemonicWords.map((word, index) => (
                      <div key={index} className="relative flex items-center">
                        <span className="absolute left-2 text-xs text-muted-foreground">
                          {index + 1}
                        </span>
                        <div className="w-full p-2 pl-7 bg-background/50 border border-border rounded-md text-sm">
                          {word}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {(publicKey || privateKey) && (
              <div className="grid gap-4">
                {publicKey && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Public Key</Label>
                    <div className="flex items-center gap-2 group relative">
                      <div className="flex-1 p-3 bg-black/10 dark:bg-white/10 backdrop-blur-sm rounded-lg border border-border/50 font-mono text-sm relative overflow-hidden">
                        {publicKey}
                        {copied === "public" && (
                          <div className="absolute inset-0 animate-sonar">
                            <div className="absolute inset-0 rounded-lg bg-primary/20" />
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(publicKey, "public")}
                        className={cn(
                          "transition-all duration-200 hover:bg-primary/10",
                          copied === "public" && "text-primary"
                        )}
                      >
                        {copied === "public" ? (
                          <CheckIcon className="h-4 w-4" />
                        ) : (
                          <CopyIcon className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {privateKey && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Private Key</Label>
                    <div className="flex items-center gap-2 group relative">
                      <div className="flex-1 p-3 bg-destructive/5 dark:bg-destructive/10 backdrop-blur-sm rounded-lg border border-destructive/20 font-mono text-sm relative overflow-x-auto">
                        <div className="break-all whitespace-pre-wrap">
                          {privateKey}
                        </div>
                        {copied === "private" && (
                          <div className="absolute inset-0 animate-sonar">
                            <div className="absolute inset-0 rounded-lg bg-destructive/20" />
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(privateKey, "private")}
                        className={cn(
                          "transition-all duration-200 hover:bg-destructive/10",
                          copied === "private" && "text-destructive"
                        )}
                      >
                        {copied === "private" ? (
                          <CheckIcon className="h-4 w-4" />
                        ) : (
                          <CopyIcon className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="relative z-10">
          <Button
            onClick={generateWallet}
            disabled={!mnemonic || isGenerating}
            className="w-full h-12 text-lg font-medium bg-primary hover:bg-primary/90"
          >
            {isGenerating ? "Generating..." : "Generate Wallet"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
