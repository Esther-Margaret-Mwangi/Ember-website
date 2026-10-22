import type { CatalogProduct } from '../../../catalog'

export default function InventoryTable({ inventory, onAdjust }: { inventory: CatalogProduct[]; onAdjust: (sku: string, amount: number) => void }) {
  return (
    <div className="table-scroll">
      <table className="admin-table inventory-table">
        <thead><tr><th>PRODUCT</th><th>SKU</th><th>CATEGORY</th><th>PRICE</th><th>AVAILABLE STOCK</th><th><span className="visually-hidden">Adjust stock</span></th></tr></thead>
        <tbody>{inventory.map((item) => <tr key={item.sku}><td><span className="inventory-product"><img src={item.images[0]} alt="" /><strong>{item.name}</strong></span></td><td>{item.sku}</td><td>{item.category}</td><td>${item.price.toFixed(2)}</td><td><span className={`stock-indicator ${item.stock <= 5 ? 'low' : ''} ${item.stock === 0 ? 'empty' : ''}`}><i />{item.stock === 0 ? 'Out of stock' : item.stock <= 5 ? `${item.stock} left` : `${item.stock} in stock`}</span></td><td><span className="stock-adjust"><button disabled={item.stock === 0} onClick={() => onAdjust(item.sku, -1)} aria-label={`Decrease ${item.name} stock`}>−</button><button onClick={() => onAdjust(item.sku, 1)} aria-label={`Increase ${item.name} stock`}>+</button></span></td></tr>)}</tbody>
      </table>
    </div>
  )
}
