import type { Action } from "./db";

// ---------------------------------------------------------------------------
// Verification.
//
// The original validates unlocks on its own servers against each platform's
// API. That needs an app + API terms per platform (out of scope — see
// replica/recon.md "Out of scope"). This clone ships the *flow* and a
// pluggable verifier:
//
//   - "click": the visitor opens the real platform and confirms on return.
//     The server records the step against their visitor token. This is the
//     honest demo mode for platforms without a registered app.
//   - "email": subscribing an address to a list.
//   - "oauth": a real OAuth check, wired for Discord and GitHub when the env
//     keys exist; otherwise it degrades to "click" so the flow still works.
//
// Either way the *unlock row is created server-side* and the destination is
// only released by the unlock endpoint — the client can't just flip a flag.
// ---------------------------------------------------------------------------

export type EffectiveMode = "click" | "email" | "oauth";

export function effectiveMode(action: Pick<Action, "verificationMode" | "provider">): EffectiveMode {
  if (action.verificationMode === "email") return "email";
  if (action.verificationMode === "oauth" && oauthConfigured(action.provider)) return "oauth";
  return "click";
}

export function oauthConfigured(provider: string): boolean {
  if (provider === "discord") {
    return Boolean(process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET);
  }
  if (provider === "github") {
    return Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET);
  }
  return false;
}

/** Where an OAuth-based verification would send the visitor, if configured. */
export function oauthAuthorizeUrl(provider: string, redirectUri: string, state: string): string | null {
  if (provider === "discord" && oauthConfigured("discord")) {
    const p = new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID as string,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "identify guilds",
      state,
    });
    return `https://discord.com/oauth2/authorize?${p.toString()}`;
  }
  if (provider === "github" && oauthConfigured("github")) {
    const p = new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID as string,
      redirect_uri: redirectUri,
      scope: "read:user",
      state,
    });
    return `https://github.com/login/oauth/authorize?${p.toString()}`;
  }
  return null;
}

/**
 * In demo ("click") mode we accept that the visitor opened the target. We do a
 * few cheap sanity checks so the flow can't be completed instantly by a script
 * firing both events in the same tick.
 */
export function stepLooksHuman(openedAt: number | null | undefined): boolean {
  if (!openedAt) return true; // no timing info — don't block
  return Date.now() - openedAt > 900;
}
