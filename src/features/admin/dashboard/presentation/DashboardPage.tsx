import type { CatalogProduct } from '../../../catalog'
import { OrdersTable, type Order, type OrderStatus } from '../../orders'

export default function DashboardPage({
  lowStock,
  orders,
  onDownloadSales,
  onNavigate,
  onUpdateOrder,
}: {
  lowStock: CatalogProduct[]
  orders: Order[]
  onDownloadSales: () => void
  onNavigate: (section: string) => void
  onUpdateOrder: (id: string, status: OrderStatus) => void
}) {
  return (
    <>
      <div className="metric-grid">
        <article className="metric-card"><span className="metric-icon clay">↗</span><span className="metric-label">Total revenue</span><strong>$24,680</strong><small><b>+12.8%</b> vs. last month</small><div className="metric-spark spark-one"><i /><i /><i /><i /><i /><i /><i /></div></article>
        <article className="metric-card"><span className="metric-icon sage">▤</span><span className="metric-label">Orders</span><strong>186</strong><small><b>+8.2%</b> vs. last month</small><div className="metric-spark spark-two"><i /><i /><i /><i /><i /><i /><i /></div></article>
        <article className="metric-card"><span className="metric-icon sand">♧</span><span className="metric-label">Average order value</span><strong>$132.69</strong><small><b>+4.6%</b> vs. last month</small><div className="metric-spark spark-three"><i /><i /><i /><i /><i /><i /><i /></div></article>
        <article className="metric-card"><span className="metric-icon rose">♡</span><span className="metric-label">Returning customers</span><strong>38.4%</strong><small><b>+2.1%</b> vs. last month</small><div className="metric-spark spark-four"><i /><i /><i /><i /><i /><i /><i /></div></article>
      </div>
      <div className="admin-overview-grid">
        <article className="admin-panel sales-panel">
          <div className="panel-heading"><div><h2>Sales over time</h2><p>A little look at how things are going.</p></div><button className="panel-menu" aria-label="Download sales summary" onClick={onDownloadSales}>↓</button></div>
          <div className="sales-total"><strong>$24,680.00</strong><span>↑ 12.8%</span><small>compared to previous period</small></div>
          <div className="chart-wrap" role="img" aria-label="Sales chart trending upward over the last seven months">
            <div className="chart-y-axis"><span>$8k</span><span>$6k</span><span>$4k</span><span>$2k</span><span>$0</span></div>
            <svg className="sales-chart" viewBox="0 0 700 190" preserveAspectRatio="none" aria-hidden="true">
              <defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#a45e3d" stopOpacity=".2" /><stop offset="1" stopColor="#a45e3d" stopOpacity="0" /></linearGradient></defs>
              {[25, 62, 99, 136, 173].map((y) => <line key={y} x1="0" x2="700" y1={y} y2={y} stroke="#eee9e1" strokeDasharray="4 5" />)}
              <path d="M0 150 C40 140 48 125 92 132 S146 113 188 117 S237 83 280 96 S330 109 373 82 S424 89 465 63 S516 78 560 54 S611 48 652 30 S682 37 700 18 V190 H0Z" fill="url(#chartFill)" />
              <path d="M0 150 C40 140 48 125 92 132 S146 113 188 117 S237 83 280 96 S330 109 373 82 S424 89 465 63 S516 78 560 54 S611 48 652 30 S682 37 700 18" fill="none" stroke="#a45e3d" strokeWidth="3" vectorEffect="non-scaling-stroke" />
            </svg>
            <div className="chart-x-axis"><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span></div>
          </div>
        </article>
        <article className="admin-panel inventory-panel">
          <div className="panel-heading"><div><h2>Stock to keep an eye on</h2><p>A few things are running low.</p></div><button className="panel-link" onClick={() => onNavigate('Inventory')}>View all <span>↗</span></button></div>
          <div className="stock-alert-list">{lowStock.slice(0, 4).map((item) => <div className="stock-alert" key={item.sku}><img src={item.images[0]} alt="" /><span><strong>{item.name}</strong><small>{item.sku}</small></span><b className={item.stock === 0 ? 'out-stock' : ''}>{item.stock === 0 ? 'Out of stock' : `${item.stock} left`}</b></div>)}</div>
        </article>
      </div>
      <article className="admin-panel orders-panel"><div className="panel-heading"><div><h2>Recent orders</h2><p>The latest little parcels of joy.</p></div><button className="panel-link" onClick={() => onNavigate('Orders')}>All orders <span>↗</span></button></div><OrdersTable orders={orders.slice(0, 4)} onUpdate={onUpdateOrder} /></article>
    </>
  )
}
