import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Login from './auth/Login.jsx'
import Register from './auth/Register.jsx'
import Forgot from './auth/Forgot.jsx'
import VerifyPending from './auth/VerifyPending.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/forgot" element={<Forgot />} />
        <Route path="/auth/verify-pending" element={<VerifyPending />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
