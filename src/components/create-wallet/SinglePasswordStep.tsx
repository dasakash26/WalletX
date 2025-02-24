import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface SinglePasswordStepProps {
  password: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  error: string | null;
}

export function SinglePasswordStep({
  password,
  onChange,
  onSubmit,
  error,
}: SinglePasswordStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-lg mx-auto bg-background/60 backdrop-blur-xl border-border shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Enter Your Wallet Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <Input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={onChange}
              placeholder="Enter your existing wallet password"
            />
            <Button type="submit" className="w-full">
              Continue
            </Button>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
