import type { Order, OrderStatus } from '../domain/order'

export default function OrdersTable({ orders, onUpdate }: { orders: Order[]; onUpdate: (id: string, status: OrderStatus) => void }) {
  return (
    <div className="table-scroll">
      <table className="admin-table">
        <thead><tr><th>ORDER</th><th>CUSTOMER</th><th>DATE</th><th>AMOUNT</th><th>STATUS</th><th><span className="visually-hidden">Update status</span></th></tr></thead>
        <tbody>{orders.map((order) => <tr key={order.id}><td className="order-id">{order.id}</td><td>{order.customer}</td><td>{order.date}</td><td>${order.amount.toFixed(2)}</td><td><span className={`status-pill ${order.status.toLowerCase()}`}>{order.status}</span></td><td><select aria-label={`Update ${order.id} status`} value={order.status} onChange={(event) => onUpdate(order.id, event.target.value as OrderStatus)}><option>Processing</option><option>Shipped</option><option>Delivered</option></select></td></tr>)}</tbody>
      </table>
    </div>
  )
}
