import { initialCatalog, type CatalogData } from '../domain/catalog'

const databaseName = 'ember-local-catalog'
const databaseVersion = 3
const objectStoreName = 'catalog'
const catalogKey = 'current'
const metadataStoreName = 'metadata'
const seedMigrationKey = 'ember-seed-v4'

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, databaseVersion)
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(objectStoreName)) {
        request.result.createObjectStore(objectStoreName)
      }
      if (!request.result.objectStoreNames.contains(metadataStoreName)) {
        request.result.createObjectStore(metadataStoreName)
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
    const { storedCatalog, seedMigrated } = await new Promise<{ storedCatalog: CatalogData | undefined; seedMigrated: boolean }>((resolve, reject) => {
      const transaction = database.transaction([objectStoreName, metadataStoreName], 'readonly')
      const catalogRequest = transaction.objectStore(objectStoreName).get(catalogKey)
      const migrationRequest = transaction.objectStore(metadataStoreName).get(seedMigrationKey)
      let catalogResult: CatalogData | undefined
      let migrationResult = false
      let completedRequests = 0
      const finish = () => {
        completedRequests += 1
        if (completedRequests === 2) resolve({ storedCatalog: catalogResult, seedMigrated: migrationResult })
      }
      catalogRequest.onsuccess = () => {
        catalogResult = catalogRequest.result as CatalogData | undefined
        finish()
      }
      migrationRequest.onsuccess = () => {
        migrationResult = migrationRequest.result === true
        finish()
      }
      catalogRequest.onerror = () => reject(catalogRequest.error ?? new Error('Could not read the Ember catalog.'))
      migrationRequest.onerror = () => reject(migrationRequest.error ?? new Error('Could not check the catalog seed migration.'))
      transaction.onabort = () => reject(transaction.error ?? new Error('Reading the Ember catalog was interrupted.'))
    })

    if (!storedCatalog) {
      await saveCatalog(initialCatalog)
      await markSeedMigrationComplete(database)
      return initialCatalog
    }
    if (seedMigrated) return storedCatalog

    const mergedCatalog = mergeSeedCatalog(storedCatalog)
    await saveCatalog(mergedCatalog)
    await markSeedMigrationComplete(database)
    return mergedCatalog
  } finally {
    database.close()
  }
}

function mergeSeedCatalog(storedCatalog: CatalogData): CatalogData {
  const categories = [...storedCatalog.categories]
  for (const seedCategory of initialCatalog.categories) {
    if (!categories.some((category) => category.name.toLowerCase() === seedCategory.name.toLowerCase())) {
      categories.push(seedCategory)
    }
  }

  const products = [...storedCatalog.products]
  const usedIds = new Set(products.map((product) => product.id))
  let nextId = Math.max(0, ...usedIds) + 1
  for (const seedProduct of initialCatalog.products) {
    const existingProductIndex = products.findIndex((product) => product.sku === seedProduct.sku)
    if (existingProductIndex !== -1) {
      const existingProduct = products[existingProductIndex]
      if (seedProduct.sku === 'DEC-015' && existingProduct.images[0]?.includes('photo-1612196808214-b7e1d6145a8c')) {
        products[existingProductIndex] = { ...existingProduct, images: seedProduct.images }
      }
      continue
    }
    const category = categories.find((item) => item.name.toLowerCase() === seedProduct.category.toLowerCase())
    const id = usedIds.has(seedProduct.id) ? nextId++ : seedProduct.id
    usedIds.add(id)
    products.push({ ...seedProduct, id, category: category?.name ?? seedProduct.category })
  }
  return { categories, products }
}

async function markSeedMigrationComplete(database: IDBDatabase): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(metadataStoreName, 'readwrite')
    transaction.objectStore(metadataStoreName).put(true, seedMigrationKey)
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error ?? new Error('Could not save the catalog seed migration status.'))
    transaction.onabort = () => reject(transaction.error ?? new Error('Saving the catalog seed migration status was interrupted.'))
  })
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
