// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1600, // size in KiB
  },
  server: {
    host: "0.0.0.0",
  },
});
