import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: 'public', // Указываем, что корень — папка public
  plugins: [react()],
  build: {
    outDir: '../dist', // Выходная папка относительно root
  },
});
