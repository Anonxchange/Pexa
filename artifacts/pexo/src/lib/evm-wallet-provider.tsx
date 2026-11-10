import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { WagmiProvider, useAccount, useDisconnect, useSendTransaction, useSwitchChain, useWriteContract } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { isAddress, parseEther, parseUnits, type Address } from "viem";
import {
  evmNetworkById,
  isReownConfigured,
  transactionExplorerUrl,
  wagmiConfig,
} from "./reown-config";

export interface EvmWalletActivity {
  hash: `0x${string}`;
  to: string;
  amount: string;
  symbol: string;
  chainId: number;
  chainName: string;
  explorerUrl?: string;
  createdAt: string;
}

export interface SendNativeInput {
  to: string;
  amount: string;
  symbol: string;
  chainId: number;
}

export interface SendTokenInput extends SendNativeInput {
  tokenAddress: string;
  decimals: number;
}

export interface EvmWalletContextValue {
  configured: boolean;
  isConnected: boolean;
  isConnecting: boolean;
  address?: Address;
  chainId?: number;
  chainName?: string;
  error?: string;
  openConnect: () => void;
  openNetworkSwitcher: () => void;
  openAccount: () => void;
  disconnect: () => Promise<void>;
  switchNetwork: (chainId: number) => Promise<void>;
  sendNative: (input: SendNativeInput) => Promise<`0x${string}`>;
  sendToken: (input: SendTokenInput) => Promise<`0x${string}`>;
  recentActivity: EvmWalletActivity[];
}

const unavailableWallet: EvmWalletContextValue = {
  configured: false,
  isConnected: false,
  isConnecting: false,
  openConnect: () => undefined,
  openNetworkSwitcher: () => undefined,
  openAccount: () => undefined,
  disconnect: async () => undefined,
  switchNetwork: async () => {
    throw new Error("Wallet connection is not configured.");
  },
  sendNative: async () => {
    throw new Error("Wallet connection is not configured.");
  },
  sendToken: async () => {
    throw new Error("Wallet connection is not configured.");
  },
  recentActivity: [],
};

const EvmWalletContext = createContext<EvmWalletContextValue>(unavailableWallet);

function validateTransfer(to: string, amount: string, chainId: number) {
  if (!isAddress(to)) {
    throw new Error("Enter a valid EVM recipient address.");
  }
  if (!Number.isInteger(chainId) || !evmNetworkById.has(chainId)) {
    throw new Error("Choose a supported network.");
  }
  if (!amount.trim() || !/^\d+(\.\d+)?$/.test(amount.trim())) {
    throw new Error("Enter a valid amount.");
  }
}

function WalletBridge({ children }: { children: ReactNode }) {
  const [recentActivity, setRecentActivity] = useState<EvmWalletActivity[]>([]);
  const account = useAccount();
  const appKit = useAppKit();
  const { disconnectAsync } = useDisconnect();
  const { switchChainAsync } = useSwitchChain();
  const { sendTransactionAsync } = useSendTransaction();
  const { writeContractAsync } = useWriteContract();

  const openConnect = useCallback(() => {
    void appKit.open({ view: "Connect", namespace: "eip155" });
  }, [appKit]);

  const openNetworkSwitcher = useCallback(() => {
    void appKit.open({ view: "Networks" });
  }, [appKit]);

  const openAccount = useCallback(() => {
    void appKit.open({ view: "Account" });
  }, [appKit]);

  const disconnect = useCallback(async () => {
    await disconnectAsync();
  }, [disconnectAsync]);

  const switchNetwork = useCallback(
    async (chainId: number) => {
      if (!evmNetworkById.has(chainId)) {
        throw new Error("Choose a supported network.");
      }
      await switchChainAsync({ chainId });
    },
    [switchChainAsync],
  );

  const ensureNetwork = useCallback(
    async (chainId: number) => {
      if (!account.address) {
        throw new Error("Connect a wallet before sending crypto.");
      }
      if (!evmNetworkById.has(chainId)) {
        throw new Error("Choose a supported network.");
      }
      if (account.chainId !== chainId) {
        await switchChainAsync({ chainId });
      }
    },
    [account.address, account.chainId, switchChainAsync],
  );

  const addRecentActivity = useCallback(
    (input: SendNativeInput, hash: `0x${string}`) => {
      const network = evmNetworkById.get(input.chainId);
      setRecentActivity((current) =>
        [
          {
            hash,
            to: input.to,
            amount: input.amount,
            symbol: input.symbol,
            chainId: input.chainId,
            chainName: network?.name ?? `Chain ${input.chainId}`,
            explorerUrl: transactionExplorerUrl(input.chainId, hash),
            createdAt: new Date().toISOString(),
          },
          ...current,
        ].slice(0, 20),
      );
    },
    [],
  );

  const sendNative = useCallback(
    async ({ to, amount, symbol, chainId }: SendNativeInput) => {
      validateTransfer(to, amount, chainId);
      await ensureNetwork(chainId);
      const value = parseEther(amount.trim());
      if (value <= 0n) {
        throw new Error("Amount must be greater than zero.");
      }
      const hash = await sendTransactionAsync({
        to: to as Address,
        value,
        chainId,
      });
      addRecentActivity({ to, amount, symbol, chainId }, hash);
      return hash;
    },
    [addRecentActivity, ensureNetwork, sendTransactionAsync],
  );

  const sendToken = useCallback(
    async ({ to, amount, symbol, chainId, tokenAddress, decimals }: SendTokenInput) => {
      validateTransfer(to, amount, chainId);
      if (!isAddress(tokenAddress)) {
        throw new Error("The selected token contract is invalid.");
      }
      if (!Number.isInteger(decimals) || decimals < 0 || decimals > 36) {
        throw new Error("The selected token has invalid decimal precision.");
      }
      await ensureNetwork(chainId);
      const value = parseUnits(amount.trim(), decimals);
      if (value <= 0n) {
        throw new Error("Amount must be greater than zero.");
      }
      const hash = await writeContractAsync({
        address: tokenAddress as Address,
        abi: [
          {
            type: "function",
            name: "transfer",
            stateMutability: "nonpayable",
            inputs: [
              { name: "to", type: "address" },
              { name: "value", type: "uint256" },
            ],
            outputs: [{ name: "", type: "bool" }],
          },
        ],
        functionName: "transfer",
        args: [to as Address, value],
        chainId,
      });
      addRecentActivity({ to, amount, symbol, chainId }, hash);
      return hash;
    },
    [addRecentActivity, ensureNetwork, writeContractAsync],
  );

  const contextValue = useMemo<EvmWalletContextValue>(
    () => ({
      configured: true,
      isConnected: account.isConnected,
      isConnecting:
        account.status === "connecting" || account.status === "reconnecting",
      address: account.address,
      chainId: account.chainId,
      chainName: account.chainId
        ? evmNetworkById.get(account.chainId)?.name
        : undefined,
      openConnect,
      openNetworkSwitcher,
      openAccount,
      disconnect,
      switchNetwork,
      sendNative,
      sendToken,
      recentActivity,
    }),
    [
      account.address,
      account.chainId,
      account.isConnected,
      account.status,
      disconnect,
      openAccount,
      openConnect,
      openNetworkSwitcher,
      recentActivity,
      sendNative,
      sendToken,
      switchNetwork,
    ],
  );

  return (
    <EvmWalletContext.Provider value={contextValue}>
      {children}
    </EvmWalletContext.Provider>
  );
}

export function EvmWalletProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      {isReownConfigured ? (
        <WalletBridge>{children}</WalletBridge>
      ) : (
        <EvmWalletContext.Provider value={unavailableWallet}>
          {children}
        </EvmWalletContext.Provider>
      )}
    </WagmiProvider>
  );
}

export function useEvmWallet() {
  return useContext(EvmWalletContext);
}
