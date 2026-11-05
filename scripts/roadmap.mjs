// Roadmap progress from ROADMAP.md.
//   node scripts/roadmap.mjs
//   node scripts/roadmap.mjs --json
//   node scripts/roadmap.mjs --next       (first unchecked task)
import fs from "node:fs";
import path from "node:path";

const file = path.join(process.cwd(), "ROADMAP.md");
const lines = fs.readFileSync(file, "utf8").split("\n");

const phases = [];
let phase = { id: "P0", title: "Overall", tasks: [] };

for (const line of lines) {
  const h = line.match(/^## (P\d+) — (.+)$/);
  if (h) {
    if (phase.tasks.length || phase.id !== "P0") phases.push(phase);
    phase = { id: h[1], title: h[2], tasks: [] };
    continue;
  }
  const t = line.match(/^- \[( |~|x)\] \*\*(P\d+\.\d+)\*\* (.+)$/);
  if (t) {
    phase.tasks.push({
      id: t[2],
      title: t[3],
      status: t[1] === "x" ? "done" : t[1] === "~" ? "in-progress" : "todo",
    });
  }
}
if (phase.tasks.length) phases.push(phase);

const all = phases.flatMap((p) => p.tasks);
const done = all.filter((t) => t.status === "done").length;
const doing = all.filter((t) => t.status === "in-progress").length;
const pct = all.length ? Math.round((done / all.length) * 100) : 0;

if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ done, doing, total: all.length, pct, phases }, null, 2));
  process.exit(0);
}

if (process.argv.includes("--next")) {
  const next = all.find((t) => t.status !== "done");
  console.log(next ? `${next.id}  ${next.title}` : "All tasks complete.");
  process.exit(0);
}

const bar = (n, total, width = 18) => {
  const filled = total ? Math.round((n / total) * width) : 0;
  return "█".repeat(filled) + "░".repeat(width - filled);
};

console.log(`\nGatekeeper build — ${done}/${all.length} tasks (${pct}%)${doing ? ` · ${doing} in progress` : ""}`);
console.log(`${bar(done, all.length)}  ${pct}%\n`);
for (const p of phases) {
  const d = p.tasks.filter((t) => t.status === "done").length;
  const current = p.tasks.some((t) => t.status === "in-progress");
  const mark = d === p.tasks.length ? "✓" : current ? "▸" : " ";
  console.log(`${mark} ${p.id}  ${p.title} — ${d}/${p.tasks.length}`);
  for (const t of p.tasks) {
    const icon = t.status === "done" ? "☑" : t.status === "in-progress" ? "◐" : "☐";
    console.log(`   ${icon} ${t.id}  ${t.title}`);
  }
  console.log("");
}
