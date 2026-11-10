
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { feeCalculator } from '@/lib/fee-calculator';

export function useSendFee(cryptoSymbol: string, amount: number, isInternal: boolean = false) {
  return useQuery({
    queryKey: ['sendFee', cryptoSymbol, amount, isInternal],
    queryFn: () => feeCalculator.calculateSendFee(cryptoSymbol, amount, isInternal),
    enabled: amount > 0 && !!cryptoSymbol,
    retry: 1,
    staleTime: 30000, // Cache for 30 seconds
  });
}

export function useMarketplaceFee(
  cryptoSymbol: string,
  amount: number,
  paymentMethod: string,
  isBuy: boolean
) {
  return useQuery({
    queryKey: ['marketplaceFee', cryptoSymbol, amount, paymentMethod, isBuy],
    queryFn: () => feeCalculator.calculateMarketplaceFee(cryptoSymbol, amount, paymentMethod, isBuy),
    enabled: amount > 0 && !!cryptoSymbol && !!paymentMethod,
    retry: 1,
    staleTime: 30000,
  });
}

export function useSwapFee(fromCrypto: string, toCrypto: string, amount: number) {
  return useQuery({
    queryKey: ['swapFee', fromCrypto, toCrypto, amount],
    queryFn: () => feeCalculator.calculateSwapFee(fromCrypto, toCrypto, amount),
    enabled: amount > 0 && !!fromCrypto && !!toCrypto,
    retry: 1,
    staleTime: 30000,
  });
}

export function useNetworkFee(cryptoSymbol: string, feeType: string = 'withdrawal') {
  return useQuery({
    queryKey: ['networkFee', cryptoSymbol, feeType],
    queryFn: () => feeCalculator.getNetworkFee(cryptoSymbol, feeType),
    enabled: !!cryptoSymbol,
  });
}

export function useRecordFeeTransaction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (params: {
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
    }) => feeCalculator.recordFeeTransaction(params),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['feeTransactions'] });
    },
  });
}
