import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: true, // Listen on all available network interfaces
    port: 8080,
    strictPort: true, // Don't try other ports if 8080 is taken
    cors: true, // Enable CORS for all origins
    hmr: {
      clientPort: 443, // Use 443 for secure WebSocket connections
      host: 'localhost'
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));