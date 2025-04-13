import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

const LAMPORTS_PER_SOL = 1000000000;

export type CurrencyUnit = "lamports" | "sol";

interface AmountInputProps {
  amount: number;
  setAmount: (amount: number) => void;
  currencyUnit: CurrencyUnit;
  setCurrencyUnit: (unit: CurrencyUnit) => void;
  availableBalance: number; // Balance in USD
  disabled?: boolean;
  className?: string;
  getEquivalentValue: (
    amount: number,
    from: CurrencyUnit,
    to: CurrencyUnit
  ) => number;
}

export function AmountInput({
  amount,
  setAmount,
  currencyUnit,
  setCurrencyUnit,
  availableBalance,
  disabled = false,
  className,
  getEquivalentValue,
}: AmountInputProps) {
  // Calculate max amount based on current unit and balance
  const getMaxAmount = () => {
    if (currencyUnit === "lamports") {
      return Math.floor(availableBalance * LAMPORTS_PER_SOL);
    } else {
      return parseFloat(availableBalance.toFixed(9));
    }
  };

  // Calculate percentage of max amount
  const setPercentageOfMax = (percentage: number) => {
    if (currencyUnit === "lamports") {
      setAmount(
        Math.floor(availableBalance * LAMPORTS_PER_SOL * (percentage / 100))
      );
    } else {
      setAmount(parseFloat((availableBalance * (percentage / 100)).toFixed(9)));
    }
  };

  // Get equivalent amount in other unit
  const getEquivalentAmounts = () => {
    if (amount <= 0) return null;

    const units: CurrencyUnit[] = ["lamports", "sol"];
    const currentUnitIndex = units.indexOf(currencyUnit);
    const otherUnit = units[(currentUnitIndex + 1) % 2];

    const value = getEquivalentValue(amount, currencyUnit, otherUnit);
    const formattedValue =
      otherUnit === "sol"
        ? `${value.toLocaleString(undefined, { maximumFractionDigits: 9 })} SOL`
        : `${Math.floor(value).toLocaleString()} lamports`;

    return (
      <div className="text-xs text-muted-foreground mt-2">
        ≈ {formattedValue}
      </div>
    );
  };

  return (
    <div className={className}>
      <div className="space-y-4">
        {/* Amount Input with Units */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Input
              type="number"
              placeholder="0"
              className="w-full rounded-lg border border-input pr-12"
              value={amount || ""}
              onChange={(e) => setAmount(Number(e.target.value))}
              min="0"
              step={currencyUnit === "lamports" ? "1" : "0.000001"}
              disabled={disabled}
            />
            {amount > 0 && (
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setAmount(0)}
                aria-label="Clear amount"
              >
                Clear
              </button>
            )}
          </div>

          <Select
            value={currencyUnit}
            onValueChange={(value) => setCurrencyUnit(value as CurrencyUnit)}
            disabled={disabled}
          >
            <SelectTrigger className="w-[110px] shrink-0">
              <SelectValue placeholder="Unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lamports">lamports</SelectItem>
              <SelectItem value="sol">SOL</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Display equivalent amount */}
        {getEquivalentAmounts()}

        {/* Quick amount buttons */}
        <div className="flex flex-wrap gap-2">
          {[25, 50, 75, 100].map((percent) => (
            <Button
              key={percent}
              type="button"
              variant={percent === 100 ? "default" : "outline"}
              size="sm"
              className={`px-3 py-1 h-8 text-xs ${
                percent === 100 ? "bg-primary/90 hover:bg-primary" : ""
              }`}
              onClick={() => setPercentageOfMax(percent)}
              disabled={disabled || availableBalance <= 0}
            >
              {percent === 100 ? "Max" : `${percent}%`}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
