import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import dts from 'vite-plugin-dts';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dts({
      include: ['src/ve/**/*.ts', 'src/ve/**/*.tsx'],
      outDir: 'dist',
      tsconfigPath: './tsconfig.json',
      rollupTypes: true,
    }),
  ],
  resolve: {
    alias: {
      ve: path.resolve(__dirname, './src/ve'),
      '@ve': path.resolve(__dirname, './src/ve'),
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/ve/index.ts'),
      name: 'VE',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        '@tiptap/core',
        '@tiptap/react',
        '@tiptap/starter-kit',
        '@tiptap/extension-underline',
        '@tiptap/extension-subscript',
        '@tiptap/extension-superscript',
        '@tiptap/extension-text-style',
        '@tiptap/extension-color',
        '@tiptap/extension-highlight',
        '@tiptap/extension-font-family',
        '@tiptap/extension-text-align',
        '@tiptap/extension-task-list',
        '@tiptap/extension-task-item',
        '@tiptap/extension-link',
        '@tiptap/extension-table',
        '@tiptap/extension-table-row',
        '@tiptap/extension-table-header',
        '@tiptap/extension-table-cell',
        '@tiptap/extension-youtube',
        '@tiptap/extension-character-count',
        '@tiptap/extension-placeholder',
        '@tiptap/extension-image',
        'dompurify',
        'lucide-react',
        'motion',
      ],
    },
  },
});

