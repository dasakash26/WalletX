export function Footer() {
  return (
    <footer className="border-t border-border/40">
      <div className="container max-w-7xl mx-auto py-4">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} WalletX. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
