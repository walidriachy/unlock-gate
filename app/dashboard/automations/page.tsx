"use client";

import { useEffect, useState } from "react";

export default function AutomationsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ igAccountId: "", name: "", keywords: "", linkId: "", dmMessage: "Hey {username}, here's your link:", publicReply: "", matchMode: "contains", followGate: false });
  const [acct, setAcct] = useState({ igUserId: "", username: "", accessToken: "" });
  const [msg, setMsg] = useState("");

  async function load() {
    const res = await fetch("/api/automations");
    const data = await res.json();
    if (data.ok) {
      setAccounts(data.accounts);
      setCampaigns(data.campaigns);
      setLinks(data.links);
      if (!form.igAccountId && data.accounts.length) setForm((f) => ({ ...f, igAccountId: data.accounts[0].id }));
    }
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function connectAccount(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/automations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "connectAccount", ...acct }) });
    const data = await res.json();
    if (!data.ok) return setMsg(data.error || "Failed");
    setAcct({ igUserId: "", username: "", accessToken: "" });
    setMsg("Account connected.");
    load();
  }

  async function createCampaign(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/automations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "createCampaign", ...form }) });
    const data = await res.json();
    if (!data.ok) return setMsg(data.error || "Failed");
    setForm({ igAccountId: form.igAccountId, name: "", keywords: "", linkId: "", dmMessage: "Hey {username}, here's your link:", publicReply: "", matchMode: "contains", followGate: false });
    setMsg("Campaign created.");
    load();
  }

  async function toggle(id: string) {
    await fetch("/api/automations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "toggle", id }) });
    load();
  }
  async function remove(id: string) {
    await fetch("/api/automations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "delete", id }) });
    load();
  }

  if (loading) return <p className="text-sm muted">Loading…</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Instagram DM automation</h1>
        <p className="mt-1 text-sm muted">
          Comment-to-DM, built in. Connect an Instagram account, create a keyword campaign, and Gatekeeper sends your unlock link when someone comments the keyword.
        </p>
      </div>

      {msg && <p className="text-sm accent-text">{msg}</p>}

      <div className="card p-4 space-y-3">
        <h2 className="font-bold">Connect an Instagram account</h2>
        <p className="text-xs faint">Paste an Instagram Graph API access token for a Business/Creator account. (OAuth flow can be wired later.)</p>
        <form onSubmit={connectAccount} className="grid gap-3 sm:grid-cols-3">
          <input className="input" placeholder="IG user id" value={acct.igUserId} onChange={(e) => setAcct({ ...acct, igUserId: e.target.value })} />
          <input className="input" placeholder="@username" value={acct.username} onChange={(e) => setAcct({ ...acct, username: e.target.value })} />
          <input className="input" placeholder="Access token" value={acct.accessToken} onChange={(e) => setAcct({ ...acct, accessToken: e.target.value })} />
          <button className="btn btn-primary sm:col-span-3">Connect account</button>
        </form>
        {accounts.length > 0 && (
          <ul className="text-xs faint">
            {accounts.map((a) => <li key={a.id}>@{a.username} ({a.igUserId})</li>)}
          </ul>
        )}
      </div>

      <div className="card p-4 space-y-3">
        <h2 className="font-bold">New campaign</h2>
        <form onSubmit={createCampaign} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label">Name</label>
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="label">Instagram account</label>
              <select className="select" value={form.igAccountId} onChange={(e) => setForm({ ...form, igAccountId: e.target.value })}>
                {accounts.map((a) => <option key={a.id} value={a.id}>@{a.username}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Keywords (comma separated)</label>
            <input className="input" placeholder="LINK, link, send" value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} />
          </div>
          <div>
            <label className="label">Match mode</label>
            <select className="select" value={form.matchMode} onChange={(e) => setForm({ ...form, matchMode: e.target.value })}>
              <option value="contains">Contains keyword</option>
              <option value="exact">Whole word</option>
            </select>
          </div>
          <div>
            <label className="label">Unlock link to send</label>
            <select className="select" value={form.linkId} onChange={(e) => setForm({ ...form, linkId: e.target.value })}>
              <option value="">None</option>
              {links.map((l) => <option key={l.id} value={l.id}>{l.title}</option>)}
            </select>
          </div>
          <div>
            <label className="label">DM message (use {`{username}`})</label>
            <textarea className="textarea" rows={3} value={form.dmMessage} onChange={(e) => setForm({ ...form, dmMessage: e.target.value })} />
          </div>
          <div>
            <label className="label">Public reply (optional)</label>
            <input className="input" placeholder="Sent you a DM!" value={form.publicReply} onChange={(e) => setForm({ ...form, publicReply: e.target.value })} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.followGate} onChange={(e) => setForm({ ...form, followGate: e.target.checked })} />
            Follow gate (ask them to follow first)
          </label>
          <button className="btn btn-primary">Create campaign</button>
        </form>
      </div>

      <div className="card p-4 space-y-3">
        <h2 className="font-bold">Campaigns</h2>
        {campaigns.length === 0 && <p className="text-sm muted">No campaigns yet.</p>}
        {campaigns.map((c) => (
          <div key={c.id} className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-line)] pt-3 first:border-0 first:pt-0">
            <div>
              <p className="font-semibold">{c.name} {c.active ? <span className="badge badge-good">active</span> : <span className="badge">paused</span>}</p>
              <p className="text-xs faint">keywords: {c.keywords.join(", ")} · match: {c.matchMode}</p>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-ghost btn-sm" onClick={() => toggle(c.id)}>{c.active ? "Pause" : "Activate"}</button>
              <button className="btn btn-ghost btn-sm" onClick={() => remove(c.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-4">
        <h2 className="font-bold">Webhook URL</h2>
        <p className="mt-1 text-xs faint">Set this as your Meta webhook callback URL (verify token: <code>gatekeeper</code> or <code>META_VERIFY_TOKEN</code>):</p>
        <code className="mt-2 block break-all rounded bg-[var(--color-surface-2)] p-2 text-xs">{typeof window !== "undefined" ? window.location.origin : ""}/api/automations/webhook</code>
      </div>
    </div>
  );
}
