import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Ensure single React instance to prevent useLayoutEffect errors
    dedupe: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React and React-Three must be in the same chunk to prevent hook errors
          if (id.includes('node_modules/react') || 
              id.includes('node_modules/react-dom') || 
              id.includes('node_modules/react-router') ||
              id.includes('node_modules/@react-three') ||
              id.includes('node_modules/scheduler')) {
            return 'react-vendor';
          }
          
          // Three.js core (separate from React bindings)
          if (id.includes('node_modules/three')) {
            return 'three-vendor';
          }
          
          // Supabase
          if (id.includes('node_modules/@supabase')) {
            return 'supabase-vendor';
          }
          
          // Form libraries
          if (id.includes('node_modules/react-hook-form') || 
              id.includes('node_modules/@hookform') || 
              id.includes('node_modules/zod')) {
            return 'form-vendor';
          }
          
          // State management
          if (id.includes('node_modules/zustand')) {
            return 'store-vendor';
          }
          
          // Other node_modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase limit to 1000kb
  },
})
