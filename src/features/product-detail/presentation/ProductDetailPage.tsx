import { useState } from 'react'
import type { CatalogProduct } from '../../catalog'
import { StorefrontIcon } from '../../../shared/components/StorefrontIcon'

export default function ProductDetailPage({
  product,
  favorite,
  onAddToCart,
  onToggleFavorite,
}: {
  product: CatalogProduct
  favorite: boolean
  onAddToCart: (size: string) => void
  onToggleFavorite: () => void
}) {
  const [imageIndex, setImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState('One size')

  return (
    <section className="store-page product-page">
      <div className="product-page-gallery">
        <div className="product-page-image"><img src={product.images[imageIndex] ?? product.images[0]} alt={product.name} /></div>
        {product.images.length > 1 && <div className="product-gallery-thumbnails">{product.images.map((image, index) => (
          <button className={imageIndex === index ? 'active' : ''} key={`${product.id}-${index}`} onClick={() => setImageIndex(index)} aria-label={`Show product image ${index + 1}`} aria-pressed={imageIndex === index}><img src={image} alt="" /></button>
        ))}</div>}
      </div>
      <div className="product-page-copy">
        <p className="eyebrow"><span /> {product.category.toUpperCase()}</p>
        <h1>{product.name}</h1>
        <strong className="product-page-price">${product.price}</strong>
        <p className="page-lead">{product.description}</p>
        <p className="product-color"><span /> {product.color}</p>
        <p className={`product-stock ${product.stock === 0 ? 'out-of-stock' : ''}`}>{product.stock ? `${product.stock} in stock` : 'Currently out of stock'}</p>
        <label className="option-label" htmlFor="detail-size">Size</label>
        <select id="detail-size" className="size-select" value={selectedSize} onChange={(event) => setSelectedSize(event.target.value)}><option>One size</option><option>Small</option><option>Medium</option><option>Large</option></select>
        <button className="button button-clay full-width" disabled={product.stock === 0} onClick={() => onAddToCart(selectedSize)}>Add to bag · ${product.price} <StorefrontIcon name="arrow" size={17} /></button>
        <button className={`button button-outline full-width ${favorite ? 'saved' : ''}`} onClick={onToggleFavorite}>{favorite ? 'Saved to wishlist' : 'Add to wishlist'}</button>
        <p className="preview-disclaimer">Preview product details. Stock availability and product options are sample data.</p>
      </div>
    </section>
  )
}
