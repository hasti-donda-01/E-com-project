
import { useState } from 'react';
import { BsCart2 } from 'react-icons/bs';
import { FiHeart } from 'react-icons/fi';
import { CiSearch } from 'react-icons/ci';
import meeshologo from './Images/meeshologo.svg'
import headerimg from './Images/headerimg.jpg'
import { GiReturnArrow } from 'react-icons/gi';
import { IoMdCash } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { GiPriceTag } from 'react-icons/gi';
import ProfileMenu from './ProfileMenu';

const ethnicWearCategories = [
    {
        title: 'Sarees',
        items: ['All Sarees', 'Georgette Sarees', 'Chiffon Sarees', 'Cotton Sarees', 'Net Sarees', 'Silk Sarees', 'New Collection', 'Bridal Sarees']
    },
    {
        title: 'Kurtis',
        items: ['All Kurtis', 'Anarkali Kurtis', 'Rayon Kurtis', 'Cotton Kurtis', 'Straight Kurtis', 'Long Kurtis']
    },
    {
        title: 'Kurta Sets',
        items: ['All Kurta Sets', 'Kurta Palazzo Sets', 'Kurta Pant Sets', 'Sharara Sets', 'Anarkali Kurta Sets', 'Cotton Kurta Sets']
    },
    {
        title: 'Dupatta Sets',
        items: ['All Dupatta Sets', 'Cotton Sets', 'Rayon Sets']
    },
    {
        title: 'Suits & Dress Material',
        items: ['All Dress Materials', 'Pakistani Dress Materials', 'Cotton Dress Materials', 'Patiala Dress Materials', 'Banarasi Dress Materials', 'Party Wear Dress Materials']
    },
    {
        title: 'Lehengas',
        items: ['All Lehengas', 'Shoppers Favourite', 'Trending Lehengas']
    },
    {
        title: 'Blouses',
        items: ['All Blouses', 'Shoppers Favourite', 'Trending Blouses']
    },
    {
        title: 'Gowns',
        items: ['All Gowns', 'Shoppers Favourite', 'Trending Gowns']
    },
    {
        title: 'Other Ethnic Wear',
        items: ['Ethnic Skirts & Bottomwear', 'Ethnic Jackets & Shrugs', 'Islamic Fashion', 'Petticoats', 'Blouse Pieces', 'Dupattas']
    }
];

const popularCategories = [
    {
        title: 'Featured On Meesho',
        items: ['Top Brands', 'Shimla Apples']
    },
    {
        title: 'All Popular',
        items: ['Jewellery', 'Men Fashion', 'Kids', 'Footwear', 'Beauty & Personal Care', 'Grocery', 'Electronics', 'Innerwear & Nightwear', 'Kitchen & Appliances', 'Bags & Luggage', 'Healthcare', 'Stationery & Office Supplies', 'Bike & Car', 'Furniture']
    }
];

const westernWearCategories = [
    {
        title: 'Topwear',
        items: ['All Topwear', 'Tops & Tunics', 'Dresses', 'T-shirts', 'Gowns', 'Tops & Bottom Sets', 'Shirts', 'Jumpsuits', 'New Trends']
    },
    {
        title: 'Bottom Wear',
        items: ['All Bottomwear', 'Jeans & Jeggings', 'Palazzos', 'Trousers & Pants', 'Leggings', 'Shorts & Skirts']
    },
    {
        title: 'Winterwear',
        items: ['Jackets', 'Sweatshirts', 'Sweaters', 'Capes, Shrug & Ponchos', 'Coats', 'Blazers & Waistcoats']
    },
    {
        title: 'Plus Size',
        items: ['Plus Size - Dresses & Gowns', 'Plus Size - Tops & Tees', 'Plus size - Bottomwear']
    }
];

const lingerieCategories = [
    {
        title: 'Innerwear',
        items: ['Women Bra', 'Women Panties', 'Other Innerwear']
    },
    {
        title: 'Sleepwear',
        items: ['Women Nightsuits', 'Women Nightdress', 'Other Sleepwear']
    },
    {
        title: 'Sports Wear',
        items: ['Sports Bottomwear', 'Sports Bra', 'Top & Bottom Sets']
    },
    {
        title: 'Maternity Wear',
        items: ['Kurti & Topwear', 'Feeding Bras', 'Briefs & Bottomwear']
    }
];

const menCategories = [
    {
        title: 'Top Wear',
        items: ['Summer T-Shirts', 'Shirts', 'T-Shirts Combos']
    },
    {
        title: 'Bottom Wear',
        items: ['Jeans', 'Cargos/Trousers', 'Dhotis/Lungis']
    },
    {
        title: 'Ethnic Wear',
        items: ['Kurtas', 'Kurta Sets', 'Nehru Jacket']
    },
    {
        title: 'Innerwear',
        items: ['Vests', 'Briefs', 'Boxers']
    },
    {
        title: 'Sports Wear',
        items: ['Trackpants', 'Tracksuits', 'Gym Tshirts']
    },
    {
        title: 'Night Wear',
        items: ['Pyjamas', 'Night Shorts', 'Nightshirts']
    },
    {
        title: 'Winter Wear',
        items: ['Shrugs', 'Jackets', 'Sweatshirts']
    },
    {
        title: 'Combo Store',
        items: ['Rakhi Specials', 'Shirts Combo', 'Innerwear Combo']
    },
    {
        title: 'Accessories',
        items: ['All Accessories', 'Watches', 'Wallets', 'Jewellery', 'Sunglasses & Spectacle Frames', 'Belts']
    },
    {
        title: 'Footwear',
        items: ['Men Footwear', 'Men Casual Shoes', 'Men Sports Shoes', 'Men Flip Flops and Sandals', 'Men Formal Shoes', 'Loafers']
    }
];

const kidsCategories = [
    {
        title: 'Kids Clothing',
        items: ['Girls', 'Boys', 'Babies', 'Clothing Sets', 'Frocks & Dresses', 'T-Shirt & Polos']
    },
    {
        title: 'Kids Toys',
        items: ['Toys & Games', 'Summer Picks', 'Best Sellers', 'Baby Gears']
    },
    {
        title: 'Kids Accessories',
        items: ['Bags & Backpacks', 'Kids Accessories', 'Party Items']
    },
    {
        title: 'Baby Care',
        items: ['View All', 'Baby Bedding & Accessories', 'Newborn Care', 'Diapers', 'Baby Mosquito nets', 'Baby Dry Sheets']
    }
];

const homeCategories = [
    {
        title: 'Home Decor',
        items: ['View All', 'Covers', 'Key Holders', 'Artificial Plants', 'Pooja Needs', 'Party Supplies', 'Wallpapers & Stickers', 'Showpieces & Idols', 'Clocks & Wall Decor']
    },
    {
        title: 'Kitchen & Appliances',
        items: ['View All', 'Storage & Organizers', 'Cookware', 'Kitchen Tools', 'Kitchen Appliances', 'Dinnerware', 'Glasses & Barware', 'Kitchen Linen', 'Home Appliances']
    },
    {
        title: 'Home Textiles',
        items: ['View All', 'Bedsheets', 'Curtains & Accessories', 'Doormats & Carpets', 'Pillow, Cushion & Covers', 'Blankets & Comforters']
    },
    {
        title: 'Home Improvement',
        items: ['All Home Essentials', 'Bathroom Accessories', 'Cleaning Supplies', 'Gardening', 'Home Tools', 'Insect Protection']
    },
    {
        title: 'Furniture',
        items: ['Shoe Racks', 'Study Tables', 'Collapsible Wardrobes', 'Wall Shelves', 'Home Temple', 'Hammock Swing']
    }
];

const beautyCategories = [
    {
        title: 'Makeup',
        items: ['Lipstick', 'Eye Shadow and Liner', 'Face Makeup', 'Makeup Kits & Combos', 'Hair Curlers', 'Nail Makeup', 'Brushes & Accessories', 'Hair Removal', 'Perfumes & More']
    },
    {
        title: 'Personal Care',
        items: ['View All', 'Body Lotion', 'Hair Oil & Shampoo', 'Whitening Creams', 'Straighteners & Dryers', 'Face Oil & Serum', 'Face Wash', 'Face Masks & Peels', 'Soaps & Scrubs']
    },
    {
        title: 'Healthcare',
        items: ['View All', 'Oral Care', 'Winter Healthcare', 'Ear Cleaner', 'Health Monitor & Massagers', 'Foot care', 'Sexual Wellness', 'Ayurveda & Nutrition', 'Sanitary Pads & More']
    },
    {
        title: 'Baby & Mom',
        items: ['View All', 'Baby Care Essentials', 'Mom Care']
    },
    {
        title: 'Mens Care',
        items: ['Trimmers', 'Beard Oil', 'Men Perfumes & Deodorant', 'Hair Gels, Wax & Spray', "Men's Face & Body Care", 'Budget Grooming Kits']
    }
];

const jewelleryCategories = [
    {
        title: 'Jewellery',
        items: ['All Jewellery', 'Jewellery Sets', 'Earrings', 'Mangalsutras', 'Necklaces & Chains', 'Bangles & Bracelets', 'Anklets & Nosepins', 'Kamarbandh & Maangtika']
    },
    {
        title: 'Men Accessories',
        items: ['All Accessories', 'Men Watches', 'Wallets', 'Men Jewellery', 'Sunglasses & Spectacle Frames', 'Belts']
    },
    {
        title: 'Women Accessories',
        items: ['All Accessories', 'Women Watches', 'Hair Accessories', 'Women Belts', 'Sunglasses & Spectacle Frames', 'Scarves, Stoles & Gloves']
    }
];

const bagsCategories = [
    {
        title: 'Women Footwear',
        items: ['View All', 'Heels and Sandals', 'Flats', 'Boots', 'Flipflops & Slippers', 'Bellies and Ballerinas']
    },
    {
        title: 'Men Footwear',
        items: ['View All', 'Men Casual Shoes', 'Men Sports Shoes', 'Men Flip Flops and Sandals', 'Men Formal Shoes', 'Loafers']
    },
    {
        title: 'Kids Footwear',
        items: ['View All', 'Boys Shoes', 'Girls Shoes', 'Casual Shoes', 'Flipflops & Slippers', 'Sandals']
    },
    {
        title: 'Women Bags',
        items: ['View All', 'Backpacks', 'Handbags', 'Slingbags', 'Wallets', 'Clutches']
    },
    {
        title: 'Men Bags',
        items: ['Backpacks', 'Waist Bags', 'Crossbody Bags & Sling Bags']
    },
    {
        title: 'Travel Bags, Luggage and Accessories',
        items: ['View All', 'Duffel & Trolley Bags', 'Laptop & Messenger Bags']
    }
];

const electronicsCategories = [
    {
        title: 'Audio & Mobiles',
        items: ['Neckband', 'Speakers', 'Cases & Covers', 'Bluetooth Earbuds', 'Wired Earphone']
    },
    {
        title: 'Accessories',
        items: ['Mobile Holders', 'Mobile Chargers & Cables', 'Power Banks', 'Microphone', 'Selfie Stick & Ringlight', 'Tripod & Monopod', 'Extension Cord', 'Screen Expanders & Magnifiers', 'View All']
    }
];

const watchCategories = [
    {
        title: 'Watches',
        items: ['Analog Watches', 'Digital Watches', 'Sport Watches', 'Couple Watch', 'Bands & Boxes', 'View All']
    }
];

const sportsCategories = [
    {
        title: 'Fitness',
        items: ['View All', 'Sweat Belts', 'Exercise Bands', 'Tummy Trimmers', 'Skipping Ropes', 'Hand Grip Strengthener', 'Yoga', 'Fitness Accessories', 'Fitness Gears']
    },
    {
        title: 'Sports',
        items: ['Cricket', 'Cycles & Accessories', 'Skating', 'Football', 'Badminton', 'Volleyball', 'Fishing', 'Swimming', 'View All']
    }
];

const motorbikeCategories = [
    {
        title: 'Bike & Scooty Accessories',
        items: ['Bike LED Lights', 'Bike Covers', 'Bike Accessories', 'Safety Gear & Clothing', 'Helmets', 'Scooty & Activa Accessories']
    },
    {
        title: 'Car Accessories',
        items: ['Interior Accessories', 'Car Care & Cleaning', 'Car Repair Assistance', 'Car Mobile & Holders', 'Car Covers', 'Car Exterior Accessories']
    }
];

const officeCategories = [
    {
        title: 'Office Supplies & Stationery',
        items: ['View All', 'Pens & Pencils', 'Diaries & Notebooks', 'Art & Craft Supplies', 'Files & Desks Organizers', 'Adhesives & Tapes']
    }
];

const groceryCategories = [
    {
        title: 'Food & Drinks',
        items: ['Dry Fruits', 'Masala and spices', 'Snacks and Namkeens', 'Pickles', 'Chocolates & Candies', 'Biscuit and cookies', 'Coffee', 'Tea', 'View All']
    }
];

const bookCategories = [
    {
        title: 'Fiction & Non Fiction',
        items: ["Children's Books", 'Motivational Books', 'Novels', 'Religious Books', 'Economics & Commerce', 'View All Books']
    },
    {
        title: 'Academic Books',
        items: ['UPSC & Central Exam Preparation', 'Competitive Exams Preparation', 'Reference Books', 'School Textbooks & Guides', 'University Books & Guides', 'All Academic Books']
    }
];

const musicalCategories = [
    {
        title: 'Musical Instruments',
        items: ['Dholaks & Drum sets', 'Piano & Keyboard', 'String Instruments', 'Wind Instruments', 'Musical Accessories', 'All Musical Instruments']
    }
];

const petCategories = [
    {
        title: 'Pet Supplies',
        items: ['Collars & Leashes', 'Clothes & Grooming', 'Food & Treats', 'Aquarium Accessories', 'Pet Toys', 'Pet Bowls']
    }
];

const categoryMenus = {
    popular: popularCategories,
    ethnic: ethnicWearCategories,
    western: westernWearCategories,
    lingerie: lingerieCategories,
    men: menCategories,
    kids: kidsCategories,
    home: homeCategories,
    beauty: beautyCategories,
    jewellery: jewelleryCategories,
    bags: bagsCategories,
    electronics: electronicsCategories,
    watches: watchCategories,
    sports: sportsCategories,
    motorbike: motorbikeCategories,
    office: officeCategories,
    grocery: groceryCategories,
    books: bookCategories,
    musical: musicalCategories,
    pets: petCategories
};

export default function Navbar() {
    const [activeCategoryMenu, setActiveCategoryMenu] = useState('');
    let navigate = useNavigate();
    const supplier = () => {
        navigate('/Becomesupplier');
    }
    const Inverster = () => {
        navigate('/Inverster')
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
                        <span onClick={supplier} className="sc-dOfePm kBqyGz Header__StyledCaption-sc-1qdannb-3 jfvbxc hover header-right">
                            Become a Supplier
                        </span>
                    </div>

                    <div className="sc-jXuTBK Header__StyledDivider-sc-1qdannb-1 gAjuKk sNGCt" />

                    {/* Investor Relations */}
                    <div className="sc-kFkjun dkFjew TabWrapper-sc-1edf3ww-0 fOtBsk" onClick={Inverster}>
                        <span className="sc-dOfePm kBqyGz Header__StyledCaption-sc-1qdannb-3 jfvbxc hover header-right">
                            Investor Relations
                        </span>
                    </div>

                    <div className="sc-jXuTBK Header__StyledDivider-sc-1qdannb-1 gAjuKk sNGCt" />

                    {/* Profile */}
                    <div className="sc-kFkjun ghANen TabWrapper-sc-1edf3ww-0 Header__StyledProfileMenu-sc-1qdannb-2 jtaRdY fRxfrv">
                        <ProfileMenu />
                    </div>

                    <button type="button" className="cart-nav-button wishlist-nav-button" onClick={() => navigate('/wishlist')}>
                        <div className="sc-kFkjun cEGPDc TabWrapper-sc-1edf3ww-0 jtaRdY">
                            <FiHeart aria-hidden="true" />
                            <span className="sc-dOfePm kBqyGz hover header-right">Wishlist</span>
                        </div>
                    </button>

                    {/* Cart */}
                    <button type="button" className="cart-nav-button" onClick={() => navigate('/cart')}>
                        <div className="sc-kFkjun cEGPDc TabWrapper-sc-1edf3ww-0 jtaRdY">
                            <BsCart2 height={25} width={25} color='#222' />

                            <span className="sc-dOfePm kBqyGz hover header-right">
                                Cart
                            </span>
                        </div>
                    </button>
                </div>
            </div>

            <div
                className="category-nav-shell"
                onMouseLeave={() => setActiveCategoryMenu('')}
                onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) {
                        setActiveCategoryMenu('');
                    }
                }}
                onKeyDown={(event) => {
                    if (event.key === 'Escape') setActiveCategoryMenu('');
                }}
            >
                <nav className="category-navbar" aria-label="Product categories">
                    {[
                        { label: 'Popular', menu: 'popular' },
                        { label: 'Kurti, Saree & Lehenga', menu: 'ethnic' },
                        { label: 'Women Western', menu: 'western' },
                        { label: 'Lingerie', menu: 'lingerie' },
                        { label: 'Men', menu: 'men' },
                        { label: 'Kids & Toys', menu: 'kids' },
                        { label: 'Home & Kitchen', menu: 'home' },
                        { label: 'Beauty & Health', menu: 'beauty' },
                        { label: 'Jewellery & Accessories', menu: 'jewellery' },
                        { label: 'Bags & Footwear', menu: 'bags' },
                        { label: 'Electronics', menu: 'electronics' },
                        { label: 'Watches', menu: 'watches' },
                        { label: 'Sports & Fitness', menu: 'sports' },
                        { label: 'Car & Motorbike', menu: 'motorbike' },
                        { label: 'Office Supplies & Stationery', menu: 'office' },
                        { label: 'Grocery', menu: 'grocery' },
                        { label: 'Books', menu: 'books' },
                        { label: 'Pet Supplies', menu: 'pets' },
                        { label: 'Musical Instruments', menu: 'musical' }
                    ].map(({ label, menu }) => (
                        <button
                            type="button"
                            key={menu}
                            className={`header-category-item${activeCategoryMenu === menu ? ' is-active' : ''}`}
                            aria-expanded={activeCategoryMenu === menu}
                            aria-controls="category-mega-menu"
                            onMouseEnter={() => setActiveCategoryMenu(menu)}
                            onFocus={() => setActiveCategoryMenu(menu)}
                            onClick={() => setActiveCategoryMenu(menu)}
                        >
                            {label}
                        </button>
                    ))}
                </nav>
                <div
                    className={`category-mega-menu${activeCategoryMenu ? ` menu-${activeCategoryMenu} is-open` : ''}`}
                    id="category-mega-menu"
                    aria-hidden={!activeCategoryMenu}
                >
                    {activeCategoryMenu && categoryMenus[activeCategoryMenu]?.map((category) => (
                            <section className="category-mega-column" key={category.title}>
                                <h2>
                                    <a href={`/?search=${encodeURIComponent(category.title)}#products-catalog`}>
                                        {category.title}
                                    </a>
                                </h2>
                                {category.items.map((item) => (
                                    <a
                                        href={`/?search=${encodeURIComponent(
                                            /^view all$/i.test(item) ? category.title : item
                                        )}#products-catalog`}
                                        key={item}
                                    >
                                        {item}
                                    </a>
                                ))}
                            </section>
                        ))}
                </div>
            </div>
            <div>

                <img src={headerimg} alt="header-img" style={{ width: '99vw' }} />
            </div>

            <section className='feature'>

                <div className='feature-item'>

                    <div className="items">
                            <GiReturnArrow  color="rgb(159, 32, 137)"/>
                            <span className='items-name'>7 Days Easy Return</span> 
                    </div>
                     <div className="items">
                            <IoMdCash color="rgb(159, 32, 137)"  />
                            <span className='items-name'>Cash on Delivery</span> 
                    </div>
                     <div className="items">
                            <GiPriceTag color="rgb(159, 32, 137)" />
                            <span className='items-name'>Lowest Prices</span> 
                    </div>
                </div>
            </section>
        </div>


    );
}