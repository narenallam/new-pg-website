import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  optimizeDeps: {
    exclude: ['pyodide', 'emscripten']
  },
  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
    fs: {
      allow: ['..']
    }
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      external: (id) => {
        // Don't bundle Pyodide or Emscripten
        return id.includes('pyodide') || id.includes('emscripten');
      }
    }
  },
  define: {
    global: 'globalThis',
  },
  worker: {
    format: 'es'
  }
});
