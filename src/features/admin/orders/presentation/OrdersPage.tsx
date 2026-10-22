import type { Order, OrderStatus } from '../domain/order'
import OrdersTable from './OrdersTable'

export default function OrdersPage({ orders, onUpdate }: { orders: Order[]; onUpdate: (id: string, status: OrderStatus) => void }) {
  return <article className="admin-panel orders-panel full-table"><div className="panel-heading"><div><h2>All orders</h2><p>Follow every order from packed to at home.</p></div><span className="soft-tag">{orders.length} ORDERS</span></div><OrdersTable orders={orders} onUpdate={onUpdate} /></article>
}
