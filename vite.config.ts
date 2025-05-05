import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tscongPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  root: ".",
  plugins: [
    react({
      include: "**/*.tsx",
    }),
    tscongPaths(),
  ],
  resolve: {
    alias: {
      src: "/src",
    },
  },
  server: {
    port: 3000,
  },
});
