"use client";

import { WalletButton } from "@/components/WalletButton";
import { BalanceCard } from "@/components/BalanceCard";
import { SendPaymentForm } from "@/components/SendPaymentForm";
import { useWallet } from "@/hooks/useWallet";
import { sendXlmPayment } from "@/lib/sendPayment";
import { truncateAddress } from "@/lib/stellar";

export default function Home() {
  const {
    publicKey,
    balance,
    loading,
    balanceLoading,
    error,
    connect,
    disconnect,
    refreshBalance,
    fundAccount,
    isConnected,
  } = useWallet();

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-violet-600/15 blur-3xl" />
      </div>

      <header className="relative border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-indigo-400">
              Level 1 · White Belt
            </p>
            <h1 className="text-xl font-bold">StellarPay</h1>
          </div>
          <WalletButton
            publicKey={publicKey}
            loading={loading}
            onConnect={connect}
            onDisconnect={disconnect}
          />
        </div>
      </header>

      <main className="relative mx-auto max-w-4xl px-6 py-10">
        {!isConnected ? (
          <section className="mx-auto max-w-lg text-center">
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-10 backdrop-blur">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 ring-1 ring-indigo-500/30">
                <svg
                  className="h-8 w-8 text-indigo-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold">Connect your wallet</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Install{" "}
                <a
                  href="https://www.freighter.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 underline hover:text-indigo-300"
                >
                  Freighter
                </a>
                , switch to <strong className="text-slate-300">Testnet</strong>,
                and connect to send XLM payments on the Stellar test network.
              </p>
            </div>
          </section>
        ) : (
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3">
              <p className="text-xs text-slate-500">Connected account</p>
              <p className="mt-0.5 font-mono text-sm text-slate-300">
                {publicKey}
              </p>
            </div>

            <BalanceCard
              balance={balance}
              loading={balanceLoading}
              error={error}
              onRefresh={() => publicKey && refreshBalance(publicKey)}
              onFund={fundAccount}
            />

            <SendPaymentForm
              disabled={!publicKey || balanceLoading}
              onSubmit={(destination, amount) =>
                sendXlmPayment(publicKey!, destination, amount)
              }
              onSuccess={() => publicKey && refreshBalance(publicKey)}
            />
          </div>
        )}

        <footer className="mt-12 text-center text-xs text-slate-600">
          Built for Stellar White Belt · Network: Testnet ·{" "}
          {publicKey
            ? `Wallet: ${truncateAddress(publicKey, 8)}`
            : "No wallet connected"}
        </footer>
      </main>
    </div>
  );
}
