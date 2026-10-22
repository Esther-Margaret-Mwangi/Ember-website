import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { initialCatalog } from '../domain/catalog'
import { loadCatalog, saveCatalog } from '../infrastructure/browserCatalogRepository'
import { CatalogContext } from './CatalogContext'

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [catalog, setCatalog] = useState(initialCatalog)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    loadCatalog()
      .then((loadedCatalog) => {
        if (active) setCatalog(loadedCatalog)
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : 'Could not load the local Ember catalog.')
      })
      .finally(() => {
        if (active) setReady(true)
      })
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!ready || error) return
    let active = true
    const timeout = window.setTimeout(() => {
      saveCatalog(catalog).catch((saveError: unknown) => {
        if (active) setError(saveError instanceof Error ? saveError.message : 'Could not save changes to the local Ember catalog.')
      })
    }, 150)
    return () => {
      active = false
      window.clearTimeout(timeout)
    }
  }, [catalog, error, ready])

  const value = useMemo(() => ({
    catalog,
    setCatalog,
    ready,
    error,
    clearError: () => setError(''),
  }), [catalog, ready, error])

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}
