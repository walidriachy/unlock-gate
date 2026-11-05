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

/** Look for a transaction to `wallet` whose memo contains `memo`. Returns signature if found. */
export async function findMemoTransaction(wallet: string, memo: string, url: string): Promise<string | null> {
  try {
    const sigs = await rpc("getSignaturesForAddress", [wallet, { limit: 25 }], url);
    if (!Array.isArray(sigs)) return null;
    for (const s of sigs) {
      try {
        const tx = await rpc("getTransaction", [s.signature, { encoding: "jsonParsed", maxSupportedTransactionVersion: 0 }], url);
        const msg = tx?.transaction?.message;
        const instructions = msg?.instructions || [];
        for (const ix of instructions) {
          const parsed = ix?.parsed;
          if (parsed?.type === "memo" && String(parsed.info?.memo || "").includes(memo)) {
            return s.signature;
          }
          // Some wallets put memo in log messages
        }
        const logs: string[] = tx?.meta?.logMessages || [];
        if (logs.some((l) => l.includes(memo))) return s.signature;
      } catch {
        /* ignore */
      }
    }
    return null;
  } catch {
    return null;
  }
}
