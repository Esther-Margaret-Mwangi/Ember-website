import type { CatalogProduct } from '../../../catalog'

export default function AnalyticsPage({ products }: { products: CatalogProduct[] }) {
  return (
    <div className="analytics-cards">
      <article className="admin-panel"><span className="metric-label">Net sales</span><strong>$24,680.00</strong><p>Up 12.8% from the previous 30 days.</p><div className="analytics-bars">{[42, 62, 48, 75, 58, 86, 64, 92, 73, 100, 82, 96].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div></article>
      <article className="admin-panel"><span className="metric-label">Best-loved pieces</span><h2>Top sellers</h2>{products.slice(0, 3).map((item, index) => <div className="top-seller" key={item.sku}><span>0{index + 1}</span><img src={item.images[0]} alt="" /><strong>{item.name}</strong><b>{[42, 31, 24][index]} sold</b></div>)}</article>
    </div>
  )
}
