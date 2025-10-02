import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // Ignorer node_modules et autres dossiers inutiles
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/dist/**',
        '**/build/**',
        '**/.vite/**'
      ],
      // Utiliser le polling comme fallback (optionnel)
      usePolling: false
    }
  }
});
