
import React from 'react';
import { BsCart, BsCart2 } from 'react-icons/bs';
import { CiSearch } from 'react-icons/ci';
import meeshologo from './Images/meeshologo.svg'
import headerimg from './Images/headerimg.jpg'
import { CgProfile } from 'react-icons/cg';
import { GiReturnArrow } from 'react-icons/gi';
import { IoMdCash } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
export default function Navbar() {

    let navigate = useNavigate();
    const signupbtn = () => {
        navigate('/customer-signup');
    }
    return (
        <div className="sc-VHjGu DesktopHeader__ContainerStyled-sc-r0p6o1-0 bCjyid ggRIXx">
            <div className="S_HeaderDesk-sc-1ha87h2-0 jZsrxH" style={{ paddingLeft: "64px", paddingRight: "64px" }}>

                {/* Logo */}
                <div className="header-logo-container">
                    <img src={meeshologo} alt="logo" />
                </div>
                <div className="DesktopSearchStyled-sc-ap5mq9-0 hCAgBX search-component">
                    <div className="sc-jMUKdB ccqFBY SearchInput__TextSearchStyled-sc-jwhbpx-0 jKpGtT">

                        <div className="sc-kMXgdA eByzkT">
                            <CiSearch fontSize={20} />

                        </div>

                        <input
                            type="text"
                            placeholder="Try Saree, Kurti or Search by Product Code"
                            className="sc-dOfePm kBqyGz sc-buNqiq egrFLn search-input-elm"
                        />
                    </div>
                </div>

                {/* Right Section */}
                <div
                    className="sc-kFkjun ghANen Header__RightSection-sc-1qdannb-0 hhjbEx"
                    color="white"
                >
                    {/* Supplier */}
                    <div className="sc-kFkjun dkFjew TabWrapper-sc-1edf3ww-0 fOtBsk">
                        <span className="sc-dOfePm kBqyGz Header__StyledCaption-sc-1qdannb-3 jfvbxc hover header-right">
                            Become a Supplier
                        </span>
                    </div>

                    <div className="sc-jXuTBK Header__StyledDivider-sc-1qdannb-1 gAjuKk sNGCt" />

                    {/* Investor Relations */}
                    <div className="sc-kFkjun dkFjew TabWrapper-sc-1edf3ww-0 fOtBsk">
                        <span className="sc-dOfePm kBqyGz Header__StyledCaption-sc-1qdannb-3 jfvbxc hover header-right">
                            Investor Relations
                        </span>
                    </div>

                    <div className="sc-jXuTBK Header__StyledDivider-sc-1qdannb-1 gAjuKk sNGCt" />

                    {/* Profile */}
                    <div className="sc-kFkjun ghANen TabWrapper-sc-1edf3ww-0 Header__StyledProfileMenu-sc-1qdannb-2 jtaRdY fRxfrv profile">
                        <CgProfile height={25} width={25} color='#222' />

                        <span className="sc-dOfePm kBqyGz hover header-right profile">
                            Profile
                        </span>
                        <div className='profile-dropdown'>
                            <h5>Hello User</h5>
                            <button className='signupbtn' onClick={signupbtn}>Sign Up</button>
                        </div>
                    </div>

                    {/* Cart */}
                    <a href="/auth?redirect=https%3A%2F%2Fwww.meesho.com%2Fmcheckout%2Fcart&amp;source=cart-icon&amp;screen=HP">
                        <div className="sc-kFkjun cEGPDc TabWrapper-sc-1edf3ww-0 jtaRdY">
                            <BsCart2 height={25} width={25} color='#222' />

                            <span className="sc-dOfePm kBqyGz hover header-right">
                                Cart
                            </span>
                        </div>
                    </a>
                </div>
            </div>

            <div className="category-navbar" >
                <a href="#" className='header-category-item popular'>Popular


                    <div className='white-box'>
                        hello
                    </div>
                </a>
                <a href="#" className='header-category-item'>Kurti, Saree & Lehenga</a>
                <a href="#" className='header-category-item'>Women Western</a>
                <a href="#" className='header-category-item'>Lingerie</a>
                <a href="#" className='header-category-item'>Men</a>
                <a href="#" className='header-category-item'>Kids & Toys</a>
                <a href="#" className='header-category-item'>Home & Kitchen</a>
                <a href="#" className='header-category-item'>Beauty & Health</a>
                <a href="#" className='header-category-item'>Jewellery & Accessories</a>
                <a href="#" className='header-category-item'>Bags & Footwear</a>
                <a href="#" className='header-category-item'>Electronics</a>
                <a href="#" className='header-category-item'>Watches</a>
                <a href="#" className='header-category-item'>Sports & Fitness</a>
                <a href="#" className='header-category-item'>Car & Motorbike</a>
                <a href="#" className='header-category-item'>Office Supplies & Stationery</a>
                <a href="#" className='header-category-item'>Grocery</a>
                <a href="#" className='header-category-item'>Books</a>
                <a href="#" className='header-category-item'>Pet Supplies</a>
                <a href="#" className='header-category-item'>Musical Instruments</a>

            </div>
            <div>

                <img src={headerimg} alt="header-img" style={{ width: '99vw' }} />
            </div>

            <section className='feature'>

                <div className='feature-item'>

                    <div className="items">
                            <GiReturnArrow />
                            <span className='items-name'>7 Days Easy Return</span> 
                    </div>
                     <div className="items">
                            <IoMdCash  />
                            <span className='items-name'>Cash on Delivery</span> 
                    </div>
                     <div className="items">
                            <GiReturnArrow />
                            <span className='items-name'>Lowest Prices</span> 
                    </div>
                </div>
            </section>
        </div>


    );
}