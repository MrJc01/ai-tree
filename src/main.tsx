import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/geist'
import '@fontsource-variable/geist-mono'
import '@xyflow/react/dist/style.css'
import './index.css'
import App from './App'
import { applyTheme, getStoredTheme } from './theme/theme'

// Aplica o tema antes do primeiro render para não piscar o tema errado.
applyTheme(getStoredTheme())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
