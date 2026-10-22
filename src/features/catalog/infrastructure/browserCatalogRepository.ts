import { initialCatalog, type CatalogData } from '../domain/catalog'

const databaseName = 'ember-local-catalog'
const databaseVersion = 1
const objectStoreName = 'catalog'
const catalogKey = 'current'

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, databaseVersion)
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(objectStoreName)) {
        request.result.createObjectStore(objectStoreName)
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('Could not open the Ember catalog database.'))
    request.onblocked = () => reject(new Error('The Ember catalog database is blocked by another open tab.'))
  })
}

export async function loadCatalog(): Promise<CatalogData> {
  const database = await openDatabase()
  try {
    const storedCatalog = await new Promise<CatalogData | undefined>((resolve, reject) => {
      const transaction = database.transaction(objectStoreName, 'readonly')
      const request = transaction.objectStore(objectStoreName).get(catalogKey)
      request.onsuccess = () => resolve(request.result as CatalogData | undefined)
      request.onerror = () => reject(request.error ?? new Error('Could not read the Ember catalog.'))
      transaction.onabort = () => reject(transaction.error ?? new Error('Reading the Ember catalog was interrupted.'))
    })

    if (storedCatalog) return storedCatalog
    await saveCatalog(initialCatalog)
    return initialCatalog
  } finally {
    database.close()
  }
}

export async function saveCatalog(catalog: CatalogData): Promise<void> {
  const database = await openDatabase()
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(objectStoreName, 'readwrite')
      transaction.objectStore(objectStoreName).put(catalog, catalogKey)
      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error ?? new Error('Could not save the Ember catalog.'))
      transaction.onabort = () => reject(transaction.error ?? new Error('Saving the Ember catalog was interrupted.'))
    })
  } finally {
    database.close()
  }
}
