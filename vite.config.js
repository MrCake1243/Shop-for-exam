import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  
  // Для GitHub Pages
  base: '/Shop-for-exam/', // Замените на имя вашего репозитория на GitHub
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  
  // Оптимизация сборки
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        // Группировка файлов
        manualChunks: {
          'vendor': ['vue', 'pinia', 'vue-router'],
          'ui': []
        }
      }
    }
  },
  
  server: {
    port: 3000,
    open: true
  }
})
