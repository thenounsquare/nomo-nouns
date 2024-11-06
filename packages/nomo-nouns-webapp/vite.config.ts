import { build, defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({})],
  resolve: {
    alias: {
      'nouns-assets-package': path.resolve(__dirname, 'src/nouns-assets-package'),
    },
    preserveSymlinks: true,
  },
  appType: "spa",
  optimizeDeps: {
    include: ['nouns-assets-package'],
    esbuildOptions: {
      target: "esnext",
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis'
      },
      supported: {
        bigint: true
      },
    }
  },
  build: {
    target: ["esnext"], // 👈 build.target
    rollupOptions: {
      external: ['nouns-assets-package'] // Add here if Rollup is externalizing it unexpectedly
    }
  }
});
