export function rpcUrl(configured?: string | null): string {
  return configured || process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";
}

export async function rpc(method: string, params: any[], url: string): Promise<any> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || "RPC error");
  return data.result;
}

const LAMPORTS_PER_SOL = 1_000_000_000;

function hasMemo(tx: any, memo: string): boolean {
  const instructions = tx?.transaction?.message?.instructions || [];
  for (const ix of instructions) {
    const parsed = ix?.parsed;
    // Memo program instructions parse to the memo string itself.
    if (ix?.program === "spl-memo" && typeof parsed === "string" && parsed === memo) return true;
    if (parsed?.type === "memo" && String(parsed.info?.memo || "") === memo) return true;
  }
  const logs: string[] = tx?.meta?.logMessages || [];
  return logs.some((l) => l.includes(`"${memo}"`) || l.endsWith(memo));
}

/** How much the wallet received in this transaction, in whole units (SOL or the token). */
function amountReceived(tx: any, wallet: string, mint: string | null): number {
  const meta = tx?.meta;
  if (!meta) return 0;
  if (mint) {
    const owned = (list: any[] | undefined) =>
      (list || [])
        .filter((b) => b?.owner === wallet && b?.mint === mint)
        .reduce((sum, b) => sum + Number(b?.uiTokenAmount?.uiAmountString ?? b?.uiTokenAmount?.uiAmount ?? 0), 0);
    return owned(meta.postTokenBalances) - owned(meta.preTokenBalances);
  }
  const keys: any[] = tx?.transaction?.message?.accountKeys || [];
  const index = keys.findIndex((k) => (typeof k === "string" ? k : k?.pubkey) === wallet);
  if (index < 0) return 0;
  const delta = Number(meta.postBalances?.[index] ?? 0) - Number(meta.preBalances?.[index] ?? 0);
  return delta / LAMPORTS_PER_SOL;
}

/**
 * Find a successful transaction that carries exactly `memo` and paid `wallet`
 * at least `amount` (SOL, or the SPL token `mint`). Returns its signature.
 * A memo match alone is not enough: anyone can send a dust payment with the
 * right memo.
 */
export async function findPayment(
  wallet: string,
  memo: string,
  mint: string | null,
  amount: string,
  url: string
): Promise<string | null> {
  const expected = Number(amount);
  if (!Number.isFinite(expected) || expected <= 0) return null;
  try {
    const sigs = await rpc("getSignaturesForAddress", [wallet, { limit: 25 }], url);
    if (!Array.isArray(sigs)) return null;
    for (const s of sigs) {
      if (s?.err) continue;
      try {
        const tx = await rpc(
          "getTransaction",
          [s.signature, { encoding: "jsonParsed", maxSupportedTransactionVersion: 0, commitment: "confirmed" }],
          url
        );
        if (!tx || tx.meta?.err) continue;
        if (!hasMemo(tx, memo)) continue;
        // Small tolerance for float rounding only.
        if (amountReceived(tx, wallet, mint) + 1e-9 >= expected) return s.signature;
      } catch {
        /* ignore this signature */
      }
    }
    return null;
  } catch {
    return null;
  }
}
