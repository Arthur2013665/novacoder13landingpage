import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: 'src/client',
  plugins: [
    react({
      // Use SWC for faster builds
      jsxRuntime: 'automatic',
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'icons': ['lucide-react'],
        }
      }
    },
    // Reduce chunk size warning limit
    chunkSizeWarningLimit: 600,
    // Use esbuild for minification (faster than terser and built-in)
    minify: 'esbuild',
    // Optimize CSS
    cssCodeSplit: true,
    // Source maps only in dev
    sourcemap: false,
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: true
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: []
  }
});
