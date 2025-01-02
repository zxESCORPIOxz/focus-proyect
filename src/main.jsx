import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes'
import GlobalProvider from './provider/GlobalProvider'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalProvider>
      
        <AppRoutes />

    </GlobalProvider>
    
  </StrictMode>,
)
