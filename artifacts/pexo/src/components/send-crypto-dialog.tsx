import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, CheckCircle2, ExternalLink, Loader2, Send, ShieldCheck } from "@/lib/icons";
import { useEvmWallet } from "@/lib/evm-wallet-provider";
import { useEvmWalletData } from "@/hooks/use-evm-wallet-data";
import { transactionExplorerUrl } from "@/lib/reown-config";

interface SendCryptoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialSymbol?: string;
  onSuccess?: () => void;
}

export function SendCryptoDialog({ open, onOpenChange, initialSymbol, onSuccess }: SendCryptoDialogProps) {
  const wallet = useEvmWallet();
  const { assets } = useEvmWalletData();
  const [assetId, setAssetId] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [sentHash, setSentHash] = useState<`0x${string}` | null>(null);
  const activeAssets = useMemo(() => assets.filter((asset) => asset.chainId === wallet.chainId), [assets, wallet.chainId]);
  const selectedAsset = activeAssets.find((asset) => asset.id === assetId);
  const amountNumber = Number(amount);
  const insufficient = !!selectedAsset && Number.isFinite(amountNumber) && amountNumber > selectedAsset.balance;

  useEffect(() => {
    if (!open) return;
    const matched = activeAssets.find((asset) => asset.symbol.toLowerCase() === initialSymbol?.toLowerCase());
    setAssetId(matched?.id ?? activeAssets[0]?.id ?? "");
    setTo("");
    setAmount("");
    setError("");
    setSent(false);
    setSentHash(null);
  }, [open, initialSymbol]);

  useEffect(() => {
    if (!open || assetId || activeAssets.length === 0) return;
    const matched = activeAssets.find((asset) => asset.symbol.toLowerCase() === initialSymbol?.toLowerCase());
    setAssetId(matched?.id ?? activeAssets[0].id);
  }, [open, assetId, activeAssets, initialSymbol]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!wallet.isConnected || wallet.chainId == null) {
      setError("Connect a wallet on a supported network before sending.");
      return;
    }
    if (!selectedAsset) {
      setError("Choose an asset available on the connected network.");
      return;
    }
    if (!/^0x[a-fA-F0-9]{40}$/.test(to.trim())) {
      setError("Enter a valid EVM recipient address.");
      return;
    }
    if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }
    if (insufficient) {
      setError("The amount is greater than your available balance.");
      return;
    }
    setSubmitting(true);
    try {
      let hash: `0x${string}`;
      if (selectedAsset.isNative) {
        hash = await wallet.sendNative({ to: to.trim(), amount, symbol: selectedAsset.symbol, chainId: selectedAsset.chainId });
      } else if (selectedAsset.contractAddress) {
        hash = await wallet.sendToken({
          tokenAddress: selectedAsset.contractAddress,
          to: to.trim(),
          amount,
          symbol: selectedAsset.symbol,
          decimals: selectedAsset.decimals,
          chainId: selectedAsset.chainId,
        });
      } else {
        throw new Error("This token does not have a contract address on the connected network.");
      }
      setSentHash(hash);
      setSent(true);
      onSuccess?.();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The transaction could not be completed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!submitting) onOpenChange(next); }}>
      <DialogContent className="sm:max-w-[460px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Send crypto</DialogTitle>
          <DialogDescription>Review the recipient and network in your wallet before approving.</DialogDescription>
        </DialogHeader>
        {sent ? (
          <div className="py-7 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#edf6e3] text-[#4e7838]"><CheckCircle2 className="h-6 w-6" /></div>
            <h3 className="font-bold text-lg">Transaction submitted</h3>
            <p className="mt-1 text-sm text-muted-foreground">Your connected wallet handled the transaction approval.</p>
            {sentHash && (
              <div className="mt-4 rounded-lg bg-muted/50 p-3 text-left">
                <p className="text-xs font-medium text-muted-foreground">Transaction hash</p>
                <p className="mt-1 break-all font-mono text-xs">{sentHash}</p>
                {wallet.chainId && transactionExplorerUrl(wallet.chainId, sentHash) && (
                  <a
                    href={transactionExplorerUrl(wallet.chainId, sentHash)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                  >
                    View on block explorer <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            )}
            <Button className="mt-6 w-full" onClick={() => onOpenChange(false)}>Done</Button>
          </div>
        ) : !wallet.isConnected ? (
          <div className="rounded-xl border border-dashed p-6 text-center">
            <p className="font-semibold">Connect a wallet to send</p>
            <p className="mt-1 text-sm text-muted-foreground">Pexly does not store your keys or approve transfers for you.</p>
            <Button className="mt-4" disabled={wallet.isConnecting} onClick={() => void wallet.openConnect()}>{wallet.isConnecting ? "Connecting…" : "Connect wallet"}</Button>
          </div>
        ) : (
          <form onSubmit={(event) => void submit(event)} className="space-y-5">
            <div className="rounded-lg bg-[#f2f6ed] px-3 py-2.5 text-xs text-[#425d36] flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0" />{wallet.chainName || `Chain ${wallet.chainId}`} · transaction approval stays in your wallet
            </div>
            <div className="space-y-2">
              <Label htmlFor="send-asset">Asset</Label>
              <Select value={assetId} onValueChange={setAssetId}>
                <SelectTrigger id="send-asset"><SelectValue placeholder="Select an asset" /></SelectTrigger>
                <SelectContent>
                  {activeAssets.map((asset) => <SelectItem key={asset.id} value={asset.id}>{asset.name} ({asset.symbol.toUpperCase()}) · {asset.balance.toLocaleString("en-US", { maximumFractionDigits: 6 })}</SelectItem>)}
                </SelectContent>
              </Select>
              {activeAssets.length === 0 && <p className="text-xs text-muted-foreground">No supported assets are available on this network.</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="send-recipient">Recipient address</Label>
              <Input id="send-recipient" value={to} onChange={(event) => setTo(event.target.value)} placeholder="0x…" autoComplete="off" spellCheck={false} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="send-amount">Amount {selectedAsset ? `(${selectedAsset.symbol.toUpperCase()})` : ""}</Label>
              <Input id="send-amount" type="number" min="0" step="any" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00" />
              {selectedAsset && <p className="text-xs text-muted-foreground">Available: {selectedAsset.balance.toLocaleString("en-US", { maximumFractionDigits: 8 })} {selectedAsset.symbol.toUpperCase()}</p>}
            </div>
            {error && <div role="alert" className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"><AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />{error}</div>}
            <Button type="submit" disabled={submitting || !selectedAsset || !to || !amount} className="w-full h-11 bg-[#d8ff85] text-[#091e1c] hover:bg-[#c9f16f] font-bold">
              {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Confirm in wallet…</> : <><Send className="mr-2 h-4 w-4" />Continue to wallet</>}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
