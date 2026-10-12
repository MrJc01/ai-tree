import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// No GitHub Pages o app fica em /ai-tree/. Em desenvolvimento e nos testes continua na raiz.
export default defineConfig({
  base: process.env.GITHUB_PAGES ? '/ai-tree/' : '/',
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/, priority: 30 },
            { name: 'flow', test: /node_modules[\\/]@xyflow[\\/]/, priority: 20 },
            { name: 'motion', test: /node_modules[\\/]framer-motion[\\/]/, priority: 20 },
          ],
        },
      },
    },
  },
})
