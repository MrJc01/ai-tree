import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
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
