import { useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEvmWallet } from "@/lib/evm-wallet-provider";
import { useEvmWalletData } from "@/hooks/use-evm-wallet-data";
import { CoinIcon } from "@/components/trading/CoinIcon";
import { ArrowDownToLine, ExternalLink, RefreshCw, Send, Wallet } from "@/lib/icons";

function explorerUrl(chainId: number, value: string) {
  const hosts: Record<number, string> = {
    1: "https://etherscan.io", 10: "https://optimistic.etherscan.io", 56: "https://bscscan.com",
    137: "https://polygonscan.com", 42161: "https://arbiscan.io", 8453: "https://basescan.org",
    43114: "https://snowtrace.io",
  };
  const host = hosts[chainId];
  return host ? `${host}/address/${value}` : undefined;
}

export function AssetList({ onSend, onReceive }: { onSend?: (symbol: string) => void; onReceive?: () => void }) {
  const wallet = useEvmWallet();
  const { assets, isLoading, error, refetch } = useEvmWalletData();
  const [hideZero, setHideZero] = useState(false);
  const visibleAssets = useMemo(() => hideZero ? assets.filter((asset) => asset.balance > 0) : assets, [assets, hideZero]);

  if (!wallet.isConnected) {
    return (
      <div className="rounded-xl border border-dashed border-[#d6e0d0] bg-[#fbfcf8] px-5 py-10 text-center">
        <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#eef5e6] text-[#557a3f]"><Wallet className="h-5 w-5" /></div>
        <h3 className="font-bold">Your assets will appear here</h3>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">Connect a wallet to read balances directly from the blockchain.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-bold">Wallet assets</h2>
          <p className="mt-1 text-xs text-muted-foreground">{wallet.chainName || `Chain ${wallet.chainId ?? ""}`} · live on-chain data</p>
        </div>
        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <div className="flex items-center gap-2">
            <Checkbox id="hide-zero-assets" checked={hideZero} onCheckedChange={(value) => setHideZero(!!value)} />
            <Label htmlFor="hide-zero-assets" className="text-xs text-muted-foreground">Hide zero balances</Label>
          </div>
          <Button variant="ghost" size="sm" onClick={() => void refetch()} className="h-8 gap-1.5 text-xs"><RefreshCw className="h-3.5 w-3.5" />Refresh</Button>
        </div>
      </div>

      <div className="rounded-xl border border-[#e7ede2] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f8faf4] hover:bg-[#f8faf4]">
              <TableHead>Asset</TableHead>
              <TableHead className="hidden sm:table-cell">Price</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? Array.from({ length: 4 }).map((_, index) => (
              <TableRow key={`asset-skeleton-${index}`}>
                <TableCell><div className="flex items-center gap-3"><Skeleton className="h-9 w-9 rounded-full" /><Skeleton className="h-4 w-24" /></div></TableCell>
                <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="ml-auto h-8 w-16" /></TableCell>
              </TableRow>
            )) : error ? (
              <TableRow><TableCell colSpan={4} className="py-10 text-center">
                <p role="alert" className="mb-3 text-sm text-destructive">{error instanceof Error ? error.message : "Assets could not be loaded."}</p>
                <Button variant="outline" size="sm" onClick={() => void refetch()}>Try again</Button>
              </TableCell></TableRow>
            ) : visibleAssets.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="py-12 text-center">
                <p className="font-semibold">No assets on this network</p>
                <p className="mt-1 text-sm text-muted-foreground">Try another supported network or receive an asset.</p>
                {onReceive && <Button variant="outline" size="sm" className="mt-4 gap-2" onClick={onReceive}><ArrowDownToLine className="h-4 w-4" />Receive</Button>}
              </TableCell></TableRow>
            ) : visibleAssets.map((asset) => {
              const explorer = wallet.address ? explorerUrl(asset.chainId, wallet.address) : undefined;
              return (
                <TableRow key={asset.id} data-testid={`row-asset-${asset.id}`}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <CoinIcon symbol={asset.symbol.toUpperCase()} className="h-9 w-9" />
                      <div className="min-w-0"><div className="truncate font-semibold">{asset.name}</div><div className="text-xs text-muted-foreground">{asset.symbol.toUpperCase()} · {asset.chainName}</div></div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell font-medium">{asset.usdPrice == null ? "—" : `$${asset.usdPrice.toLocaleString("en-US", { maximumFractionDigits: 6 })}`}</TableCell>
                  <TableCell>
                    <div className="font-bold tabular-nums">{asset.balance.toLocaleString("en-US", { maximumFractionDigits: Math.min(asset.decimals, 8) })} <span className="text-xs font-medium text-muted-foreground">{asset.symbol.toUpperCase()}</span></div>
                    <div className="text-xs text-muted-foreground">{asset.usdValue == null ? "Value unavailable" : `$${asset.usdValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex items-center gap-1">
                      {explorer && <Button asChild variant="ghost" size="icon" className="h-8 w-8" title="View address on block explorer"><a href={explorer} target="_blank" rel="noreferrer" aria-label="View on block explorer"><ExternalLink className="h-4 w-4" /></a></Button>}
                      {onReceive && <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Receive ${asset.symbol}`} onClick={onReceive}><ArrowDownToLine className="h-4 w-4" /></Button>}
                      {onSend && <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Send ${asset.symbol}`} onClick={() => onSend(asset.symbol)}><Send className="h-4 w-4" /></Button>}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <p className="text-[11px] leading-relaxed text-muted-foreground">Balances are read-only estimates from the connected chain. Always verify network and recipient in your wallet before approving a transaction.</p>
    </div>
  );
}
