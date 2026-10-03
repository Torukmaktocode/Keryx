import { createRoot } from 'react-dom/client'
import '@keryx/ui/tokens.css'
import './styles.css'
import App from './App'

const container = document.getElementById('root')
if (container) {
  createRoot(container).render(<App />)
}
