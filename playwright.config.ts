import { defineConfig, devices } from '@playwright/test'

/** Testes de ponta a ponta: o app de verdade, em um navegador de verdade, no desktop e no celular. */
export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  reporter: 'list',
  use: { baseURL: 'http://localhost:5173' },
  webServer: {
    command: 'npm run dev -- --port 5173 --strictPort',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
    { name: 'celular', use: { ...devices['Pixel 5'] } },
  ],
})
