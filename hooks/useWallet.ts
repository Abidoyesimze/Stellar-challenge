"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getAddress,
  isAllowed,
  isConnected,
  requestAccess,
} from "@stellar/freighter-api";
import { fetchXlmBalance, fundTestnetAccount } from "@/lib/stellar";

export function useWallet() {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshBalance = useCallback(async (address: string) => {
    setBalanceLoading(true);
    try {
      const xlm = await fetchXlmBalance(address);
      setBalance(xlm);
      setError(null);
    } catch {
      setBalance(null);
      setError("Account not funded on testnet. Use Fund Account to get test XLM.");
    } finally {
      setBalanceLoading(false);
    }
  }, []);

  const restoreSession = useCallback(async () => {
    setLoading(true);
    try {
      const connected = await isConnected();
      if (!connected.isConnected) return;

      const allowed = await isAllowed();
      if (!allowed.isAllowed) return;

      const { address, error: addressError } = await getAddress();
      if (addressError || !address) return;

      setPublicKey(address);
      await refreshBalance(address);
    } catch {
      // Freighter not available — user can connect manually
    } finally {
      setLoading(false);
    }
  }, [refreshBalance]);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const connect = useCallback(async () => {
    setError(null);
    const connected = await isConnected();
    if (!connected.isConnected) {
      throw new Error(
        "Freighter wallet not found. Install the extension and switch to Testnet.",
      );
    }

    const { address, error: accessError } = await requestAccess();
    if (accessError) {
      throw new Error(accessError.message ?? "Wallet connection denied.");
    }
    if (!address) {
      throw new Error("No wallet address returned from Freighter.");
    }

    setPublicKey(address);
    await refreshBalance(address);
  }, [refreshBalance]);

  const disconnect = useCallback(() => {
    setPublicKey(null);
    setBalance(null);
    setError(null);
  }, []);

  const fundAccount = useCallback(async () => {
    if (!publicKey) return;
    setError(null);
    setBalanceLoading(true);
    try {
      await fundTestnetAccount(publicKey);
      await refreshBalance(publicKey);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Funding failed.");
    } finally {
      setBalanceLoading(false);
    }
  }, [publicKey, refreshBalance]);

  return {
    publicKey,
    balance,
    loading,
    balanceLoading,
    error,
    connect,
    disconnect,
    refreshBalance,
    fundAccount,
    isConnected: !!publicKey,
  };
}
