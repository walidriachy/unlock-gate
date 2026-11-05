// Minimal OAuth 2.0 provider used only by tests.
//   node scripts/mock-oauth.mjs [port]
// Then point the app at it:
//   GOOGLE_CLIENT_ID=test GOOGLE_CLIENT_SECRET=test
//   GOOGLE_OAUTH_AUTHORIZE_URL=http://localhost:4010/authorize
//   GOOGLE_OAUTH_TOKEN_URL=http://localhost:4010/token
//   GOOGLE_OAUTH_USERINFO_URL=http://localhost:4010/google/userinfo
//   (same for DISCORD_OAUTH_*)
// It approves every request; the "user" is fixed so assertions are stable.

import http from "node:http";

const port = Number(process.argv[2] || 4010);

const USERS = {
  google: {
    sub: "mock-google-1",
    email: "oauth.google@gatekeeper.app",
    email_verified: true,
    name: "OAuth Google",
    picture: "",
  },
  discord: {
    id: "mock-discord-1",
    email: "oauth.discord@gatekeeper.app",
    verified: true,
    username: "oauth_discord",
    global_name: "OAuth Discord",
    avatar: null,
  },
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, { "Content-Type": "application/json", ...headers });
  res.end(typeof body === "string" ? body : JSON.stringify(body));
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);

  if (url.pathname === "/authorize") {
    const redirect = url.searchParams.get("redirect_uri");
    const state = url.searchParams.get("state") || "";
    const provider = url.searchParams.get("client_id") === "test-discord" ? "discord" : "google";
    if (!redirect) return send(res, 400, { error: "missing redirect_uri" });
    const target = new URL(redirect);
    target.searchParams.set("code", `mock-code-${provider}`);
    target.searchParams.set("state", state);
    res.writeHead(302, { Location: target.toString() });
    return res.end();
  }

  if (url.pathname === "/token" && req.method === "POST") {
    let raw = "";
    req.on("data", (c) => (raw += c));
    req.on("end", () => {
      send(res, 200, {
        access_token: "mock-access-token",
        token_type: "Bearer",
        expires_in: 3600,
      });
    });
    return;
  }

  if (url.pathname === "/google/userinfo") return send(res, 200, USERS.google);
  if (url.pathname === "/discord/userinfo") return send(res, 200, USERS.discord);

  send(res, 404, { error: "not found" });
});

server.listen(port, () => {
  console.log(`mock oauth provider on http://localhost:${port}`);
});

for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, () => server.close(() => process.exit(0)));
}
