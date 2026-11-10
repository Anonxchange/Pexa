import { useHead } from "@unhead/react";
import { useState } from "react";
import { useLocation } from "wouter";
import { SendCryptoDialog } from "@/components/send-crypto-dialog";
import { ReceiveCryptoDialog } from "@/components/receive-crypto-dialog";
import { WalletHeader } from "@/components/wallet/WalletHeader";
import { AssetList } from "@/components/wallet/AssetList";
import { useEvmWallet } from "@/lib/evm-wallet-provider";
import { useEvmWalletData } from "@/hooks/use-evm-wallet-data";
import { useWalletAccountLink } from "@/hooks/use-wallet-account-link";
import { RecentActivity } from "@/components/wallet/RecentActivity";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, ShieldCheck, Globe } from "@/lib/icons";

export default function WalletPage() {
  useHead({
    title: "My Wallet | Pexly",
    meta: [{ name: "description", content: "Manage your self-custodied crypto assets with Pexly." }],
  });
  const [, setLocation] = useLocation();
  const wallet = useEvmWallet();
  const walletLink = useWalletAccountLink();
  const { refetch } = useEvmWalletData();
  const [sendOpen, setSendOpen] = useState(false);
  const [receiveOpen, setReceiveOpen] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState<string>();

  const openSend = (symbol?: string) => {
    setSelectedSymbol(symbol);
    setSendOpen(true);
  };
  const openReceive = () => setReceiveOpen(true);
  const linkCurrentWallet = async () => {
    try {
      await walletLink.linkCurrentWallet();
    } catch {
      // Error is shown inline by the wallet-link status card.
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#f7faf1] dark:bg-background transition-colors">
      <div className="flex-1 w-full mx-auto px-0 sm:px-6 lg:px-8 py-4 sm:py-8 max-w-7xl">
        <div className="mb-6 sm:mb-8 px-4 sm:px-0 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#66864d] mb-2">Self-custody</p>
            <h1 className="text-3xl font-bold text-foreground">My assets</h1>
          </div>
          <span className="text-xs text-muted-foreground">Your keys stay with your wallet provider.</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8">
          <div className="lg:col-span-8 space-y-4 sm:space-y-8">
            <Card className="mx-4 sm:mx-0 border border-[#e7ede2] shadow-[0_12px_32px_rgba(19,56,43,.06)] bg-[#fffefa] dark:bg-card rounded-[16px]">
              <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className={`rounded-xl p-3 ${walletLink.status === "linked" ? "bg-[#edf6e3] text-[#4e7838]" : "bg-[#f0f7e4] text-[#486737]"}`}>
                  {walletLink.status === "linked" ? <CheckCircle2 className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-bold">
                    {walletLink.status === "loading"
                      ? "Checking linked wallet…"
                      : walletLink.status === "linked"
                        ? "Wallet linked and active"
                        : walletLink.status === "disconnected"
                          ? "Linked wallet — reconnect to transact"
                          : walletLink.status === "different"
                            ? "Connected wallet does not match"
                            : "Connect or Create Wallet"}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {walletLink.status === "linked"
                      ? wallet.address
                      : walletLink.linkedAddress
                        ? `Saved address: ${walletLink.linkedAddress}`
                        : "Connect a wallet to link it to your signed-in Pez account. You approve every transaction in your wallet."}
                  </p>
                  {walletLink.error && <p role="alert" className="mt-2 text-xs text-destructive">{walletLink.error}</p>}
                </div>
                {(walletLink.status === "disconnected" || (walletLink.status === "unlinked" && !wallet.isConnected)) ? (
                  <Button
                    className="shrink-0 bg-[#d8ff85] text-[#091e1c] hover:bg-[#c9f16f] font-bold"
                    disabled={!wallet.configured || wallet.isConnecting || walletLink.loading}
                    onClick={() => wallet.openConnect()}
                  >
                    {!wallet.configured ? "Wallet setup unavailable" : walletLink.status === "disconnected" ? "Reconnect wallet" : "Connect or Create Wallet"}
                  </Button>
                ) : walletLink.status === "different" || (wallet.isConnected && walletLink.status === "unlinked") ? (
                  <Button
                    className="shrink-0 bg-[#d8ff85] text-[#091e1c] hover:bg-[#c9f16f] font-bold"
                    disabled={walletLink.linking}
                    onClick={() => void linkCurrentWallet()}
                  >
                    {walletLink.linking ? "Verifying…" : "Verify and Link"}
                  </Button>
                ) : null}
              </CardContent>
            </Card>
            <div className="space-y-4 sm:space-y-6">
              <div className="px-4 sm:px-0">
                <Tabs defaultValue="wallet" className="w-full">
                  <TabsList className="bg-transparent p-0 h-auto gap-1">
                    <TabsTrigger value="wallet" className="rounded-lg px-6 py-2 font-semibold border border-border bg-[#fffefa] text-foreground transition-colors dark:bg-muted data-[state=active]:bg-[#d8ff85] data-[state=active]:text-[#091e1c] data-[state=active]:border-[#d8ff85]">
                      Wallet
                    </TabsTrigger>
                    <TabsTrigger
                      value="virtual-numbers"
                      onClick={() => setLocation("/wallet/virtual-numbers")}
                      className="rounded-lg px-6 py-2 font-semibold border border-border bg-[#fffefa] dark:bg-muted text-foreground/80 hover:text-foreground hover:bg-muted/80 transition-colors"
                    >
                      Virtual Numbers
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {!wallet.configured ? (
                <Card className="border border-[#e7ede2] shadow-[0_16px_40px_rgba(19,56,43,.07)] bg-[#fffefa] dark:bg-card rounded-[18px]">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex gap-4 items-start">
                      <div className="rounded-xl bg-[#f0f7e4] p-3 text-[#486737]"><AlertCircle className="h-5 w-5" /></div>
                      <div className="space-y-2">
                        <h2 className="text-lg font-bold">Wallet connection is not configured</h2>
                        <p className="text-sm text-muted-foreground max-w-xl">
                          Pexly needs a Reown project ID before a wallet can connect. Add <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">VITE_REOWN_PROJECT_ID</code> to the app environment, then reload this page.
                        </p>
                        <p className="text-xs text-muted-foreground">No account or Pexly vault is required to use this wallet.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border border-[#e7ede2] shadow-[0_16px_40px_rgba(19,56,43,.07)] bg-[#fffefa] dark:bg-card overflow-hidden rounded-[18px] transition-colors">
                  <CardContent className="p-0">
                    <div className="divide-y divide-border">
                      <WalletHeader onSend={() => openSend()} onReceive={openReceive} />
                      <div className="p-4 sm:p-6">
                        <AssetList onSend={openSend} onReceive={openReceive} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              {wallet.configured && wallet.isConnected && (
                <section className="px-4 sm:px-0 space-y-3">
                  <div>
                    <h2 className="text-lg font-bold">Recent activity</h2>
                    <p className="text-sm text-muted-foreground">Transactions submitted during this session and available wallet history.</p>
                  </div>
                  <RecentActivity type="activity" pendingActivity={wallet.recentActivity} />
                </section>
              )}
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-5 px-4 sm:px-0">
            <Card className="border border-[#e7ede2] shadow-[0_12px_32px_rgba(19,56,43,.06)] bg-[#fffefa] dark:bg-card rounded-[16px]">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="rounded-lg bg-[#eef5e6] p-2 text-[#486737]"><ShieldCheck className="h-4 w-4" /></div>
                  <h2 className="font-bold text-sm">You stay in control</h2>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Transactions are approved in your connected wallet. Pexly never asks for a recovery phrase or private key.
                </p>
              </CardContent>
            </Card>
            {wallet.configured && (
              <Card className="border border-[#e7ede2] shadow-[0_12px_32px_rgba(19,56,43,.06)] bg-[#fffefa] dark:bg-card rounded-[16px]">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="rounded-lg bg-[#eef5e6] p-2 text-[#486737]"><Globe className="h-4 w-4" /></div>
                    <h2 className="font-bold text-sm">Network & balances</h2>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    Asset balances are read from the connected address on supported EVM networks. Network availability depends on your wallet.
                  </p>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => void refetch()}>
                    Refresh balances
                  </Button>
                </CardContent>
              </Card>
            )}
          </aside>
        </div>
      </div>

      <SendCryptoDialog open={sendOpen} onOpenChange={setSendOpen} initialSymbol={selectedSymbol} onSuccess={() => void refetch()} />
      <ReceiveCryptoDialog open={receiveOpen} onOpenChange={setReceiveOpen} />
    </div>
  );
}
