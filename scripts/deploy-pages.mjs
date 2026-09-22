/**
 * Build and publish to GitHub Pages.
 *
 *   node scripts/deploy-pages.mjs
 *
 * Pages serves this repo from a sub-path, so the build needs
 * `VITE_BASE=/elite-clinic/`. Setting that on the command line from Git Bash
 * does not work: MSYS rewrites anything that looks like a Unix path, and
 * `/elite-clinic/` came out as `/Program Files/Git/elite-clinic/` — every
 * asset URL pointed into nowhere and the page loaded blank. Doubling the
 * slashes to dodge the rewrite just produced a protocol-relative `//`. So the
 * variable is set here, in the process, where no shell can touch it.
 *
 * The publish is a throwaway git repo inside dist/ force-pushed to gh-pages:
 * the branch holds only build output and has no history worth keeping.
 */

import { execFileSync } from "node:child_process";
import { cpSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const DIST = resolve(ROOT, "dist");
const BASE = "/elite-clinic/";
const REMOTE = "https://github.com/band-agents/elite-clinic.git";
const BRANCH = "gh-pages";

const run = (cmd, args, cwd = ROOT) =>
  execFileSync(cmd, args, { cwd, stdio: "inherit", shell: process.platform === "win32" });

console.log(`\n→ building with base ${BASE}`);
execFileSync("npm", ["run", "build"], {
  cwd: ROOT,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: { ...process.env, VITE_BASE: BASE },
});

/* Pages has no rewrite rules, so a deep link like /book is a real 404.
   Serving the app shell as 404.html lets the client router pick it up — the
   status stays 404 but the page renders correctly. */
console.log("→ 404.html for client-side routes");
cpSync(resolve(DIST, "index.html"), resolve(DIST, "404.html"));

/* Without this, Pages runs the output through Jekyll, which drops any file
   or folder whose name starts with an underscore. */
writeFileSync(resolve(DIST, ".nojekyll"), "");

console.log(`→ publishing to ${BRANCH}`);
rmSync(resolve(DIST, ".git"), { recursive: true, force: true });
run("git", ["init", "-q", "-b", BRANCH], DIST);
run("git", ["add", "-A"], DIST);
run("git", ["-c", "user.name=band-agents", "-c", "user.email=band.digi.tech@gmail.com",
            "commit", "-q", "-m", "Publish build"], DIST);
run("git", ["push", "-q", "-f", REMOTE, BRANCH], DIST);
rmSync(resolve(DIST, ".git"), { recursive: true, force: true });

console.log(`\n✓ https://band-agents.github.io${BASE}`);
console.log(`  https://band-agents.github.io${BASE}prototype/elite-clinic-patient-app.html`);
console.log(`  https://band-agents.github.io${BASE}prototype/elite-clinic-app.html\n`);
console.log("If the change does not appear, Pages may not have rebuilt:");
console.log("  gh api -X POST repos/band-agents/elite-clinic/pages/builds\n");
