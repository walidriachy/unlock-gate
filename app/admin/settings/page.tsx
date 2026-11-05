"use client";

import { useEffect, useState } from "react";

interface Flag { key: string; label: string }

export default function AdminSettingsPage() {
  const [flags, setFlags] = useState<Flag[]>([]);
  const [values, setValues] = useState<Record<string, boolean>>({});
  const [config, setConfig] = useState<Record<string, string>>({});
  const [proPrice, setProPrice] = useState("");
  const [lifePrice, setLifePrice] = useState("");
  const [solWallet, setSolWallet] = useState("");
  const [solMint, setSolMint] = useState("");
  const [solPro, setSolPro] = useState("19");
  const [solLife, setSolLife] = useState("149");
  const [solRpc, setSolRpc] = useState("");
  const [solMsg, setSolMsg] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.ok) {
        setFlags(data.flags);
        setValues(data.values || {});
        setConfig(data.config || {});
        setProPrice((data.config || {}).stripe_price_pro_monthly || "");
        setLifePrice((data.config || {}).stripe_price_lifetime || "");
        setSolWallet((data.config || {}).solana_merchant_wallet || "");
        setSolMint((data.config || {}).solana_token_mint || "");
        setSolPro((data.config || {}).solana_pro_amount || "19");
        setSolLife((data.config || {}).solana_lifetime_amount || "149");
        setSolRpc((data.config || {}).solana_rpc_url || "");
      }
      setLoading(false);
    })();
  }, []);

  async function toggle(key: string) {
    const next = !values[key];
    setValues((v) => ({ ...v, [key]: next }));
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value: next }),
    });
  }

  async function saveConfig() {
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ configKey: "stripe_price_pro_monthly", configValue: proPrice }),
    });
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ configKey: "stripe_price_lifetime", configValue: lifePrice }),
    });
    setMsg("Saved.");
  }

  async function saveSolana() {
    const pairs: [string, string][] = [
      ["solana_merchant_wallet", solWallet],
      ["solana_token_mint", solMint],
      ["solana_pro_amount", solPro],
      ["solana_lifetime_amount", solLife],
      ["solana_rpc_url", solRpc],
    ];
    for (const [k, v] of pairs) {
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ configKey: k, configValue: v }),
      });
    }
    setSolMsg("Saved.");
  }

  if (loading) return <p className="text-sm muted">Loading…</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold tracking-tight">Platform settings & feature flags</h1>

      <div className="card divide-y divide-[var(--color-line)]">
        {flags.map((f) => (
          <label key={f.key} className="flex items-center justify-between gap-4 p-4">
            <span className="text-sm">{f.label}</span>
            <input
              type="checkbox"
              checked={Boolean(values[f.key])}
              onChange={() => toggle(f.key)}
              className="h-4 w-4 accent-[var(--accent)]"
            />
          </label>
        ))}
      </div>
      <p className="text-xs faint">Flags are stored in the data store and read by the app at runtime.</p>

      <div className="card p-4 space-y-3">
        <h2 className="font-bold">Stripe (secret key stays in env: STRIPE_SECRET_KEY)</h2>
        <div>
          <label className="label">Pro monthly price ID</label>
          <input className="input" placeholder="price_..." value={proPrice} onChange={(e) => setProPrice(e.target.value)} />
        </div>
        <div>
          <label className="label">Lifetime price ID</label>
          <input className="input" placeholder="price_..." value={lifePrice} onChange={(e) => setLifePrice(e.target.value)} />
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-primary" onClick={saveConfig}>Save price IDs</button>
          {msg && <span className="text-xs faint">{msg}</span>}
        </div>
      </div>

      <div className="card p-4 space-y-3">
        <h2 className="font-bold">Solana Pay (crypto)</h2>
        <p className="text-xs faint">Secret key not needed; only wallet + amounts + optional RPC.</p>
        <div>
          <label className="label">Merchant wallet address</label>
          <input className="input" placeholder="Base58 public key" value={solWallet} onChange={(e) => setSolWallet(e.target.value)} />
        </div>
        <div>
          <label className="label">Token mint (blank = SOL; USDC default suggested)</label>
          <input className="input" placeholder="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" value={solMint} onChange={(e) => setSolMint(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Pro amount (token units)</label>
            <input className="input" placeholder="19" value={solPro} onChange={(e) => setSolPro(e.target.value)} />
          </div>
          <div>
            <label className="label">Lifetime amount (token units)</label>
            <input className="input" placeholder="149" value={solLife} onChange={(e) => setSolLife(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="label">RPC URL (optional)</label>
          <input className="input" placeholder="https://api.mainnet-beta.solana.com" value={solRpc} onChange={(e) => setSolRpc(e.target.value)} />
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-primary" onClick={saveSolana}>Save Solana settings</button>
          {solMsg && <span className="text-xs faint">{solMsg}</span>}
        </div>
      </div>
    </div>
  );
}
