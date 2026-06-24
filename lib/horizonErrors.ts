type HorizonErrorBody = {
  detail?: string;
  title?: string;
  extras?: {
    result_codes?: {
      operations?: string[];
      transaction?: string;
    };
  };
};

const OPERATION_ERRORS: Record<string, string> = {
  op_no_destination:
    "Destination account does not exist on testnet. Send at least 1 XLM to create it, or fund that address with Friendbot first.",
  op_underfunded:
    "Insufficient balance. Keep enough XLM for the payment plus the network fee.",
  op_line_full: "Destination cannot receive this payment.",
  op_low_reserve:
    "Amount is too low. New accounts need at least 1 XLM on testnet.",
};

const TRANSACTION_ERRORS: Record<string, string> = {
  tx_bad_auth:
    "Freighter is not on Testnet. Open Freighter → Settings → Network → Testnet, then try again.",
  tx_bad_seq:
    "Account sequence is out of date. Refresh your balance and try again.",
  tx_insufficient_fee: "Network fee too low. Try again in a moment.",
  tx_failed: "Transaction failed. Check the destination address and amount.",
};

function formatHorizonBody(body: unknown): string {
  const data = body as HorizonErrorBody;
  const opCode = data.extras?.result_codes?.operations?.[0];
  const txCode = data.extras?.result_codes?.transaction;

  if (opCode && OPERATION_ERRORS[opCode]) {
    return OPERATION_ERRORS[opCode];
  }
  if (txCode && TRANSACTION_ERRORS[txCode]) {
    return TRANSACTION_ERRORS[txCode];
  }
  if (opCode) return `Operation failed: ${opCode}`;
  if (txCode) return `Transaction failed: ${txCode}`;
  return data.detail ?? data.title ?? "Transaction rejected by the network.";
}

export function parseHorizonError(err: unknown): string {
  if (err && typeof err === "object" && "response" in err) {
    const response = (err as { response?: unknown }).response;

    // BadResponseError / NetworkError — response is the Horizon JSON body
    if (response && typeof response === "object" && "extras" in response) {
      return formatHorizonBody(response);
    }

    // Raw axios error — response.data holds the Horizon body
    if (response && typeof response === "object" && "data" in response) {
      return formatHorizonBody((response as { data: unknown }).data);
    }
  }

  return err instanceof Error ? err.message : "Unknown error occurred.";
}

export async function accountExists(publicKey: string): Promise<boolean> {
  const { horizonServer } = await import("./stellar");
  try {
    await horizonServer.loadAccount(publicKey);
    return true;
  } catch {
    return false;
  }
}

export const MIN_NEW_ACCOUNT_XLM = 1;
