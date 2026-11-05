"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SOCIAL_KEYS = ["youtube", "x", "instagram", "tiktok", "discord", "spotify", "twitch", "soundcloud"];

export default function ProfileClient({
  initial,
}: {
  initial: {
    displayName: string;
    username: string;
    bio: string;
    avatarUrl: string;
    socials: Record<string, string>;
    email: string;
    verified: boolean;
  };
}) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(initial.displayName);
  const [username, setUsername] = useState(initial.username);
  const [bio, setBio] = useState(initial.bio);
  const [avatarUrl, setAvatarUrl] = useState(initial.avatarUrl);
  const [socials, setSocials] = useState<Record<string, string>>(initial.socials);
  const [verified, setVerified] = useState(initial.verified);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [verifyMsg, setVerifyMsg] = useState("");
  const [verifyUrl, setVerifyUrl] = useState<string | null>(null);

  async function save() {
    setBusy(true);
    setMsg("");
    const res = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save", displayName, bio, avatarUrl, socials }),
    });
    const data = await res.json();
    setBusy(false);
    setMsg(data.ok ? "Saved" : data.error || "Could not save");
    router.refresh();
  }

  async function saveUsername() {
    setMsg("");
    const res = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "username", username }),
    });
    const data = await res.json();
    setMsg(data.ok ? "Username updated" : data.error || "Could not update");
    router.refresh();
  }

  async function verify() {
    setVerifyMsg("");
    setVerifyUrl(null);
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "send-verification" }),
    });
    const data = await res.json();
    if (!data.ok) return setVerifyMsg(data.error || "Could not send that email");
    if (data.verified) {
      setVerified(true);
      return setVerifyMsg("Already confirmed.");
    }
    setVerifyMsg(
      data.sent ? "Confirmation email sent — check your inbox." : "No mail provider is configured in this clone."
    );
    setVerifyUrl(data.devUrl || null);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="card space-y-4 p-4">
        <h2 className="font-bold">Profile</h2>
        <div>
          <label className="label">Display name</label>
          <input className="input" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        </div>
        <div>
          <label className="label">Avatar URL</label>
          <input className="input" placeholder="https://…/avatar.jpg" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
        </div>
        <div>
          <label className="label">Bio</label>
          <textarea className="textarea" value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>
        {msg && <p className="text-sm accent-text">{msg}</p>}
        <button className="btn btn-primary" onClick={save} disabled={busy}>
          {busy ? "Saving…" : "Save profile"}
        </button>
      </div>

      <div className="space-y-6">
        <div className="card space-y-4 p-4">
          <h2 className="font-bold">Username</h2>
          <div className="flex items-center gap-1">
            <span className="text-sm faint">gatekeeper.com/u/</span>
            <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <button className="btn btn-secondary" onClick={saveUsername}>
            Update username
          </button>
          <p className="text-xs faint">Public address for your profile and custom link URLs.</p>
        </div>

        <div className="card space-y-3 p-4">
          <h2 className="font-bold">Socials</h2>
          {SOCIAL_KEYS.map((k) => (
            <div key={k} className="grid grid-cols-[100px_1fr] items-center gap-2">
              <span className="text-sm capitalize">{k}</span>
              <input
                className="input"
                placeholder="@handle or URL"
                value={socials[k] ?? ""}
                onChange={(e) => setSocials({ ...socials, [k]: e.target.value })}
              />
            </div>
          ))}
          <button className="btn btn-secondary" onClick={save}>
            Save socials
          </button>
        </div>

        <div className="card p-4">
          <h2 className="font-bold">Email</h2>
          <p className="mt-1 text-sm muted">{initial.email}</p>
          {verified ? (
            <span className="badge badge-good mt-2">✓ Verified</span>
          ) : (
            <button className="btn btn-primary mt-2" onClick={verify}>
              Send confirmation email
            </button>
          )}
          {verifyMsg && <p className="mt-2 text-sm accent-text">{verifyMsg}</p>}
          {verifyUrl && (
            <a href={verifyUrl} className="mt-2 block break-all text-sm font-semibold accent-text">
              Confirm now →
            </a>
          )}
          <p className="mt-2 text-xs faint">Your email must be verified before your link-in-bio page goes public.</p>
        </div>
      </div>
    </div>
  );
}
