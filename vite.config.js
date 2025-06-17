// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1600, // size in KiB
  },
  server: {
    host: "0.0.0.0",
  },
  admin: {
    vite: (config) => {
      config.server.allowedHosts = ["sevran-3d.onrender.com"];
      return config;
    },
  },
});
