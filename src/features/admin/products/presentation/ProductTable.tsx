import type { CatalogProduct } from '../../../catalog'

export default function ProductTable({
  products,
  onEdit,
  onTogglePublished,
  onRemove,
}: {
  products: CatalogProduct[]
  onEdit: (product: CatalogProduct) => void
  onTogglePublished: (productId: number) => void
  onRemove: (product: CatalogProduct) => void
}) {
  return (
    <div className="table-scroll">
      <table className="admin-table product-admin-table">
        <thead><tr><th>PRODUCT</th><th>SKU</th><th>CATEGORY</th><th>PRICE</th><th>STOCK</th><th>STOREFRONT</th><th>ACTIONS</th></tr></thead>
        <tbody>{products.map((product) => (
          <tr key={product.id}>
            <td><span className="inventory-product"><img src={product.images[0]} alt="" /><strong>{product.name}</strong></span></td>
            <td>{product.sku}</td><td>{product.category}</td><td>${product.price.toFixed(2)}</td>
            <td><span className={`stock-indicator ${product.stock <= 5 ? 'low' : ''} ${product.stock === 0 ? 'empty' : ''}`}><i />{product.stock ? `${product.stock} left` : 'Out of stock'}</span></td>
            <td><span className={`publish-status ${product.published ? 'published' : 'draft'}`}>{product.published ? 'Published' : 'Hidden'}</span></td>
            <td><span className="product-row-actions"><button onClick={() => onEdit(product)}>Edit</button><button onClick={() => onTogglePublished(product.id)}>{product.published ? 'Hide' : 'Publish'}</button><button onClick={() => {
              if (window.confirm(`Remove ${product.name} from the catalog?`)) onRemove(product)
            }}>Remove</button></span></td>
          </tr>
        ))}{products.length === 0 && <tr><td colSpan={7} className="empty-table-message">No products yet. Add a piece to start your catalog.</td></tr>}</tbody>
      </table>
    </div>
  )
}
