import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import dts from 'vite-plugin-dts';
import path from 'path';

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    tailwindcss(),
    command === 'build'
      ? dts({
          include: ['src/ve/**/*.ts', 'src/ve/**/*.tsx'],
          exclude: ['src/ve/**/*.css'],
          outDir: 'dist',
          tsconfigPath: './tsconfig.json',
          rollupTypes: true,
        })
      : null,
  ].filter(Boolean),
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
    cssCodeSplit: false,
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        /^@tiptap\//,
        'lucide-react',
        'dompurify',
      ],
      output: {
        banner: `import './styles.css';\n`,
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'styles.css';
          }
          return assetInfo.name || 'asset[extname]';
        },
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
}));
