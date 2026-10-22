import type { CatalogProduct } from '../../catalog'
import ProductGrid from './ProductGrid'

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
      <section className="store-page page-intro shop-page-intro">
        <p className="eyebrow"><span /> THE EMBER SHOP</p>
        <h1>Thoughtful pieces, for every room.</h1>
        <p>Objects chosen to bring comfort, character, and calm to your everyday.</p>
      </section>
      <section className="products-section shop-page-products" aria-label="Shop all products">
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
