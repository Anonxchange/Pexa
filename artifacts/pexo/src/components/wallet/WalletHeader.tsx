import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEvmWallet } from "@/lib/evm-wallet-provider";
import { useEvmWalletData } from "@/hooks/use-evm-wallet-data";
import { Eye, EyeOff, Copy, Send, WalletAdd, ChevronDown, LogOut, AlertCircle } from "@/lib/icons";
import { useToast } from "@/hooks/use-toast";

interface WalletHeaderProps {
  onSend: () => void;
  onReceive: () => void;
}

export function WalletHeader({ onSend, onReceive }: WalletHeaderProps) {
  const wallet = useEvmWallet();
  const { assets, totalUsd, isLoading, error } = useEvmWalletData();
  const { toast } = useToast();
  const [showBalance, setShowBalance] = useState(true);
  const hasAssets = assets.some((asset) => asset.balance > 0);
  const addressLabel = wallet.address ? `${wallet.address.slice(0, 7)}…${wallet.address.slice(-5)}` : "";
  const walletError = wallet.error || "";

  const copyAddress = async () => {
    if (!wallet.address) return;
    try {
      await navigator.clipboard.writeText(wallet.address);
      toast({ title: "Address copied", description: "Your wallet address is on the clipboard." });
    } catch {
      toast({ title: "Copy unavailable", description: "Select the address and copy it manually." });
    }
  };

  const connect = async () => {
    try {
      await wallet.openConnect();
    } catch (reason) {
      toast({ title: "Could not open wallet", description: reason instanceof Error ? reason.message : "Please try again." });
    }
  };

  const changeNetwork = async () => {
    try {
      await wallet.openNetworkSwitcher();
    } catch (reason) {
      toast({ title: "Could not switch network", description: reason instanceof Error ? reason.message : "Please try again." });
    }
  };

  const disconnect = async () => {
    try {
      await wallet.disconnect();
    } catch (reason) {
      toast({ title: "Could not disconnect", description: reason instanceof Error ? reason.message : "Please try again." });
    }
  };

  return (
    <div className="bg-[#eaf1e3] dark:bg-card overflow-hidden transition-colors">
      <div className="p-5 sm:p-6">
        {!wallet.isConnected ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-2">Wallet balance</div>
              <div className="text-3xl sm:text-4xl font-bold tracking-tight text-[#091e1c] dark:text-foreground">Connect a wallet</div>
              <p className="text-sm text-muted-foreground mt-2">Use a compatible wallet to view on-chain assets and send transactions.</p>
              {walletError && <p role="alert" className="text-xs text-destructive mt-2">{walletError}</p>}
            </div>
            <Button onClick={() => void connect()} disabled={wallet.isConnecting} className="h-11 rounded-lg bg-[#d8ff85] text-[#091e1c] hover:bg-[#c9f16f] font-bold px-5">
              {wallet.isConnecting ? "Connecting…" : "Connect or Create Wallet"}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-sm font-medium">Wallet balance</span>
                  <button onClick={() => setShowBalance((visible) => !visible)} className="hover:text-foreground" aria-label={showBalance ? "Hide wallet balance" : "Show wallet balance"}>
                    {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                </div>
                <div className="text-4xl font-bold tracking-tight text-[#091e1c] dark:text-foreground">
                  {isLoading ? <Skeleton className="h-9 w-36" /> : showBalance ? `$${totalUsd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "••••••"}
                </div>
                <div className="text-sm text-muted-foreground">
                  {isLoading ? <Skeleton className="h-4 w-40" /> : hasAssets ? "On-chain portfolio value" : "No supported assets found on this network"}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="h-9 gap-2 bg-background" onClick={onSend}><Send className="h-4 w-4" />Send</Button>
                <Button variant="outline" size="sm" className="h-9 gap-2 bg-background" onClick={onReceive}><WalletAdd className="h-4 w-4" />Receive</Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#d4dfce] pt-4">
              <div className="flex min-w-0 items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#5c8a42]" />
                <span className="text-sm font-semibold">{wallet.chainName || "Connected network"}</span>
                <span className="text-muted-foreground">·</span>
                <span className="font-mono text-xs text-muted-foreground">{addressLabel}</span>
                <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Copy wallet address" onClick={() => void copyAddress()}><Copy className="h-3.5 w-3.5" /></Button>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs" onClick={() => void changeNetwork()}><ChevronDown className="h-3.5 w-3.5" />Network</Button>
                <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs text-muted-foreground" onClick={() => void disconnect()}><LogOut className="h-3.5 w-3.5" />Disconnect</Button>
              </div>
            </div>
            {(error || walletError) && (
              <div role="alert" className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />{error instanceof Error ? error.message : walletError || "Balances could not be loaded."}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
