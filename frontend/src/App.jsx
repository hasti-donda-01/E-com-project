import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import Navbar from './Components/Navbar'
import ProductGrid from './Components/ProductGrid'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CutomerSignUp from './Components/CustomerSignUp'
import VerifyOtp from './Components/VerifyOtp'

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/navbar" element={<Navbar />} />
        <Route path="/" element={<><Navbar /><ProductGrid /></>} />
        <Route path="/customer-signup" element={<CutomerSignUp />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
