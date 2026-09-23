/**
 * Build both versions of the site and publish them to GitHub Pages.
 *
 *   node scripts/deploy-pages.mjs
 *
 * Two deploys come out of one source. The only difference is the hero:
 * VITE_HERO_PHOTO=1 builds the one with the consultant's portrait, and
 * without it the hero is typographic. They land at
 *
 *   /elite-clinic/              — no photograph
 *   /elite-clinic/with-photo/   — with the portrait
 *
 * Each needs its own Vite base, which is why they are separate builds rather
 * than one build copied twice: the asset URLs are baked in at build time.
 *
 * VITE_BASE is set here, in-process, on purpose. Setting it on a Git Bash
 * command line does not work — MSYS rewrites anything shaped like a Unix path
 * and `/elite-clinic/` arrives as `/Program Files/Git/elite-clinic/`, which
 * points every asset into nowhere and loads a blank page with no error.
 *
 * The publish is a throwaway git repo inside the staging directory, force
 * pushed to gh-pages: the branch holds only build output.
 */

import { execFileSync } from "node:child_process";
import { cpSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const DIST = resolve(ROOT, "dist");
const REMOTE = "https://github.com/band-agents/elite-clinic.git";
const BRANCH = "gh-pages";
const WIN = process.platform === "win32";

/**
 * git is invoked WITHOUT a shell. On Windows `shell: true` re-parses the
 * argument list, which split the commit message "Publish build" into two
 * pathspecs and failed the commit. npm still needs the shell there, because
 * it resolves to npm.cmd.
 */
const run = (cmd, args, cwd = ROOT) =>
  execFileSync(cmd, args, { cwd, stdio: "inherit", shell: false });

/** Build into dist with the given base, then copy dist to `into`. */
function build({ base, photo, into }) {
  console.log(`\n→ building ${photo ? "WITH" : "without"} the portrait, base ${base}`);
  rmSync(DIST, { recursive: true, force: true });
  execFileSync("npm", ["run", "build"], {
    cwd: ROOT,
    stdio: "inherit",
    shell: WIN,
    env: { ...process.env, VITE_BASE: base, VITE_HERO_PHOTO: photo ? "1" : "" },
  });

  /* Pages has no rewrite rules, so a deep link like /book is a real 404.
     Serving the app shell as 404.html lets the client router pick it up — the
     status stays 404 but the page renders. */
  cpSync(resolve(DIST, "index.html"), resolve(DIST, "404.html"));
  cpSync(DIST, into, { recursive: true });
}

const stage = mkdtempSync(join(tmpdir(), "elite-pages-"));

build({ base: "/elite-clinic/", photo: false, into: stage });
build({ base: "/elite-clinic/with-photo/", photo: true, into: join(stage, "with-photo") });

/* Without this, Pages runs the output through Jekyll, which drops any file or
   folder whose name starts with an underscore. */
writeFileSync(join(stage, ".nojekyll"), "");

console.log(`\n→ publishing to ${BRANCH}`);
run("git", ["init", "-q", "-b", BRANCH], stage);
run("git", ["add", "-A"], stage);
run("git", ["-c", "user.name=band-agents", "-c", "user.email=band.digi.tech@gmail.com",
            "commit", "-q", "-m", "Publish build"], stage);
run("git", ["push", "-q", "-f", REMOTE, BRANCH], stage);
rmSync(stage, { recursive: true, force: true });

console.log("\n✓ https://band-agents.github.io/elite-clinic/            (no photograph)");
console.log("  https://band-agents.github.io/elite-clinic/with-photo/  (with the portrait)");
console.log("  …/prototype/elite-clinic-patient-app.html");
console.log("  …/prototype/elite-clinic-app.html\n");
console.log("If a change does not appear, Pages may not have rebuilt:");
console.log("  gh api -X POST repos/band-agents/elite-clinic/pages/builds\n");
