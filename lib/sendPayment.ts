import * as StellarSdk from "@stellar/stellar-sdk";
import { BadResponseError } from "@stellar/stellar-sdk";
import { getNetworkDetails, signTransaction } from "@stellar/freighter-api";
import {
  accountExists,
  MIN_NEW_ACCOUNT_XLM,
  parseHorizonError,
} from "./horizonErrors";
import {
  horizonServer,
  isValidStellarAddress,
  NETWORK_PASSPHRASE,
} from "./stellar";

export type PaymentResult =
  | { success: true; hash: string }
  | { success: false; message: string };

async function assertFreighterTestnet(): Promise<string | null> {
  const { networkPassphrase, network, error } = await getNetworkDetails();
  if (error) {
    return error.message ?? "Could not read Freighter network settings.";
  }
  if (networkPassphrase !== NETWORK_PASSPHRASE) {
    return `Freighter is on ${network ?? "the wrong network"}, not Testnet. Switch to Testnet in Freighter Settings → Network.`;
  }
  return null;
}

export async function sendXlmPayment(
  sourcePublicKey: string,
  destination: string,
  amount: string,
): Promise<PaymentResult> {
  if (!isValidStellarAddress(destination)) {
    return { success: false, message: "Invalid destination Stellar address." };
  }

  if (destination === sourcePublicKey) {
    return { success: false, message: "Cannot send a payment to yourself." };
  }

  const parsedAmount = Number(amount);
  if (!amount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
    return { success: false, message: "Enter a valid amount greater than 0." };
  }

  const networkError = await assertFreighterTestnet();
  if (networkError) {
    return { success: false, message: networkError };
  }

  const destinationFunded = await accountExists(destination);
  if (!destinationFunded && parsedAmount < MIN_NEW_ACCOUNT_XLM) {
    return {
      success: false,
      message: `Destination is not funded on testnet. Send at least ${MIN_NEW_ACCOUNT_XLM} XLM to create the account.`,
    };
  }

  try {
    const sourceAccount = await horizonServer.loadAccount(sourcePublicKey);

    const operation = destinationFunded
      ? StellarSdk.Operation.payment({
          destination,
          asset: StellarSdk.Asset.native(),
          amount,
        })
      : StellarSdk.Operation.createAccount({
          destination,
          startingBalance: amount,
        });

    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(operation)
      .setTimeout(30)
      .build();

    const { signedTxXdr, error: signError } = await signTransaction(
      transaction.toXDR(),
      { networkPassphrase: NETWORK_PASSPHRASE },
    );

    if (signError) {
      return {
        success: false,
        message: signError.message ?? "Transaction signing was cancelled.",
      };
    }

    const signedTx = StellarSdk.TransactionBuilder.fromXDR(
      signedTxXdr,
      NETWORK_PASSPHRASE,
    );

    const result = await horizonServer.submitTransaction(signedTx);
    return { success: true, hash: result.hash };
  } catch (err) {
    if (err instanceof BadResponseError) {
      return { success: false, message: parseHorizonError(err) };
    }
    return { success: false, message: parseHorizonError(err) };
  }
}
