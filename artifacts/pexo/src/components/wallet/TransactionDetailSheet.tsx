import { useState } from "react";
import { useLocation } from "wouter";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Copy, CheckCheck, ExternalLink } from "@/lib/icons";
import { format } from "date-fns";
import { formatCryptoAmount } from "@/lib/wallet-api";

export interface TxForDetail {
  id: string;
  type: string;
  crypto_symbol: string;
  amount: number;
  status: "pending" | "completed" | "failed" | "cancelled";
  tx_hash: string | null;
  from_address: string | null;
  to_address: string | null;
  confirmations: number | null;
  created_at: string;
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(value).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="ml-1.5 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0" title="Copy">
      {copied ? <CheckCheck className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

function TxDetailRow({ label, value, copiable }: { label: string; value: string; copiable?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3.5 border-b border-border/50 last:border-0">
      <span className="text-sm text-muted-foreground flex-shrink-0">{label}</span>
      <div className="flex items-start gap-0.5 text-right">
        <span className="text-sm font-medium text-foreground break-all">{value}</span>
        {copiable && value !== "—" && <CopyButton value={value} />}
      </div>
    </div>
  );
}

function statusLabel(status: TxForDetail["status"]) {
  switch (status) {
    case "completed": return "Succeeded";
    case "pending": return "Pending";
    case "failed": return "Failed";
    case "cancelled": return "Cancelled";
    default: return status;
  }
}

function statusColors(status: TxForDetail["status"]) {
  switch (status) {
    case "completed": return "text-green-500 bg-green-500/10";
    case "pending": return "text-yellow-500 bg-yellow-500/10";
    case "failed": return "text-red-500 bg-red-500/10";
    case "cancelled": return "text-gray-500 bg-gray-500/10";
    default: return "text-muted-foreground bg-muted/20";
  }
}

function txTitle(type: string) {
  switch (type) {
    case "deposit": return "Deposit Details";
    case "withdrawal": return "Withdrawal Details";
    case "swap": return "Swap Details";
    case "p2p_buy": return "P2P Purchase Details";
    case "p2p_sell": return "P2P Sale Details";
    case "escrow_lock": return "Escrow Lock Details";
    case "escrow_release": return "Escrow Release Details";
    case "fee": return "Fee Details";
    default: return "Transaction Details";
  }
}

function formatQuantity(amount: number, symbol: string): string {
  return `${formatCryptoAmount(amount, symbol)} ${symbol}`;
}

export function TransactionDetailSheet({
  tx,
  open,
  onClose,
}: {
  tx: TxForDetail | null;
  open: boolean;
  onClose: () => void;
}) {
  const [, setLocation] = useLocation();
  if (!tx) return null;

  // Notifications already receive the sender address for deposits. Use that
  // same value here so the detail sheet does not show a blank address when
  // the monitor omits the destination field.
  const address = tx.from_address;
  const addressLabel = tx.type === "deposit" ? "Deposit Address" : "Withdrawal Address";
  const accountLabel = tx.type === "deposit" ? "Deposit Account" : "Withdrawal Account";
  const explorerPath = tx.tx_hash
    ? `/explorer/transaction/${tx.tx_hash}`
    : address
      ? `/explorer/address/${address}`
      : "/explorer";

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[90dvh] overflow-y-auto p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border/50">
          <SheetTitle className="text-center text-base font-semibold">{txTitle(tx.type)}</SheetTitle>
        </SheetHeader>

        <div className="px-6 py-6 flex flex-col items-center gap-2 border-b border-border/50">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">Quantity</p>
          <p className="text-3xl font-bold text-foreground">
            {formatQuantity(tx.amount, tx.crypto_symbol)}
          </p>
          <span className={`mt-1 inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full ${statusColors(tx.status)}`}>
            {tx.status === "completed" && (
              <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="7" fill="currentColor" fillOpacity="0.2" />
                <path d="M4 7l2.5 2.5L10 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {statusLabel(tx.status)}
          </span>
        </div>

        <div className="px-6 py-2">
          <TxDetailRow label={accountLabel} value="Funding Account" />
          <TxDetailRow label="Chain Type" value={tx.crypto_symbol} />
          <TxDetailRow label="Time" value={format(new Date(tx.created_at), "yyyy-MM-dd HH:mm:ss")} />
          <TxDetailRow label={addressLabel} value={address ?? "—"} copiable={!!address} />
          <TxDetailRow
            label="Confirmations"
            value={tx.confirmations == null ? "—" : String(tx.confirmations)}
          />
          <TxDetailRow label="Transaction Hash" value={tx.tx_hash ?? "—"} copiable={!!tx.tx_hash} />
        </div>

        <div className="px-6 pb-8 pt-4">
          <Button
            variant="outline"
            className="w-full rounded-full border-border h-12 text-sm font-semibold gap-2"
            onClick={() => { onClose(); setLocation(explorerPath); }}
          >
            View in Pexly Explorer
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
