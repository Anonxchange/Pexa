import { useState, useMemo, useRef, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ArrowDownLeft, ArrowUpRight, RefreshCw,
  ArrowRight, ChevronDown, Check, ExternalLink, X,
} from '@/lib/icons';
import { WalletTransaction, formatCryptoAmount } from "@/lib/wallet-api";
import { useWalletActivity } from "@/hooks/use-wallet-activity";
import { format, subDays, subMonths, startOfDay, isAfter } from "date-fns";
import { TransactionDetailSheet } from "@/components/wallet/TransactionDetailSheet";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { EvmWalletActivity } from "@/lib/evm-wallet-provider";

interface RecentActivityProps {
  type: "activity" | "operations";
  onDeposit?: (symbol?: string) => void;
  pendingActivity?: EvmWalletActivity[];
}

const TX_TYPE_LABELS: Record<string, string> = {
  deposit: "Deposit",
  withdrawal: "Withdrawal",
  swap: "Swap",
};

const STATUS_LABELS: Record<string, string> = {
  completed: "Completed",
  pending: "Pending",
  failed: "Failed",
  cancelled: "Cancelled",
};

const DATE_RANGES = [
  { key: "all", label: "From the beginning" },
  { key: "today", label: "Today" },
  { key: "7d", label: "Last 7 days" },
  { key: "30d", label: "Last 30 days" },
  { key: "3m", label: "Last 3 months" },
  { key: "1y", label: "Last year" },
];

function getDateCutoff(key: string): Date | null {
  const now = new Date();
  switch (key) {
    case "today": return startOfDay(now);
    case "7d": return subDays(now, 7);
    case "30d": return subDays(now, 30);
    case "3m": return subMonths(now, 3);
    case "1y": return subMonths(now, 12);
    default: return null;
  }
}

function FilterDropdown({
  label,
  value,
  options,
  onChange,
  isPrimary,
}: {
  label: string;
  value: string;
  options: { key: string; label: string }[];
  onChange: (key: string) => void;
  isPrimary?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isActive = value !== options[0]?.key;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const selectedLabel = options.find((o) => o.key === value)?.label ?? value;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm transition-colors
          ${isActive
            ? "border-primary/50 bg-primary/8 text-foreground"
            : "border-muted/50 bg-muted/10 text-foreground hover:bg-muted/20"
          }`}
      >
        <span className="text-muted-foreground font-medium">{label}:</span>
        <span className={`font-semibold ${isPrimary || isActive ? "text-primary" : ""}`}>
          {selectedLabel}
        </span>
        {isActive ? (
          <X
            className="h-3 w-3 text-muted-foreground hover:text-foreground ml-0.5"
            onClick={(e) => { e.stopPropagation(); onChange(options[0].key); }}
          />
        ) : (
          <ChevronDown className="h-3 w-3 text-muted-foreground ml-0.5" />
        )}
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1.5 z-50 bg-popover border border-border rounded-xl shadow-xl min-w-[160px] py-1 overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt.key}
              onClick={() => { onChange(opt.key); setOpen(false); }}
              className="w-full flex items-center justify-between gap-3 px-3 py-2 text-sm hover:bg-muted/50 transition-colors text-left"
            >
              <span className={value === opt.key ? "font-semibold text-foreground" : "text-muted-foreground"}>
                {opt.label}
              </span>
              {value === opt.key && <Check className="h-3.5 w-3.5 text-primary flex-shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const TransactionIcon = ({ type }: { type: WalletTransaction['type'] }) => {
  switch (type) {
    case 'deposit': return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
    case 'withdrawal': return <ArrowUpRight className="h-4 w-4 text-red-500" />;
    case 'swap': return <RefreshCw className="h-4 w-4 text-blue-500" />;
    default: return <RefreshCw className="h-4 w-4" />;
  }
};

const ActivityTable = ({
  isOperations, onDeposit, transactions, isLoading, error, onRowClick, hasActiveFilters,
}: {
  isOperations: boolean;
  onDeposit?: (symbol?: string) => void;
  transactions: WalletTransaction[];
  isLoading: boolean;
  error?: Error | null;
  onRowClick: (tx: WalletTransaction) => void;
  hasActiveFilters: boolean;
}) => (
  <div className="rounded-lg border bg-card dark:bg-card/50 overflow-x-auto no-scrollbar">
    <Table className="min-w-full">
      <TableHeader className="bg-transparent border-b">
        <TableRow className="hover:bg-transparent border-none">
          <TableHead className="text-[10px] sm:text-xs font-medium text-muted-foreground py-4">Type</TableHead>
          <TableHead className="text-[10px] sm:text-xs font-medium text-muted-foreground py-4 text-center">Asset</TableHead>
          <TableHead className="text-[10px] sm:text-xs font-medium text-muted-foreground py-4 text-center">Amount</TableHead>
          {isOperations ? (
            <TableHead className="text-[10px] sm:text-xs font-medium text-muted-foreground py-4 text-right">Date</TableHead>
          ) : (
            <>
              <TableHead className="text-[10px] sm:text-xs font-medium text-muted-foreground py-4 text-center">Date</TableHead>
              <TableHead className="text-[10px] sm:text-xs font-medium text-muted-foreground py-4 text-right">Status</TableHead>
            </>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={isOperations ? 4 : 5} className="py-16 text-center">
              <LoadingSpinner
                size={32}
                color="hsl(var(--primary))"
                className="mx-auto"
              />
            </TableCell>
          </TableRow>
        ) : error ? (
          <TableRow className="hover:bg-transparent border-none">
            <TableCell colSpan={isOperations ? 4 : 5} className="py-16 text-center">
              <div className="flex flex-col items-center justify-center gap-2">
                <p className="text-base font-bold text-muted-foreground">
                  Activity temporarily unavailable
                </p>
                <p className="text-xs text-muted-foreground/60 max-w-[320px] mx-auto">
                  We could not read the on-chain history for this wallet. Your balance is not affected.
                </p>
              </div>
            </TableCell>
          </TableRow>
        ) : transactions.length > 0 ? (
          transactions.map((tx) => (
            <TableRow
              key={tx.id}
              className="hover:bg-muted/5 border-b last:border-none cursor-pointer"
              onClick={() => onRowClick(tx)}
            >
              <TableCell className="py-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-muted/10 flex items-center justify-center">
                    <TransactionIcon type={tx.type} />
                  </div>
                  <span className="capitalize text-xs font-medium">
                    {TX_TYPE_LABELS[tx.type] ?? tx.type.replace(/_/g, ' ')}
                  </span>
                </div>
              </TableCell>
              <TableCell className="py-4 text-center font-bold text-xs">{tx.crypto_symbol}</TableCell>
              <TableCell className="py-4 text-center font-bold text-xs">
                <span className={tx.type === 'deposit' ? 'text-green-500' : 'text-foreground'}>
                  {tx.type === 'deposit' ? '+' : '-'}{formatCryptoAmount(tx.amount, tx.crypto_symbol)}
                </span>
              </TableCell>
              {isOperations ? (
                <TableCell className="py-4 text-right text-[10px] text-muted-foreground">
                  {format(new Date(tx.created_at), 'MMM dd, HH:mm')}
                </TableCell>
              ) : (
                <>
                  <TableCell className="py-4 text-center text-[10px] text-muted-foreground">
                    {format(new Date(tx.created_at), 'MMM dd, HH:mm')}
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        tx.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                        tx.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-red-500/10 text-red-500'
                      }`}>
                        {STATUS_LABELS[tx.status] ?? tx.status}
                      </span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground/40" />
                    </div>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))
        ) : (
          <TableRow className="hover:bg-transparent border-none">
            <TableCell colSpan={isOperations ? 4 : 5} className="py-20 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 rounded-lg bg-muted/10 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-muted-foreground/30 rounded-sm flex items-center justify-center">
                    <div className="w-2 h-2 bg-muted-foreground/30 rounded-full" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-base font-bold text-muted-foreground">
                    {hasActiveFilters ? "No results found" : "Nothing to show yet"}
                  </p>
                  <p className="text-xs text-muted-foreground/60 max-w-[300px] mx-auto">
                    {hasActiveFilters
                      ? "No transactions match your current filters. Try adjusting them."
                      : isOperations
                        ? "No results match your current filters. Adjust the filters and try again."
                       : "No on-chain activity has been found for this wallet yet"}
                  </p>
                </div>
                {!isOperations && !hasActiveFilters && (
                  <Button
                    onClick={() => onDeposit?.()}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 rounded-lg transition-all"
                  >
                    Deposit
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
);

export function RecentActivity({ type, onDeposit, pendingActivity = [] }: RecentActivityProps) {
  const isOperations = type === "operations";
  const [selectedTx, setSelectedTx] = useState<WalletTransaction | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const [filterAsset, setFilterAsset] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("all");

  /**
   * Keep one shared on-chain history result for both activity tabs.
   *
   * This is intentionally stale-while-revalidate:
   * - fresh for 60 seconds, so switching tabs does not hit the monitor again
   * - retained for 5 minutes after unmount, so navigating away and back is cheap
   * - no focus refetch, because wallet balance refreshes already handle the
   *   explicit realtime/manual refresh path
   */
  const {
    data: allTransactions = [],
    isLoading,
    error,
  } = useWalletActivity();

  const uniqueAssets = useMemo(() => {
    const symbols = [...new Set(allTransactions.map((t) => t.crypto_symbol))].filter(Boolean).sort();
    return [{ key: "all", label: "All" }, ...symbols.map((s) => ({ key: s, label: s }))];
  }, [allTransactions]);

  const uniqueTypes = useMemo(() => {
    const types = [...new Set(allTransactions.map((t) => t.type))].filter(Boolean);
    return [
      { key: "all", label: "All" },
      ...types.map((t) => ({ key: t, label: TX_TYPE_LABELS[t] ?? t.replace(/_/g, ' ') })),
    ];
  }, [allTransactions]);

  const statusOptions = [
    { key: "all", label: "All" },
    { key: "completed", label: "Completed" },
    { key: "pending", label: "Pending" },
    { key: "failed", label: "Failed" },
    { key: "cancelled", label: "Cancelled" },
  ];

  const filteredTransactions = useMemo(() => {
    const cutoff = getDateCutoff(filterDate);
    return allTransactions.filter((tx) => {
      if (filterAsset !== "all" && tx.crypto_symbol !== filterAsset) return false;
      if (filterType !== "all" && tx.type !== filterType) return false;
      if (filterStatus !== "all" && tx.status !== filterStatus) return false;
      if (cutoff && !isAfter(new Date(tx.created_at), cutoff)) return false;
      return true;
    });
  }, [allTransactions, filterAsset, filterType, filterStatus, filterDate]);

  const hasActiveFilters = filterAsset !== "all" || filterType !== "all" || filterStatus !== "all" || filterDate !== "all";

  const handleRowClick = (tx: WalletTransaction) => {
    setSelectedTx(tx);
    setSheetOpen(true);
  };

  const clearAllFilters = () => {
    setFilterAsset("all");
    setFilterType("all");
    setFilterStatus("all");
    setFilterDate("all");
  };

  return (
    <div className="space-y-4">
      {pendingActivity.length > 0 && (
        <section className="rounded-xl border bg-card p-4 sm:p-5">
          <h3 className="mb-3 text-sm font-bold">Recently submitted from this wallet</h3>
          <ul className="space-y-3">
            {pendingActivity.map((activity) => (
              <li key={`${activity.chainId}:${activity.hash}`} className="flex flex-col gap-2 rounded-lg bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-semibold">
                    Sent {activity.amount} {activity.symbol.toUpperCase()}
                    <span className="ml-2 text-xs font-normal text-muted-foreground">Pending</span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{activity.chainName} · {new Date(activity.createdAt).toLocaleString()}</p>
                  <p className="mt-1 break-all font-mono text-[11px] text-muted-foreground">{activity.hash}</p>
                </div>
                {activity.explorerUrl && (
                  <a href={activity.explorerUrl} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary hover:underline">
                    Explorer <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="font-bold text-foreground mr-1 text-xs">Filter</span>

        {isOperations ? (
          <>
            <FilterDropdown
              label="Type"
              value={filterType}
              options={uniqueTypes}
              onChange={setFilterType}
            />
            <FilterDropdown
              label="Asset"
              value={filterAsset}
              options={uniqueAssets}
              onChange={setFilterAsset}
            />
            <FilterDropdown
              label="Date"
              value={filterDate}
              options={DATE_RANGES}
              onChange={setFilterDate}
              isPrimary
            />
          </>
        ) : (
          <>
            <FilterDropdown
              label="Asset"
              value={filterAsset}
              options={uniqueAssets}
              onChange={setFilterAsset}
            />
            <FilterDropdown
              label="Type"
              value={filterType}
              options={uniqueTypes}
              onChange={setFilterType}
            />
            <FilterDropdown
              label="Status"
              value={filterStatus}
              options={statusOptions}
              onChange={setFilterStatus}
            />
            <FilterDropdown
              label="Date"
              value={filterDate}
              options={DATE_RANGES}
              onChange={setFilterDate}
              isPrimary
            />
          </>
        )}

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors ml-1"
          >
            <X className="h-3 w-3" /> Clear all
          </button>
        )}

        {hasActiveFilters && (
          <span className="text-xs text-muted-foreground ml-auto">
            {filteredTransactions.length} result{filteredTransactions.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <ActivityTable
        isOperations={isOperations}
        onDeposit={onDeposit}
        transactions={filteredTransactions}
        isLoading={isLoading}
        error={error as Error | null}
        onRowClick={handleRowClick}
        hasActiveFilters={hasActiveFilters}
      />

      <TransactionDetailSheet
        tx={selectedTx}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </div>
  );
}
