export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered'

export type Order = {
  id: string
  customer: string
  date: string
  amount: number
  status: OrderStatus
}
