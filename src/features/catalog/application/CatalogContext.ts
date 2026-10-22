import { createContext, type Dispatch, type SetStateAction } from 'react'
import type { CatalogData } from '../domain/catalog'

export type CatalogContextValue = {
  catalog: CatalogData
  setCatalog: Dispatch<SetStateAction<CatalogData>>
  ready: boolean
  error: string
  clearError: () => void
}

export const CatalogContext = createContext<CatalogContextValue | null>(null)
