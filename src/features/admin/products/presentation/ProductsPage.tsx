import type { CatalogProduct } from '../../../catalog'
import ProductTable from './ProductTable'

export default function ProductsPage({
  products,
  onAdd,
  onEdit,
  onTogglePublished,
  onRemove,
}: {
  products: CatalogProduct[]
  onAdd: () => void
  onEdit: (product: CatalogProduct) => void
  onTogglePublished: (productId: number) => void
  onRemove: (product: CatalogProduct) => void
}) {
  return (
    <article className="admin-panel inventory-table-panel">
      <div className="panel-heading"><div><h2>All pieces</h2><p>Products in your current collection.</p></div><button className="admin-primary-button" onClick={onAdd}>+ Add product</button></div>
      <ProductTable products={products} onEdit={onEdit} onTogglePublished={onTogglePublished} onRemove={onRemove} />
    </article>
  )
}
