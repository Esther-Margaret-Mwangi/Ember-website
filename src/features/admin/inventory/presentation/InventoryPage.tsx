import type { CatalogProduct } from '../../../catalog'
import InventoryTable from './InventoryTable'

export default function InventoryPage({ inventory, lowStockCount, outOfStockCount, onAdjust }: {
  inventory: CatalogProduct[]
  lowStockCount: number
  outOfStockCount: number
  onAdjust: (sku: string, amount: number) => void
}) {
  return (
    <>
      <div className="inventory-summary"><article><span>Tracked pieces</span><strong>{inventory.length}</strong></article><article><span>Low stock</span><strong>{lowStockCount}</strong></article><article><span>Out of stock</span><strong>{outOfStockCount}</strong></article></div>
      <article className="admin-panel inventory-table-panel"><div className="panel-heading"><div><h2>Inventory overview</h2><p>Keep the pieces people love within reach.</p></div><span className="soft-tag">LOW STOCK THRESHOLD: 5</span></div><InventoryTable inventory={inventory} onAdjust={onAdjust} /></article>
    </>
  )
}
