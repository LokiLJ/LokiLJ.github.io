import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles.css'
import './v3.css'
import './special-projects.css'
import './special-projects-2.css'
import './cms.css'

if (window.location.pathname !== '/admin/setup' && /(?:access_token|refresh_token|type=invite|type=recovery)/.test(window.location.hash)) {
  window.location.replace('/admin/setup' + window.location.hash)
}


const redirect = new URLSearchParams(window.location.search).get('redirect')
if (redirect) {
  window.history.replaceState(null, '', redirect)
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
