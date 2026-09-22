import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  /**
   * Root by default, so a deploy to its own domain just works.
   *
   * GitHub Pages serves this repo from a sub-path, so that build sets
   * `VITE_BASE=/elite-clinic/` — without it every asset URL points at the
   * domain root and the page loads blank.
   */
  base: process.env.VITE_BASE ?? "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: { port: 5195 },
});
