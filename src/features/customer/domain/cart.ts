import type { CatalogProduct } from '../../catalog'

export type CartLine = {
  product: CatalogProduct
  quantity: number
  color: string
  size: string
}
