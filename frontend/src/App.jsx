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
import Brand from './Components/Brand'
import Becomesupplier from './Components/Becomesupplier'
import SupplierLogin from './Components/SupplierLogin'
import StartSelling from './Components/StartSelling'
import Inverster from './Components/Inverster'
import HowitWorks from './Components/HowitWorks'
import PricingCommision from './Components/PricingCommision'
import Return from './Components/Return'
import Grow from './Components/Grow'
import GST from './Components/GST'
import ProductCard from './Components/ProductCard'
import SupplierDashboard from './Components/SupplierDashboard'
import AddProduct from './Components/AddProduct'
import SupplierProducts from './Components/SupplierProducts'
import AdminPanel from './Components/AdminPanel'

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/navbar" element={<Navbar />} />
        <Route path='/Brand' element={<Brand />} />
        <Route path="/" element={<><Navbar /><ProductGrid /><Brand /><ProductCard /></>} />
        <Route path="/customer-signup" element={<CutomerSignUp />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/Becomesupplier" element={<Becomesupplier />} />
        <Route path='/SupplierLogin' element={<SupplierLogin />} />
        <Route path='/StartSelling' element={<StartSelling />} />
        <Route path='/Inverster' element={<Inverster />} />
        <Route path='/HowitWorks' element={<HowitWorks />} />
        <Route path='/PricingCommision' element={<PricingCommision />} />
        <Route path='/Return' element={<Return />} />
        <Route path='/Grow' element={<Grow />} />
        <Route path='/GST' element={<GST />} />
        <Route path='/SupplierDashboard' element={<SupplierDashboard />} />
        <Route path='/AddProduct' element={<AddProduct />} />
        <Route path='/supplier/add-product' element={<AddProduct />} />
        <Route path='/supplier/products' element={<SupplierProducts />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
