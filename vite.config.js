import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const entryHtml = fs.existsSync(path.resolve('index.html')) ? 'index.html' : 'Index.html';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: entryHtml,
    },
  },
});
