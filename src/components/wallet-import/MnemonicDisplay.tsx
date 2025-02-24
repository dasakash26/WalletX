import { motion } from "framer-motion";

interface MnemonicDisplayProps {
  words: string[];
}

export const MnemonicDisplay = ({ words }: MnemonicDisplayProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-3 gap-2 p-4 bg-muted/30 rounded-lg"
    >
      {words.map((word, index) => (
        <div
          key={index}
          className="flex items-center gap-2 p-2 bg-background rounded border border-border/50"
        >
          <span className="text-muted-foreground text-sm">{index + 1}.</span>
          <span className="font-mono">{word}</span>
        </div>
      ))}
    </motion.div>
  );
};
