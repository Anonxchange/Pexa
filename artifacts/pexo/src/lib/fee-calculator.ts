
import { createClient } from "./supabase";
import { chainRpc, btcFees, xrpFees } from "./chain-gateway";

// ── EVM chain resolution ──────────────────────────────────────────────────────
// Maps a crypto symbol (as passed by the send dialog) to the chain key expected
// by chain-gateway's chainRpc(). Handles both bare symbols (ETH, BNB) and
// network-specific symbols (USDT_BSC, WETH_ARB, etc.).

const EVM_CHAIN_BASE: Record<string, string> = {
  ETH: "ETH",
  BNB: "BNB", BSC: "BNB",   // edge function key is "BNB", not "BSC"
  POL: "POL", MATIC: "POL",
  ARB: "ARB",
  OP: "OP",
  BASE: "BASE",
};

function evmChainForSymbol(symbol: string): string | null {
  if (symbol in EVM_CHAIN_BASE) return EVM_CHAIN_BASE[symbol];
  // Support both underscore (USDT_ETH, USDT_BSC) and hyphen (USDT-ERC20, USDT-BEP20) separators.
  // After splitting, also map network-name suffixes (ERC20→ETH, BEP20→BNB) to chain keys.
  const SUFFIX_ALIAS: Record<string, string> = {
    ERC20: "ETH",
    BEP20: "BNB",
    BSC: "BNB",
  };
  const suffix = symbol.split(/[_-]/).pop() ?? "";
  const resolved = SUFFIX_ALIAS[suffix] ?? suffix;
  if (resolved in EVM_CHAIN_BASE) return EVM_CHAIN_BASE[resolved];
  return null;
}

/** Returns the native gas-token symbol for an EVM chain key. */
function nativeSymbolForChain(chain: string): string {
  const NATIVE: Record<string, string> = {
    ETH: "ETH", ARB: "ETH", OP: "ETH", BASE: "ETH",
    BNB: "BNB",
    POL: "POL", MATIC: "POL",
  };
  return NATIVE[chain] ?? chain;
}

// Standard EVM gas units for display-time estimation.
// Native-token transfers cost 21 000; ERC-20 transfers cost ~65 000.
const EVM_NATIVE_SYMBOLS = new Set(["ETH", "BNB", "POL", "MATIC"]);
function evmGasUnits(symbol: string): bigint {
  const base = symbol.split("_")[0];
  return EVM_NATIVE_SYMBOLS.has(base) ? 21_000n : 65_000n;
}

export interface FeeConfiguration {
  id: string;
  transaction_type: string;
  crypto_symbol: string;
  fee_type: 'fixed' | 'percentage' | 'tiered';
  fixed_fee_amount?: number;
  percentage_fee?: number;
  min_fee?: number;
  max_fee?: number;
  min_amount?: number;
  max_amount?: number;
  notes?: string;
}

export interface BlockchainNetworkFee {
  id: string;
  crypto_symbol: string;
  network: string;
  fee_type: 'withdrawal' | 'deposit' | 'transfer';
  current_fee: number;
  fee_unit: string;
  priority_level: 'low' | 'standard' | 'high';
  estimated_confirmation_time?: number;
}

export interface CalculatedFee {
  platformFee: number;
  networkFee: number;
  totalFee: number;
  feePercentage?: number;
  /** The token symbol the networkFee is denominated in.
   *  Differs from the sent asset for ERC-20/BEP-20/TRC-20/SPL tokens
   *  (e.g. ETH fee for USDT_ETH, BNB fee for USDT_BSC). */
  networkFeeSymbol?: string;
  breakdown: {
    type: string;
    amount: number;
    description: string;
  }[];
  feeConfigId?: string;
}

export class FeeCalculator {
  private supabase = createClient();

  async calculateSendFee(
    cryptoSymbol: string,
    amount: number,
    isInternal: boolean = false
  ): Promise<CalculatedFee> {
    const transactionType = isInternal ? 'internal_transfer' : 'withdrawal';

    try {
      // ── Step 1: Platform fee (always from Supabase — business rule, server-side) ──
      let platformFee = 0;
      let feePercentage: number | undefined;
      let feeConfigId: string | undefined;
      try {
        const { data: { session } } = await this.supabase.auth.getSession();
        const response = await this.supabase.functions.invoke('calculate-fee', {
          body: { transaction_type: transactionType, crypto_symbol: cryptoSymbol, amount },
          headers: session ? { Authorization: `Bearer ${session.access_token}` } : {},
        });
        if (!response.error) {
          platformFee    = response.data.platform_fee  ?? 0;
          feePercentage  = response.data.fee_percentage;
          feeConfigId    = response.data.fee_config?.id;
        }
      } catch (e) {
        console.warn('calculateSendFee: could not fetch platform fee, using 0:', e);
      }

      // ── Step 2: Network fee — live source per chain type ──────────────────────
      let networkFee = 0;
      let networkFeeSymbol: string = cryptoSymbol; // default: fee in the same asset
      let networkFeeLabel = `${cryptoSymbol} network fee`;

      if (!isInternal) {
        // ── Bitcoin: gateway → Alchemy estimatesmartfee (fast tier) ──────────
        if (cryptoSymbol === 'BTC') {
          try {
            const fees = await btcFees();
            // "fast" tier is what executeSend uses (feesResult.fast).
            // Standard P2WPKH tx ~141 vBytes, legacy P2PKH ~225 vBytes — use 225
            // to be conservative (over-estimates slightly for SegWit, safe).
            const satPerByte = fees.fast || fees.normal || 10;
            const networkFeeSats = 225 * satPerByte;
            networkFee       = networkFeeSats / 1e8;
            networkFeeSymbol = 'BTC';
            networkFeeLabel  = `BTC network fee (${satPerByte} sat/vB, fast)`;
          } catch (e) {
            console.warn('calculateSendFee: could not fetch BTC fee from gateway:', e);
          }

        // ── EVM + non-EVM chains ───────────────────────────────────────────────
        } else {
          const evmChain = evmChainForSymbol(cryptoSymbol);
          if (evmChain) {
            // ── EVM: live gas price via Alchemy ───────────────────────────────
            // Gas is ALWAYS paid in the native token of the chain (ETH, BNB, etc.),
            // NOT in the token being transferred (important for USDT/USDC).
            const nativeSym = nativeSymbolForChain(evmChain);
            try {
              const gasPriceHex = await chainRpc(evmChain, 'eth_gasPrice', []);
              if (gasPriceHex) {
                const gasPrice = BigInt(gasPriceHex);
                const gasUnits = evmGasUnits(cryptoSymbol);
                networkFee       = Number(gasPrice * gasUnits) / 1e18;
                networkFeeSymbol = nativeSym;
                networkFeeLabel  = `${nativeSym} gas fee (live)`;
              }
            } catch (e) {
              console.warn(`calculateSendFee: could not fetch ${evmChain} gas price:`, e);
            }
          } else if (cryptoSymbol === 'XRP') {
            // ── XRP: live fee in drops via chain-gateway xrp_fees ────────────
            try {
              const fees = await xrpFees();
              // "normal" tier; drops → XRP (1 XRP = 1,000,000 drops)
              networkFee       = fees.normal / 1_000_000;
              networkFeeSymbol = 'XRP';
              networkFeeLabel  = 'XRP network fee (live)';
            } catch (e) {
              console.warn('calculateSendFee: could not fetch XRP fee from gateway:', e);
              networkFee       = 12 / 1_000_000; // fallback: 12 drops
              networkFeeSymbol = 'XRP';
              networkFeeLabel  = 'XRP network fee (estimate)';
            }
          } else if (cryptoSymbol === 'SOL') {
            // ── Solana: base transaction fee = 5,000 lamports ────────────────
            networkFee       = 5_000 / 1_000_000_000;
            networkFeeSymbol = 'SOL';
            networkFeeLabel  = 'SOL network fee';
          } else if (cryptoSymbol === 'TRX') {
            // ── Tron: simple TRX transfer uses bandwidth allowance ────────────
            networkFee       = 1;
            networkFeeSymbol = 'TRX';
            networkFeeLabel  = 'TRX network fee (estimated)';
          } else if (cryptoSymbol.endsWith('-TRC20') || cryptoSymbol.endsWith('_TRX')) {
            // ── TRC-20 tokens (USDT-TRC20, USDC-TRC20) — fee paid in TRX ─────
            networkFee       = 10; // ~10 TRX for energy; conservative estimate
            networkFeeSymbol = 'TRX';
            networkFeeLabel  = 'TRX energy fee (USDT/USDC transfer, estimated)';
          } else if (cryptoSymbol.endsWith('-SOL') || cryptoSymbol.endsWith('_SOL')) {
            // ── Solana SPL tokens (USDT-SOL, USDC-SOL) — fee paid in SOL ─────
            networkFee       = 5_000 / 1_000_000_000;
            networkFeeSymbol = 'SOL';
            networkFeeLabel  = 'SOL network fee (SPL transfer)';
          }
          // Other non-EVM coins fall through with networkFee = 0.
        }
      }

      // ── Step 3: Assemble breakdown ─────────────────────────────────────────
      const breakdown: { type: string; amount: number; description: string }[] = [];
      if (platformFee > 0) {
        breakdown.push({
          type: 'platform',
          amount: platformFee,
          description: `Pexly ${isInternal ? 'internal transfer' : 'withdrawal'} fee`,
        });
      }
      if (networkFee > 0 && !isInternal) {
        breakdown.push({ type: 'network', amount: networkFee, description: networkFeeLabel });
      }

      const totalFee = platformFee + networkFee;
      return { platformFee, networkFee, networkFeeSymbol, totalFee, feePercentage, breakdown, feeConfigId };

    } catch (error) {
      console.error('Error calculating send fee:', error);
      throw error;
    }
  }

  async calculateMarketplaceFee(
    cryptoSymbol: string,
    amount: number,
    paymentMethod: string,
    isBuy: boolean
  ): Promise<CalculatedFee> {
    const transactionType = isBuy ? 'marketplace_buy' : 'marketplace_sell';
    
    try {
      const { data: { session } } = await this.supabase.auth.getSession();
      
      const response = await this.supabase.functions.invoke('calculate-fee', {
        body: {
          transaction_type: transactionType,
          crypto_symbol: cryptoSymbol,
          amount: amount,
          payment_method: paymentMethod,
        },
        headers: session ? {
          Authorization: `Bearer ${session.access_token}`
        } : {}
      });

      if (response.error) throw response.error;

      const data = response.data;

      return {
        platformFee: data.platform_fee,
        networkFee: data.network_fee,
        totalFee: data.total_fee,
        feePercentage: data.fee_percentage,
        breakdown: [{
          type: 'marketplace',
          amount: data.platform_fee,
          description: `${isBuy ? 'Buy' : 'Sell'} fee - ${paymentMethod}`
        }],
        feeConfigId: data.fee_config?.id
      };
    } catch (error) {
      console.error('Error calculating marketplace fee:', error);
      throw error;
    }
  }

  async calculateSwapFee(
    fromCrypto: string,
    toCrypto: string,
    amount: number
  ): Promise<CalculatedFee> {
    try {
      // Determine fee percentage based on trading pair
      let feePercentage = 0.15; // Default for all other pairs
      
      const pair = `${fromCrypto}/${toCrypto}`;
      const reversePair = `${toCrypto}/${fromCrypto}`;
      
      // BTC/USDT or USDT/BTC gets 0.09%-0.15% (we'll use 0.12% as average)
      if (pair === 'BTC/USDT' || reversePair === 'BTC/USDT' ||
          pair === 'BTC/USDC' || reversePair === 'BTC/USDC') {
        feePercentage = 0.12;
      }
      // SOL, TRX, BNB pairs get 0.15%
      else if (
        fromCrypto === 'SOL' || toCrypto === 'SOL' ||
        fromCrypto === 'TRX' || toCrypto === 'TRX' ||
        fromCrypto === 'BNB' || toCrypto === 'BNB'
      ) {
        feePercentage = 0.15;
      }
      
      // Calculate platform fee
      const platformFee = amount * (feePercentage / 100);
      
      // No network fee for swaps (internal transaction)
      const networkFee = 0;
      
      return {
        platformFee,
        networkFee,
        totalFee: platformFee,
        feePercentage,
        breakdown: [{
          type: 'swap',
          amount: platformFee,
          description: `Swap fee ${fromCrypto}/${toCrypto} (${feePercentage}%)`
        }],
      };
    } catch (error) {
      console.error('Error calculating swap fee:', error);
      throw error;
    }
  }

  async recordFeeTransaction(params: {
    transactionType: string;
    cryptoSymbol: string;
    amount: number;
    platformFee: number;
    networkFee: number;
    totalFee: number;
    feeConfigId?: string;
    transactionId?: string;
    paymentMethod?: string;
    metadata?: Record<string, any>;
  }): Promise<any> {
    try {
      const { data: { session } } = await this.supabase.auth.getSession();
      
      if (!session) {
        throw new Error('User not authenticated');
      }

      const response = await this.supabase.functions.invoke('record-fee-transaction', {
        body: {
          transaction_type: params.transactionType,
          crypto_symbol: params.cryptoSymbol,
          amount: params.amount,
          platform_fee: params.platformFee,
          network_fee: params.networkFee,
          total_fee: params.totalFee,
          fee_config_id: params.feeConfigId,
          transaction_id: params.transactionId,
          payment_method: params.paymentMethod,
          metadata: params.metadata,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (response.error) throw response.error;

      return response.data;
    } catch (error) {
      console.error('Error recording fee transaction:', error);
      throw error;
    }
  }

  async getNetworkFee(cryptoSymbol: string, feeType: string = 'withdrawal'): Promise<BlockchainNetworkFee | null> {
    const { data } = await this.supabase
      .from('blockchain_network_fees')
      .select('*')
      .eq('crypto_symbol', cryptoSymbol)
      .eq('fee_type', feeType)
      .eq('is_active', true)
      .single();

    return data;
  }

  async getAllFeeConfigurations(): Promise<FeeConfiguration[]> {
    const { data } = await this.supabase
      .from('fee_configurations')
      .select('*')
      .order('crypto_symbol', { ascending: true });

    return data || [];
  }
}

export const feeCalculator = new FeeCalculator();
