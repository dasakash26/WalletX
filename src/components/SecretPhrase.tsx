import { useState } from "react";
import { Copy, Shield, Eye, EyeOff, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { motion, Variants } from "framer-motion";
import { toast } from "sonner";

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const gridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 0.1 } },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 5 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05 },
  }),
};

interface BackupPhraseProps {
  phrase: string;
  onConfirm: () => Promise<void>;
}

export function SecretPhrase({ phrase, onConfirm }: BackupPhraseProps) {
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isBlurred, setIsBlurred] = useState(true);
  const words = phrase.split(" ");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(phrase);
      toast[isBlurred ? "warning" : "success"](
        isBlurred ? "Phrase copied while hidden" : "Recovery phrase copied",
        {
          description: isBlurred
            ? "Make sure no one can see your screen"
            : "Make sure to store it securely",
          icon: <Shield className="w-4 h-4 text-primary" />,
          className: "border-primary/20 bg-primary/10",
        }
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error("Failed to copy phrase", {
        description: errorMessage,
        icon: <Copy className="w-4 h-4 text-destructive" />,
        className: "border-destructive/20 bg-destructive/10",
      });
    }
  };

  const handleConfirm = async () => {
    if (!isAcknowledged) return;

    try {
      setIsConfirming(true);
      await onConfirm();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error("Failed to create wallet", {
        description: errorMessage,
        icon: <Shield className="w-4 h-4 text-destructive" />,
        className: "border-destructive/20 bg-destructive/10",
      });
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto p-6 md:p-10 space-y-6 bg-background/60 backdrop-blur-xl border-border shadow-xl">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground/90 tracking-tight">
          Secure Your Wallet
        </h2>
        <p className="text-base md:text-md text-muted-foreground max-w-2xl">
          Save these 12 words carefully. This is your only way to recover your
          wallet.
        </p>
      </motion.div>

      <motion.div
        variants={gridVariants}
        initial="hidden"
        animate="visible"
        className="relative grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 p-5 md:p-6 rounded-xl bg-gradient-to-br from-muted/30 to-muted/50"
      >
        {words.map((word, index) => (
          <motion.div
            key={index}
            custom={index}
            variants={wordVariants}
            initial="hidden"
            animate="visible"
          >
            <div
              className={`relative p-3 md:p-4 text-center rounded-xl bg-background/90 border border-border/40 hover:border-primary/30 hover:bg-background transition-all duration-300 shadow-sm ${
                isBlurred ? "blur-md select-none" : ""
              }`}
              aria-label={
                isBlurred
                  ? "Hidden recovery word"
                  : `Recovery word ${index + 1}: ${word}`
              }
            >
              <span className="absolute -top-2.5 left-2.5 px-2 py-0.5 text-[11px] font-medium text-muted-foreground bg-background rounded-full border border-border/50">
                {index + 1}
              </span>
              <span className="text-sm md:text-base font-medium text-foreground/90">
                {word}
              </span>
            </div>
          </motion.div>
        ))}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="outline"
            size="sm"
            className={`backdrop-blur-sm bg-background/80 hover:bg-background/90 transition-all duration-300 rounded-xl px-4 ${
              !isBlurred ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
            onClick={() => setIsBlurred(false)}
          >
            <Eye className="w-3.5 h-3.5 mr-2" />
            Reveal Phrase
          </Button>
        </div>
      </motion.div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="default"
          className="flex-1 bg-background/80 hover:bg-background transition-all duration-300 shadow-sm h-12 rounded-xl text-base"
          onClick={handleCopy}
          aria-label={
            isBlurred ? "Copy hidden recovery phrase" : "Copy recovery phrase"
          }
        >
          <Copy className="w-4 h-4 mr-2 opacity-80" />
          Copy Phrase
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 bg-background/80 hover:bg-background transition-all duration-300 shadow-sm rounded-xl"
          onClick={() => setIsBlurred(!isBlurred)}
          aria-label={
            isBlurred ? "Show recovery phrase" : "Hide recovery phrase"
          }
        >
          {isBlurred ? (
            <Eye className="w-5 h-5" />
          ) : (
            <EyeOff className="w-5 h-5" />
          )}
        </Button>
      </div>

      <div className="flex items-start space-x-4 p-3 rounded-xl bg-warning/10">
        <Checkbox
          id="acknowledge"
          checked={isAcknowledged}
          onCheckedChange={(checked) => setIsAcknowledged(checked as boolean)}
          className="mt-1.5"
        />
        <label
          htmlFor="acknowledge"
          className="text-sm leading-relaxed text-muted-foreground"
        >
          I understand that losing my recovery phrase means permanent loss of
          access to my wallet.
        </label>
      </div>

      <Button
        className="w-full h-13 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed text-lg rounded-xl"
        disabled={!isAcknowledged || isConfirming}
        onClick={handleConfirm}
        aria-busy={isConfirming}
      >
        {isConfirming ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Creating wallet...
          </>
        ) : (
          "Continue"
        )}
      </Button>
    </Card>
  );
}
