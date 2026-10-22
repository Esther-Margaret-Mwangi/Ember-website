import type { CatalogProduct } from '../../catalog'
import { StorefrontIcon } from '../../../shared/components/StorefrontIcon'

export default function ProductGrid({
  products,
  favorites,
  onNavigate,
  onToggleFavorite,
  onOpenProduct,
}: {
  products: CatalogProduct[]
  favorites: number[]
  onNavigate: (destination: string) => void
  onToggleFavorite: (product: CatalogProduct) => void
  onOpenProduct: (product: CatalogProduct) => void
}) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <article className="product-card" key={product.id}>
          <div className="product-image-wrap">
            <button className="product-image-button" onClick={() => onNavigate(`/product/${product.id}`)} aria-label={`View ${product.name}`}>
              <img src={product.images[0]} alt={product.name} loading="lazy" />
            </button>
            {(product.stock === 0 || product.badge) && <span className="product-badge">{product.stock === 0 ? 'Out of stock' : product.badge}</span>}
            <button
              className={`favorite-button ${favorites.includes(product.id) ? 'saved' : ''}`}
              onClick={() => onToggleFavorite(product)}
              aria-label={favorites.includes(product.id) ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
            >
              <StorefrontIcon name="heart" size={18} filled={favorites.includes(product.id)} />
            </button>
            <button className="quick-add" disabled={product.stock === 0} onClick={() => onOpenProduct(product)}>
              {product.stock === 0 ? 'Out of stock' : 'Quick add'} <StorefrontIcon name="plus" size={15} />
            </button>
          </div>
          <div className="product-details">
            <div><p className="product-category">{product.category}</p><h3><a href={`/product/${product.id}`} onClick={(event) => { event.preventDefault(); onNavigate(`/product/${product.id}`) }}>{product.name}</a></h3></div>
            <strong>${product.price}</strong>
          </div>
          <p className="product-color"><span /> {product.color} · {product.stock ? `${product.stock} in stock` : 'Sold out'}</p>
        </article>
      ))}
    </div>
  )
}
