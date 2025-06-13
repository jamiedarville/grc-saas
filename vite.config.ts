import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react({
    jsxImportSource: '@emotion/react',
    babel: {
      plugins: ['@emotion/babel-plugin']
    }
  })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/client/components'),
      '@/hooks': path.resolve(__dirname, './src/client/hooks'),
      '@/services': path.resolve(__dirname, './src/client/services'),
      '@/types': path.resolve(__dirname, './src/shared/types'),
      '@/utils': path.resolve(__dirname, './src/shared/utils')
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist/client',
    sourcemap: true
  }
})