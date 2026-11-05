// Reads data/db.json and prints SQL INSERT statements for the Postgres schema
// in replica/schema.sql. Review before running; not a substitute for a real migration.
import fs from "node:fs";

const db = JSON.parse(fs.readFileSync("./data/db.json", "utf8"));
function sql(v) {
  if (v === null || v === undefined) return "NULL";
  if (typeof v === "boolean") return v ? "TRUE" : "FALSE";
  if (typeof v === "number") return String(v);
  return `'${String(v).replace(/'/g, "''")}'`;
}
function json(v) {
  return sql(JSON.stringify(v));
}

console.log("-- Gatekeeper data migration");
console.log("BEGIN;");
for (const u of db.users) {
  console.log(`INSERT INTO users (id,email,password_hash,provider,role,username,display_name,avatar_url,bio,socials,email_verified_at,session_version,created_at) VALUES (${sql(u.id)},${sql(u.email)},${sql(u.passwordHash)},${sql(u.provider)},${sql(u.role || "user")},${sql(u.username)},${sql(u.displayName)},${sql(u.avatarUrl)},${sql(u.bio)},${json(u.socials)},${sql(u.emailVerifiedAt)},${sql(u.sessionVersion || 0)},${sql(u.createdAt)});`);
}
for (const l of db.links) {
  console.log(`INSERT INTO links (id,user_id,slug,custom_slug,title,accent_color,cover_url,background,destination_type,destination_url,file_id,text_snippet,status,scheduled_at,expires_at,collection_id,views,unlocks,created_at,updated_at) VALUES (${sql(l.id)},${sql(l.userId)},${sql(l.slug)},${sql(l.customSlug)},${sql(l.title)},${sql(l.accentColor)},${sql(l.coverUrl)},${json(l.background)},${sql(l.destinationType)},${sql(l.destinationUrl)},${sql(l.fileId)},${sql(l.textSnippet)},${sql(l.status)},${sql(l.scheduledAt)},${sql(l.expiresAt)},${sql(l.collectionId)},${l.views},${l.unlocks},${sql(l.createdAt)},${sql(l.updatedAt)});`);
}
console.log("COMMIT;");
console.log(`-- users: ${db.users.length}, links: ${db.links.length}`);
