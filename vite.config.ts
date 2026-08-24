import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // optional but common shorthand
    },
  },
  server: {
    // Matches the OIDC client Root URL and initialEnvironment.baseUrl in the README.
    port: 3000,
  },
  build: {
    outDir: "build",
  },
  base: `./`,
});
