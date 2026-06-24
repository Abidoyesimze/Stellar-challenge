import * as StellarSdk from "@stellar/stellar-sdk";

export const HORIZON_URL = "https://horizon-testnet.stellar.org";
export const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;
export const EXPLORER_URL = "https://stellar.expert/explorer/testnet/tx";

export const horizonServer = new StellarSdk.Horizon.Server(HORIZON_URL);

export async function fetchXlmBalance(publicKey: string): Promise<string> {
  const account = await horizonServer.loadAccount(publicKey);
  const native = account.balances.find((b) => b.asset_type === "native");
  return native?.balance ?? "0";
}

export async function fundTestnetAccount(publicKey: string): Promise<void> {
  const response = await fetch(
    `https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`,
  );
  if (!response.ok) {
    throw new Error("Friendbot funding failed. Try again in a moment.");
  }
}

export function truncateAddress(address: string, chars = 4): string {
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars + 1)}...${address.slice(-chars)}`;
}

export function isValidStellarAddress(address: string): boolean {
  return StellarSdk.StrKey.isValidEd25519PublicKey(address);
}
