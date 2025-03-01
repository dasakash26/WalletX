import { NavigateFunction } from "react-router";
import { Plus, LogOut, MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import ChainSwitcher from "../ChainSwitcher";
import { clearWallets } from "@/utils/storage";
import type { Wallet } from "@/types/wallet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface HeaderActionsProps {
  navigate: NavigateFunction;
  wallets: Wallet[] | null;
}

export function HeaderActions({ navigate, wallets }: HeaderActionsProps) {
  const handleLogout = () => {
    clearWallets();
    navigate("/auth");
  };

  return (
    <div className="bh-background flex items-center gap-2">
      <ChainSwitcher />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => navigate("/wallet-setup")}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Wallet
          </DropdownMenuItem>

          {wallets && wallets?.length > 0 && (
            <LogoutMenuItem onLogout={handleLogout} />
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function LogoutMenuItem({ onLogout }: { onLogout: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will log you out and clear all wallet data from this browser.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onLogout}>Logout</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
