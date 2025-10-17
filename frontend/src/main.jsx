import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { UserProvider } from './components/UserContext.jsx'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <BrowserRouter>
      <App />
      </BrowserRouter>
    </UserProvider>
  </StrictMode>,
)
