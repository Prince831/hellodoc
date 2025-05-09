
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./"),
    },
  },
  server: {
    port: 3000,
    host: true,
    allowedHosts: [
      "localhost", 
      "a00b6544-1bc1-46dc-8c56-d76a951ad945.lovableproject.com",
      "a00b6544-1bc1-46dc-8c56-d76a951ad945.lovable.app"
    ]
  },
});
