import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  cacheDir: "/tmp/xmax-vite-cache",
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  server: {
    host: "0.0.0.0",
    port: 5174,
    proxy: {
      "/api": { target: "http://localhost:1337", changeOrigin: true },
      "/uploads": { target: "http://localhost:1337", changeOrigin: true },
      "/admin": { target: "http://localhost:1337", changeOrigin: true },
      "/content-manager": { target: "http://localhost:1337", changeOrigin: true },
      "/i18n": { target: "http://localhost:1337", changeOrigin: true },
    },
  },
  base: "./",
  build: { outDir: "dist", emptyOutDir: true },
});
