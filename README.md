# StellarPay — Level 1 White Belt

A simple Stellar payment dApp built for the **Level 1 – White Belt** challenge. Connect your Freighter wallet on **Testnet**, view your XLM balance, and send payments to any Stellar address.

## Features

- **Wallet connection** — Connect and disconnect via [Freighter](https://www.freighter.app/)
- **Balance display** — Fetches and shows the connected account's native XLM balance
- **Testnet funding** — One-click Friendbot funding for unfunded accounts
- **Send XLM** — Build, sign, and submit payment transactions on Stellar testnet
- **Transaction feedback** — Success/failure states with transaction hash and explorer link

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router, TypeScript)
- [Tailwind CSS](https://tailwindcss.com/)
- [@stellar/stellar-sdk](https://github.com/stellar/js-stellar-sdk)
- [@stellar/freighter-api](https://docs.freighter.app/)

## Prerequisites

1. [Node.js](https://nodejs.org/) 18+
2. [Freighter browser extension](https://www.freighter.app/) installed
3. Freighter set to **Testnet** (Settings → Network → Testnet)

## Setup

```bash
# Clone the repository
git clone https://github.com/Abidoyesimze/Stellar-challenge.git
cd stellar-challenge1

# Install dependencies
npm install

# Start the dev server (HTTPS required for Freighter)
npm run dev
```

Open [https://localhost:3000](https://localhost:3000) in your browser.

> **Note:** Freighter requires a secure context (HTTPS). The dev script uses `--experimental-https` so the wallet can connect on localhost.

## Usage

1. Click **Connect Freighter** and approve the connection in the extension popup.
2. If your account has no testnet XLM, click **Fund via Friendbot** to receive free test lumens.
3. Enter a destination Stellar address and amount, then click **Send XLM on Testnet**.
4. Approve the transaction in Freighter — you'll see a success message with the transaction hash and a link to Stellar Expert.

## Project Structure

```
├── app/
│   ├── page.tsx          # Main dApp page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── WalletButton.tsx  # Connect / disconnect UI
│   ├── BalanceCard.tsx   # XLM balance display
│   └── SendPaymentForm.tsx # Payment form + tx feedback
├── hooks/
│   └── useWallet.ts      # Wallet state & balance logic
└── lib/
    ├── stellar.ts        # Horizon server & helpers
    └── sendPayment.ts    # Transaction building & submission
```

## Screenshots

> Add screenshots here after testing locally. Place images in `docs/screenshots/` and reference them below.

| Wallet connected | Balance displayed | Successful transaction |
|---|---|---|
| ![Wallet connected](docs/screenshots/wallet-connected.png) | ![Balance](docs/screenshots/balance-displayed.png) | ![Transaction success](docs/screenshots/transaction-success.png) |

## Deployment

Deploy to [Vercel](https://vercel.com/) or any static host that supports Next.js:

```bash
npm run build
npm start
```

## Challenge Checklist

- [x] Freighter wallet integration (Testnet)
- [x] Wallet connect / disconnect
- [x] XLM balance fetch and display
- [x] Send XLM transaction on testnet
- [x] Transaction success/failure feedback with hash
- [x] Public GitHub repository
- [x] README with setup instructions
- [ ] Screenshots (capture after local testing)

## License

MIT
