// Social sign-in (Google + Discord). Separate from the action-verification
// OAuth in lib/verify.ts — this one only establishes a session.

export type LoginProvider = "google" | "discord";

/** Short-lived cookie holding the OAuth nonce. */
export const OAUTH_STATE_COOKIE = "gk_oauth_state";

export interface ProviderProfile {
  email: string;
  emailVerified: boolean;
  name: string;
  avatarUrl: string;
  provider: LoginProvider;
}

const CONFIG = {
  google: {
    id: () => process.env.GOOGLE_CLIENT_ID,
    secret: () => process.env.GOOGLE_CLIENT_SECRET,
    authorize: () =>
      process.env.GOOGLE_OAUTH_AUTHORIZE_URL ||
      "https://accounts.google.com/o/oauth2/v2/auth",
    token: () =>
      process.env.GOOGLE_OAUTH_TOKEN_URL || "https://oauth2.googleapis.com/token",
    userinfo: () =>
      process.env.GOOGLE_OAUTH_USERINFO_URL ||
      "https://openidconnect.googleapis.com/v1/userinfo",
    scope: "openid email profile",
  },
  discord: {
    id: () => process.env.DISCORD_CLIENT_ID,
    secret: () => process.env.DISCORD_CLIENT_SECRET,
    authorize: () =>
      process.env.DISCORD_OAUTH_AUTHORIZE_URL ||
      "https://discord.com/oauth2/authorize",
    token: () =>
      process.env.DISCORD_OAUTH_TOKEN_URL || "https://discord.com/api/oauth2/token",
    userinfo: () =>
      process.env.DISCORD_OAUTH_USERINFO_URL ||
      "https://discord.com/api/users/@me",
    scope: "identify email",
  },
} as const;

export function loginProviderConfigured(provider: LoginProvider): boolean {
  const c = CONFIG[provider];
  return Boolean(c.id() && c.secret());
}

export function loginProviders(): { id: LoginProvider; label: string; configured: boolean }[] {
  return [
    { id: "google", label: "Google", configured: loginProviderConfigured("google") },
    { id: "discord", label: "Discord", configured: loginProviderConfigured("discord") },
  ];
}

export function isLoginProvider(v: string): v is LoginProvider {
  return v === "google" || v === "discord";
}

export function authorizeUrl(
  provider: LoginProvider,
  redirectUri: string,
  state: string
): string {
  const c = CONFIG[provider];
  const url = new URL(c.authorize());
  url.searchParams.set("client_id", c.id() as string);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", c.scope);
  url.searchParams.set("state", state);
  if (provider === "google") {
    url.searchParams.set("prompt", "select_account");
    url.searchParams.set("access_type", "online");
  }
  return url.toString();
}

async function exchange(
  provider: LoginProvider,
  code: string,
  redirectUri: string
): Promise<string | null> {
  const c = CONFIG[provider];
  const res = await fetch(c.token(), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: c.id() as string,
      client_secret: c.secret() as string,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.access_token ?? null;
}

export async function loginProfile(
  provider: LoginProvider,
  code: string,
  redirectUri: string
): Promise<ProviderProfile | null> {
  const token = await exchange(provider, code, redirectUri);
  if (!token) return null;

  if (provider === "google") {
    const res = await fetch(CONFIG.google.userinfo(), {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const p = await res.json();
    if (!p.email) return null;
    return {
      email: String(p.email).toLowerCase(),
      emailVerified: Boolean(p.email_verified),
      name: String(p.name || p.email.split("@")[0]),
      avatarUrl: String(p.picture || ""),
      provider,
    };
  }

  const res = await fetch(CONFIG.discord.userinfo(), {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  const p = await res.json();
  if (!p.email) return null;
  const avatar = p.avatar
    ? `https://cdn.discordapp.com/avatars/${p.id}/${p.avatar}.png?size=128`
    : "";
  return {
    email: String(p.email).toLowerCase(),
    emailVerified: Boolean(p.verified),
    name: String(p.global_name || p.username || p.email.split("@")[0]),
    avatarUrl: avatar,
    provider,
  };
}
