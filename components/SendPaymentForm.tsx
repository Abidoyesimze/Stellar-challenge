"use client";

import { useState } from "react";
import type { PaymentResult } from "@/lib/sendPayment";

interface SendPaymentFormProps {
  disabled: boolean;
  onSubmit: (destination: string, amount: string) => Promise<PaymentResult>;
  onSuccess: () => void;
}

export function SendPaymentForm({
  disabled,
  onSubmit,
  onSuccess,
}: SendPaymentFormProps) {
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<PaymentResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setResult(null);

    const paymentResult = await onSubmit(destination, amount);
    setResult(paymentResult);
    setSending(false);

    if (paymentResult.success) {
      setDestination("");
      setAmount("");
      onSuccess();
    }
  };

  return (
    <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-6 backdrop-blur">
      <h2 className="mb-5 text-sm font-medium uppercase tracking-wider text-slate-400">
        Send Payment
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="destination"
            className="mb-1.5 block text-sm text-slate-300"
          >
            Destination address
          </label>
          <input
            id="destination"
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
            required
            disabled={disabled || sending}
            className="w-full rounded-lg border border-slate-600 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
          />
          <p className="mt-1.5 text-xs text-slate-500">
            Unfunded testnet accounts need at least 1 XLM to be created.
          </p>
        </div>

        <div>
          <label
            htmlFor="amount"
            className="mb-1.5 block text-sm text-slate-300"
          >
            Amount (XLM)
          </label>
          <input
            id="amount"
            type="number"
            min="0.0000001"
            step="0.0000001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="1.0"
            required
            disabled={disabled || sending}
            className="w-full rounded-lg border border-slate-600 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={disabled || sending || !destination || !amount}
          className="w-full rounded-lg bg-indigo-500 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {sending ? "Sending…" : "Send XLM on Testnet"}
        </button>
      </form>

      {result && (
        <div
          className={`mt-4 rounded-lg p-4 text-sm ${
            result.success
              ? "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/30"
              : "bg-red-500/10 text-red-300 ring-1 ring-red-500/30"
          }`}
        >
          {result.success ? (
            <div>
              <p className="font-semibold">Transaction successful!</p>
              <p className="mt-1 break-all text-xs opacity-80">
                Hash: {result.hash}
              </p>
              <a
                href={`https://stellar.expert/explorer/testnet/tx/${result.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-xs underline hover:text-emerald-200"
              >
                View on Stellar Expert →
              </a>
            </div>
          ) : (
            <div>
              <p className="font-semibold">Transaction failed</p>
              <p className="mt-1 opacity-80">{result.message}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
