"use client";

import { useState } from "react";
import { truncateAddress } from "@/lib/stellar";

interface WalletButtonProps {
  publicKey: string | null;
  loading: boolean;
  onConnect: () => Promise<void>;
  onDisconnect: () => void;
}

export function WalletButton({
  publicKey,
  loading,
  onConnect,
  onDisconnect,
}: WalletButtonProps) {
  const [connecting, setConnecting] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null);

  const handleConnect = async () => {
    setConnecting(true);
    setConnectError(null);
    try {
      await onConnect();
    } catch (err) {
      setConnectError(
        err instanceof Error ? err.message : "Failed to connect wallet.",
      );
    } finally {
      setConnecting(false);
    }
  };

  if (loading) {
    return (
      <button
        disabled
        className="rounded-lg bg-slate-800/50 px-4 py-2 text-sm text-slate-400"
      >
        Checking wallet…
      </button>
    );
  }

  if (publicKey) {
    return (
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/30">
          {truncateAddress(publicKey, 6)}
        </span>
        <button
          onClick={onDisconnect}
          className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-300 transition hover:border-red-500/50 hover:text-red-400"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={handleConnect}
        disabled={connecting}
        className="rounded-lg bg-indigo-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:opacity-60"
      >
        {connecting ? "Connecting…" : "Connect Freighter"}
      </button>
      {connectError && (
        <p className="max-w-xs text-right text-xs text-red-400">{connectError}</p>
      )}
    </div>
  );
}
