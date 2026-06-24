"use client";

interface BalanceCardProps {
  balance: string | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onFund: () => void;
}

export function BalanceCard({
  balance,
  loading,
  error,
  onRefresh,
  onFund,
}: BalanceCardProps) {
  return (
    <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-6 backdrop-blur">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-medium uppercase tracking-wider text-slate-400">
          XLM Balance
        </h2>
        <div className="flex gap-2">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="rounded-md px-2 py-1 text-xs text-slate-400 transition hover:text-white disabled:opacity-50"
          >
            Refresh
          </button>
          <button
            onClick={onFund}
            disabled={loading}
            className="rounded-md bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-400 ring-1 ring-amber-500/30 transition hover:bg-amber-500/20 disabled:opacity-50"
          >
            Fund via Friendbot
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-3xl font-bold text-slate-500">Loading…</p>
      ) : error ? (
        <div>
          <p className="text-3xl font-bold text-slate-600">—</p>
          <p className="mt-2 text-sm text-amber-400">{error}</p>
        </div>
      ) : (
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-white">
            {balance ?? "0"}
          </span>
          <span className="text-lg font-medium text-indigo-400">XLM</span>
        </div>
      )}

      <p className="mt-3 text-xs text-slate-500">Stellar Testnet</p>
    </div>
  );
}
