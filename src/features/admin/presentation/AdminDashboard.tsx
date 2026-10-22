import { useState } from 'react'
import './AdminDashboard.css'

type AdminDashboardProps = {
  onBackToStore: () => void
}

type Order = {
  id: string
  customer: string
  date: string
  amount: number
  status: 'Processing' | 'Shipped' | 'Delivered'
}

const initialOrders: Order[] = [
  { id: '#EM-2084', customer: 'Olivia Bennett', date: 'Oct 22, 2026', amount: 184, status: 'Processing' },
  { id: '#EM-2083', customer: 'Elliot James', date: 'Oct 22, 2026', amount: 96, status: 'Shipped' },
  { id: '#EM-2082', customer: 'Maya Chen', date: 'Oct 21, 2026', amount: 242, status: 'Delivered' },
  { id: '#EM-2081', customer: 'Sofia Williams', date: 'Oct 21, 2026', amount: 58, status: 'Processing' },
]

const initialInventory = [
  { name: 'The Sunday Candle', sku: 'ATM-001', category: 'Atmosphere', stock: 8, price: 38, image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=160&q=80' },
  { name: 'Sculpted Stoneware Vase', sku: 'DEC-014', category: 'Decor', stock: 3, price: 84, image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=160&q=80' },
  { name: 'Cloud Knit Throw', sku: 'TEX-008', category: 'Textiles', stock: 0, price: 112, image: 'https://images.unsplash.com/photo-1600369671236-e74521d4b6ad?auto=format&fit=crop&w=160&q=80' },
  { name: 'Arc Table Lamp', sku: 'LGT-003', category: 'Lighting', stock: 24, price: 146, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=160&q=80' },
]

function AdminDashboard({ onBackToStore }: AdminDashboardProps) {
  const [section, setSection] = useState('Overview')
  const [orders, setOrders] = useState(initialOrders)
  const [inventory, setInventory] = useState(initialInventory)
  const [notice, setNotice] = useState('')

  const lowStock = inventory.filter((item) => item.stock <= 5)

  const updateOrder = (id: string, status: Order['status']) => {
    setOrders((current) => current.map((order) => order.id === id ? { ...order, status } : order))
    setNotice(`${id} status updated to ${status}.`)
  }

  const adjustStock = (sku: string, amount: number) => {
    setInventory((current) =>
      current.map((item) => item.sku === sku ? { ...item, stock: Math.max(0, item.stock + amount) } : item),
    )
    setNotice('Inventory preview updated.')
  }

  return (
    <main className="admin-app">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="#overview" onClick={() => setSection('Overview')}>
          <span className="admin-brand-mark">e</span>
          <span>ember<span>.</span><small>STUDIO</small></span>
        </a>
        <p className="sidebar-label">WORKSPACE</p>
        <nav className="admin-nav" aria-label="Admin navigation">
          {[
            ['Overview', '◫'],
            ['Products', '◇'],
            ['Orders', '▤'],
            ['Inventory', '▧'],
            ['Promotions', '✳'],
            ['Analytics', '↗'],
          ].map(([name, icon]) => (
            <button className={section === name ? 'active' : ''} key={name} onClick={() => setSection(name)}>
              <span className="nav-icon">{icon}</span>{name}
              {name === 'Inventory' && lowStock.length > 0 && <span className="nav-badge">{lowStock.length}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="admin-user"><span className="admin-avatar">E</span><span><strong>Ember team</strong><small>Preview access</small></span><span className="user-dots">···</span></div>
          <button className="return-store" onClick={onBackToStore}>← <span>Back to storefront</span></button>
        </div>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div className="breadcrumb">Ember Studio <span>/</span> {section}</div>
          <div className="topbar-right"><span className="preview-label"><span /> PREVIEW MODE</span><button className="topbar-avatar" aria-label="Ember team account">E</button></div>
        </header>

        <div className="admin-content">
          {notice && <button className="admin-notice" onClick={() => setNotice('')}>{notice} <span>×</span></button>}
          <div className="admin-page-heading">
            <div><p className="admin-overline">THURSDAY, OCTOBER 22, 2026</p><h1>{section === 'Overview' ? 'A good morning, team.' : section}</h1><p className="admin-subheading">{section === 'Overview' ? 'Here’s what’s happening around Ember today.' : `A little overview of your ${section.toLowerCase()} for this preview.`}</p></div>
            <button className="admin-date-button">Last 30 days <span>⌄</span></button>
          </div>

          {section === 'Overview' && (
            <>
              <div className="metric-grid">
                <article className="metric-card"><span className="metric-icon clay">↗</span><span className="metric-label">Total revenue</span><strong>$24,680</strong><small><b>+12.8%</b> vs. last month</small><div className="metric-spark spark-one"><i /><i /><i /><i /><i /><i /><i /></div></article>
                <article className="metric-card"><span className="metric-icon sage">▤</span><span className="metric-label">Orders</span><strong>186</strong><small><b>+8.2%</b> vs. last month</small><div className="metric-spark spark-two"><i /><i /><i /><i /><i /><i /><i /></div></article>
                <article className="metric-card"><span className="metric-icon sand">♧</span><span className="metric-label">Average order value</span><strong>$132.69</strong><small><b>+4.6%</b> vs. last month</small><div className="metric-spark spark-three"><i /><i /><i /><i /><i /><i /><i /></div></article>
                <article className="metric-card"><span className="metric-icon rose">♡</span><span className="metric-label">Returning customers</span><strong>38.4%</strong><small><b>+2.1%</b> vs. last month</small><div className="metric-spark spark-four"><i /><i /><i /><i /><i /><i /><i /></div></article>
              </div>

              <div className="admin-overview-grid">
                <article className="admin-panel sales-panel">
                  <div className="panel-heading"><div><h2>Sales over time</h2><p>A little look at how things are going.</p></div><button className="panel-menu" aria-label="Sales chart options">···</button></div>
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
                  <div className="panel-heading"><div><h2>Stock to keep an eye on</h2><p>A few things are running low.</p></div><button className="panel-link" onClick={() => setSection('Inventory')}>View all <span>↗</span></button></div>
                  <div className="stock-alert-list">{lowStock.slice(0, 4).map((item) => <div className="stock-alert" key={item.sku}><img src={item.image} alt="" /><span><strong>{item.name}</strong><small>{item.sku}</small></span><b className={item.stock === 0 ? 'out-stock' : ''}>{item.stock === 0 ? 'Out of stock' : `${item.stock} left`}</b></div>)}</div>
                </article>
              </div>

              <article className="admin-panel orders-panel">
                <div className="panel-heading"><div><h2>Recent orders</h2><p>The latest little parcels of joy.</p></div><button className="panel-link" onClick={() => setSection('Orders')}>All orders <span>↗</span></button></div>
                <OrdersTable orders={orders.slice(0, 4)} onUpdate={updateOrder} />
              </article>
            </>
          )}

          {section === 'Products' && (
            <article className="admin-panel inventory-table-panel">
              <div className="panel-heading"><div><h2>All pieces</h2><p>Products in your current collection preview.</p></div><button className="admin-primary-button" onClick={() => setNotice('Adding products is not connected in this preview.')}>+ Add product</button></div>
              <InventoryTable inventory={inventory} onAdjust={adjustStock} />
            </article>
          )}

          {section === 'Inventory' && (
            <>
              <div className="inventory-summary"><article><span>Tracked pieces</span><strong>{inventory.length}</strong></article><article><span>Low stock</span><strong>{lowStock.filter((item) => item.stock > 0).length}</strong></article><article><span>Out of stock</span><strong>{inventory.filter((item) => item.stock === 0).length}</strong></article></div>
              <article className="admin-panel inventory-table-panel"><div className="panel-heading"><div><h2>Inventory overview</h2><p>Keep the pieces people love within reach.</p></div><span className="soft-tag">LOW STOCK THRESHOLD: 5</span></div><InventoryTable inventory={inventory} onAdjust={adjustStock} /></article>
              <div className="reservation-note"><span>✳</span><p><strong>Inventory reservation</strong><br />A race-safe reservation system needs a shared server and atomic stock updates. This front-end preview does not reserve or decrement stock at checkout.</p></div>
            </>
          )}

          {section === 'Orders' && <article className="admin-panel orders-panel full-table"><div className="panel-heading"><div><h2>All orders</h2><p>Follow every order from packed to at home.</p></div><span className="soft-tag">4 PREVIEW ORDERS</span></div><OrdersTable orders={orders} onUpdate={updateOrder} /></article>}

          {section === 'Promotions' && (
            <div className="promo-grid">
              <article className="promo-card active-promo"><span className="promo-status">ACTIVE PREVIEW</span><span className="promo-code">AUTUMN10</span><h2>A softer landing into autumn.</h2><p>10% off the collection for a limited time.</p><div className="promo-meta"><span>Discount</span><strong>10% off</strong><span>Uses</span><strong>38 / unlimited</strong><span>Ends</span><strong>Oct 31, 2026</strong></div><button className="admin-secondary-button" onClick={() => setNotice('Promotion controls are display-only in this preview.')}>Edit promotion</button></article>
              <button className="new-promo-card" onClick={() => setNotice('Promotion creation is not connected in this preview.')}><span>+</span><strong>Create a promotion</strong><small>Share a little something with your customers.</small></button>
            </div>
          )}

          {section === 'Analytics' && (
            <div className="analytics-cards"><article className="admin-panel"><span className="metric-label">Net sales</span><strong>$24,680.00</strong><p>Up 12.8% from the previous 30 days.</p><div className="analytics-bars">{[42, 62, 48, 75, 58, 86, 64, 92, 73, 100, 82, 96].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div></article><article className="admin-panel"><span className="metric-label">Best-loved pieces</span><h2>Top sellers</h2>{initialInventory.slice(0, 3).map((item, index) => <div className="top-seller" key={item.sku}><span>0{index + 1}</span><img src={item.image} alt="" /><strong>{item.name}</strong><b>{[42, 31, 24][index]} sold</b></div>)}</article></div>
          )}

          <p className="admin-footnote">Ember Studio · Preview dashboard · Sample data only</p>
        </div>
      </section>
    </main>
  )
}

function OrdersTable({ orders, onUpdate }: { orders: Order[]; onUpdate: (id: string, status: Order['status']) => void }) {
  return (
    <div className="table-scroll">
      <table className="admin-table">
        <thead><tr><th>ORDER</th><th>CUSTOMER</th><th>DATE</th><th>AMOUNT</th><th>STATUS</th><th><span className="visually-hidden">Update status</span></th></tr></thead>
        <tbody>{orders.map((order) => <tr key={order.id}><td className="order-id">{order.id}</td><td>{order.customer}</td><td>{order.date}</td><td>${order.amount.toFixed(2)}</td><td><span className={`status-pill ${order.status.toLowerCase()}`}>{order.status}</span></td><td><select aria-label={`Update ${order.id} status`} value={order.status} onChange={(event) => onUpdate(order.id, event.target.value as Order['status'])}><option>Processing</option><option>Shipped</option><option>Delivered</option></select></td></tr>)}</tbody>
      </table>
    </div>
  )
}

function InventoryTable({ inventory, onAdjust }: { inventory: typeof initialInventory; onAdjust: (sku: string, amount: number) => void }) {
  return (
    <div className="table-scroll"><table className="admin-table inventory-table"><thead><tr><th>PRODUCT</th><th>SKU</th><th>CATEGORY</th><th>PRICE</th><th>AVAILABLE STOCK</th><th><span className="visually-hidden">Adjust stock</span></th></tr></thead><tbody>{inventory.map((item) => <tr key={item.sku}><td><span className="inventory-product"><img src={item.image} alt="" /><strong>{item.name}</strong></span></td><td>{item.sku}</td><td>{item.category}</td><td>${item.price.toFixed(2)}</td><td><span className={`stock-indicator ${item.stock <= 5 ? 'low' : ''} ${item.stock === 0 ? 'empty' : ''}`}><i />{item.stock === 0 ? 'Out of stock' : item.stock <= 5 ? `${item.stock} left` : `${item.stock} in stock`}</span></td><td><span className="stock-adjust"><button onClick={() => onAdjust(item.sku, -1)} aria-label={`Decrease ${item.name} stock`}>−</button><button onClick={() => onAdjust(item.sku, 1)} aria-label={`Increase ${item.name} stock`}>+</button></span></td></tr>)}</tbody></table></div>
  )
}

export default AdminDashboard
