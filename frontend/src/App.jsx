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
import InvestorFinancials from './Components/InvestorFinancials'
import InvestorGovernance from './Components/InvestorGovernance'
import InvestorAnnouncements from './Components/InvestorAnnouncements'
import InvestorResources from './Components/InvestorResources'
import HowitWorks from './Components/HowitWorks'
import PricingCommision from './Components/PricingCommision'
import Return from './Components/Return'
import Grow from './Components/Grow'
import GST from './Components/GST'
import ProductCard from './Components/ProductCard'
import ProductDetails from './Components/ProductDetails'
import ShoppingCart from './Components/ShoppingCart'
import SupplierDashboard from './Components/SupplierDashboard'
import AddProduct from './Components/AddProduct'
import SupplierProducts from './Components/SupplierProducts'
import AdminPanel from './Components/AdminPanel'
import Wishlist from './Components/Wishlist'
import CustomerFooter from './Components/CustomerFooter'

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/navbar" element={<Navbar />} />
        <Route path='/Brand' element={<Brand />} />
        <Route path="/" element={<><Navbar /><ProductGrid /><Brand /><ProductCard /><CustomerFooter /></>} />
        <Route path="/product/:id" element={<><Navbar /><ProductDetails /><CustomerFooter /></>} />
        <Route path="/cart" element={<><ShoppingCart /><CustomerFooter /></>} />
        <Route path="/wishlist" element={<><Navbar /><Wishlist /><CustomerFooter /></>} />
        <Route path="/customer-signup" element={<CutomerSignUp />} />
        <Route path="/customer-login" element={<CutomerSignUp />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/Becomesupplier" element={<Becomesupplier />} />
        <Route path='/SupplierLogin' element={<SupplierLogin />} />
        <Route path='/StartSelling' element={<StartSelling />} />
        <Route path='/Inverster' element={<Inverster />} />
        <Route path='/investor-relations' element={<Inverster />} />
        <Route path='/investor-relations/financials' element={<InvestorFinancials />} />
        <Route path='/investor-relations/governance' element={<InvestorGovernance />} />
        <Route path='/investor-relations/announcements' element={<InvestorAnnouncements />} />
        <Route path='/investor-relations/resources' element={<InvestorResources />} />
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
