import type { CatalogProduct } from '../../catalog'
import ProductGrid from './ProductGrid'
import { StorefrontIcon } from '../../../shared/components/StorefrontIcon'
import './ShopPage.css'

export default function ShopPage({
  products,
  categories,
  selectedCategory,
  onCategoryChange,
  sort,
  onSortChange,
  favorites,
  onNavigate,
  onToggleFavorite,
  onOpenProduct,
}: {
  products: CatalogProduct[]
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  sort: string
  onSortChange: (sort: string) => void
  favorites: number[]
  onNavigate: (destination: string) => void
  onToggleFavorite: (product: CatalogProduct) => void
  onOpenProduct: (product: CatalogProduct) => void
}) {
  return (
    <main className="shop-page">
      <section className="shop-hero">
        <div className="shop-hero-image" role="img" aria-label="A thoughtfully styled home with natural textures and warm, comfortable furniture" />
        <div className="shop-hero-shade" />
        <div className="shop-hero-copy">
          <p className="eyebrow light">THE EMBER SHOP · OBJECTS CHOSEN TO STAY</p>
          <h1>Thoughtful pieces,<br />for every room.</h1>
          <p>Find the small comforts, warm textures, and everyday essentials that feel like home.</p>
          <a className="button button-light" href="#shop-products" onClick={(event) => { event.preventDefault(); document.getElementById('shop-products')?.scrollIntoView({ behavior: 'smooth' }) }}>Browse all pieces <StorefrontIcon name="arrow" size={17} /></a>
        </div>
      </section>
      <section className="products-section shop-page-products" id="shop-products" aria-label="Shop all products">
        <div className="shop-controls">
          <div className="filter-list" aria-label="Filter by category">
            {['All', ...categories].map((item) => (
              <button className={selectedCategory === item ? 'filter-chip active' : 'filter-chip'} key={item} onClick={() => onCategoryChange(item)}>{item}</button>
            ))}
          </div>
          <label className="sort-select"><span>Sort</span><select value={sort} onChange={(event) => onSortChange(event.target.value)}><option>Featured</option><option>Price: low to high</option><option>Price: high to low</option></select></label>
        </div>
        {products.length ? <ProductGrid products={products} favorites={favorites} onNavigate={onNavigate} onToggleFavorite={onToggleFavorite} onOpenProduct={onOpenProduct} /> : <div className="empty-search">Nothing found just yet. Try another search or category.</div>}
      </section>
    </main>
  )
}
