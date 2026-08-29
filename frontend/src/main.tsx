import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // <-- 1. Asegúrate de importar esto
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>  {/* <-- 2. Debe envolver a <App /> */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)