import React from 'react'
import amit from './Images/amit.jpg'
import mallimg from './Images/mallimg.jpg'
import { IoMdStar } from 'react-icons/io'

export default function ProductCard() {
  return (
    <section className="productlisting">
      <aside className="productlistleft">
        <div className="product-filter">
          <h2 className="product-filter-heading">Filters</h2>
          <div className="leftfilter">
            <div className="listdropdown">
              <div className="subdropdownlist">
                <p className="dropdownlistpera">Sort by:</p>
                <span className="dropdownlistspan">Relevance</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
      <div className="productlistright">
        <div className="productcontainer">
          <a className="product-card-link" href="/">
            <article className="productCard">
              <div className="subproductcard">
                <picture>
                  <img src={amit} alt="Bellavita perfumes for men" />
                </picture>
              </div>
              <div className="aboutcard">
                <div className="productname">
                  <p className="productnamepera">Bellavita perfumes for men 20ml</p>
                  <img src={mallimg} width={52} height={28} alt="Mall" />
                </div>
                <div className="productdesc">
                  <h5 className="productprice">₹180</h5>
                  <p className="pricewithoutdescount">₹748</p>
                  <span className="productdescount">76% off</span>
                </div>
                <div className="product-rating">
                  <span className="rating">
                    4.3 <IoMdStar color="white" fontSize={16} />
                  </span>
                  <span className="review">267941 Reviews</span>
                </div>
              </div>
            </article>
          </a>
        </div>
      </div>
    </section>
  )
}
