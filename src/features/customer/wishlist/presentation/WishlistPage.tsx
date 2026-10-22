import type { CatalogProduct } from '../../../catalog'
import { StorefrontIcon } from '../../../../shared/components/StorefrontIcon'

export default function WishlistPage({
  signedIn,
  products,
  onSignIn,
  onNavigate,
  onRemove,
}: {
  signedIn: boolean
  products: CatalogProduct[]
  onSignIn: () => void
  onNavigate: (destination: string) => void
  onRemove: (product: CatalogProduct) => void
}) {
  return (
    <section className="store-page">
      <div className="page-intro">
        <p className="eyebrow"><span /> YOUR SAVED PIECES</p>
        <h1>Your wishlist.</h1>
        <p>Keep the pieces you love close while you decide.</p>
      </div>
      {!signedIn ? (
        <div className="page-empty"><p>Sign in to see and save your favorite pieces.</p><button className="button button-clay" onClick={onSignIn}>Sign in to continue</button></div>
      ) : products.length ? (
        <div className="product-grid">{products.map((product) => (
          <article className="product-card" key={product.id}>
            <div className="product-image-wrap">
              <button className="product-image-button" onClick={() => onNavigate(`/product/${product.id}`)}><img src={product.images[0]} alt={product.name} /></button>
              <button className="favorite-button saved" onClick={() => onRemove(product)} aria-label={`Remove ${product.name} from wishlist`}><StorefrontIcon name="heart" size={18} filled /></button>
            </div>
            <div className="product-details"><div><p className="product-category">{product.category}</p><h3>{product.name}</h3></div><strong>${product.price}</strong></div>
          </article>
        ))}</div>
      ) : (
        <div className="page-empty"><p>Your wishlist is waiting for its first favorite.</p><a className="button button-clay" href="/shop" onClick={(event) => { event.preventDefault(); onNavigate('/shop') }}>Explore the shop</a></div>
      )}
    </section>
  )
}
