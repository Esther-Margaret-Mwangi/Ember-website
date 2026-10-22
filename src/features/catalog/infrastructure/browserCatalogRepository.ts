import { initialCatalog, type CatalogData } from '../domain/catalog'

const databaseName = 'ember-local-catalog'
const databaseVersion = 3
const objectStoreName = 'catalog'
const catalogKey = 'current'
const metadataStoreName = 'metadata'
const seedMigrationKey = 'ember-seed-v5'
const previousSeedCategoryImageIds: Record<string, string> = {
  lighting: 'photo-1507473885765-e6ed057f782c',
  textiles: 'photo-1600369671236-e74521d4b6ad',
  decor: 'photo-1578500494198-246f612d3b3d',
  atmosphere: 'photo-1603006905003-be475563bc59',
  tableware: 'photo-1490312278390-ab64016e0aa9',
  rugs: 'photo-1600210492486-724fe5c67fb0',
  'wall-art': 'photo-1577083552431-6e5fd01aa342',
  furniture: 'photo-1616486338812-3dadae4b4ace',
  planters: 'photo-1485955900006-10f4d324d411',
  mirrors: 'photo-1618221195710-dd6b41faaea6',
  storage: 'photo-1595428774223-ef52624120d2',
  bedding: 'photo-1631049307264-da0ec9d70304',
}
const previousSeedProductImageIds: Record<string, string[]> = {
  'ATM-001': ['photo-1603006905003-be475563bc59'],
  'DEC-014': ['photo-1578500494198-246f612d3b3d'],
  'TEX-008': ['photo-1600369671236-e74521d4b6ad'],
  'LGT-003': ['photo-1507473885765-e6ed057f782c'],
  'DEC-015': ['photo-1578500494198-246f612d3b3d', 'photo-1612196808214-b7e1d6145a8c'],
  'TEX-009': ['photo-1584100936595-c0654b55a2e2'],
  'ATM-002': ['photo-1602874801007-bd458bb1b8b6'],
  'DEC-016': ['photo-1610701596007-11502861dcfa'],
  'TAB-001': ['photo-1490312278390-ab64016e0aa9'],
  'RUG-001': ['photo-1600210492486-724fe5c67fb0'],
  'ART-001': ['photo-1577083552431-6e5fd01aa342'],
  'FUR-001': ['photo-1616486338812-3dadae4b4ace'],
  'PLT-001': ['photo-1485955900006-10f4d324d411'],
  'MIR-001': ['photo-1618221195710-dd6b41faaea6'],
  'STO-001': ['photo-1595428774223-ef52624120d2'],
  'BED-001': ['photo-1631049307264-da0ec9d70304'],
  'LGT-004': ['photo-1507473885765-e6ed057f782c'],
  'TEX-010': ['photo-1600369671236-e74521d4b6ad'],
  'DEC-017': ['photo-1578500494198-246f612d3b3d'],
  'ATM-003': ['photo-1602874801007-bd458bb1b8b6'],
  'TAB-002': ['photo-1490312278390-ab64016e0aa9'],
  'RUG-002': ['photo-1600210492486-724fe5c67fb0'],
  'PLT-002': ['photo-1485955900006-10f4d324d411'],
  'BED-002': ['photo-1631049307264-da0ec9d70304'],
}

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
    const existingCategoryIndex = categories.findIndex(
      (category) => category.id === seedCategory.id || category.name.toLowerCase() === seedCategory.name.toLowerCase(),
    )
    if (existingCategoryIndex === -1) {
      categories.push(seedCategory)
      continue
    }
    const existingCategory = categories[existingCategoryIndex]
    const previousImageId = previousSeedCategoryImageIds[seedCategory.id]
    if (previousImageId && existingCategory.image.includes(previousImageId)) {
      categories[existingCategoryIndex] = { ...existingCategory, image: seedCategory.image }
    }
  }

  const products = [...storedCatalog.products]
  const usedIds = new Set(products.map((product) => product.id))
  let nextId = Math.max(0, ...usedIds) + 1
  for (const seedProduct of initialCatalog.products) {
    const existingProductIndex = products.findIndex((product) => product.sku === seedProduct.sku)
    if (existingProductIndex !== -1) {
      const existingProduct = products[existingProductIndex]
      const previousImageIds = previousSeedProductImageIds[seedProduct.sku] ?? []
      if (previousImageIds.some((imageId) => existingProduct.images[0]?.includes(imageId))) {
        products[existingProductIndex] = {
          ...existingProduct,
          images: [seedProduct.images[0], ...existingProduct.images.slice(1)],
        }
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
