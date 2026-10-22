import { useState } from 'react'
import { useCatalog, type CatalogCategory, type CatalogProduct } from '../../catalog'
import type { Order, OrderStatus } from '../orders'
import DashboardPage from '../dashboard/presentation/DashboardPage'
import ProductsPage from '../products/presentation/ProductsPage'
import CategoriesPage from '../categories/presentation/CategoriesPage'
import { OrdersPage } from '../orders'
import InventoryPage from '../inventory/presentation/InventoryPage'
import PromotionsPage from '../promotions/presentation/PromotionsPage'
import AnalyticsPage from '../analytics/presentation/AnalyticsPage'
import './AdminDashboard.css'

type AdminDashboardProps = {
  path: string
  onNavigate: (destination: string) => void
  onBackToStore: () => void
}

const initialOrders: Order[] = [
  { id: '#EM-2084', customer: 'Olivia Bennett', date: 'Oct 22, 2026', amount: 184, status: 'Processing' },
  { id: '#EM-2083', customer: 'Elliot James', date: 'Oct 22, 2026', amount: 96, status: 'Shipped' },
  { id: '#EM-2082', customer: 'Maya Chen', date: 'Oct 21, 2026', amount: 242, status: 'Delivered' },
  { id: '#EM-2081', customer: 'Sofia Williams', date: 'Oct 21, 2026', amount: 58, status: 'Processing' },
]

const adminSections = ['Overview', 'Products', 'Categories', 'Orders', 'Inventory', 'Promotions', 'Analytics']

async function prepareProductImage(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('Choose an image file.')
  if (file.size > 12 * 1024 * 1024) throw new Error('Images must be smaller than 12 MB.')

  const source = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('Could not read this image file.'))
    reader.onerror = () => reject(reader.error ?? new Error('Could not read this image file.'))
    reader.readAsDataURL(file)
  })

  const image = new Image()
  image.src = source
  await image.decode()
  const scale = Math.min(1, 1600 / Math.max(image.naturalWidth, image.naturalHeight))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale))
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale))
  const context = canvas.getContext('2d')
  if (!context) throw new Error('This browser could not prepare the image.')
  context.drawImage(image, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/jpeg', 0.82)
}

function AdminDashboard({ path, onNavigate, onBackToStore }: AdminDashboardProps) {
  const { catalog, setCatalog, ready: catalogReady, error: catalogError, clearError } = useCatalog()
  const [orders, setOrders] = useState(initialOrders)
  const inventory = catalog.products
  const [notice, setNotice] = useState('')
  const [productDialogOpen, setProductDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<CatalogProduct | null>(null)
  const [productImages, setProductImages] = useState<string[]>([])
  const [productImageError, setProductImageError] = useState('')
  const [categoryImage, setCategoryImage] = useState('')
  const [categoryFormError, setCategoryFormError] = useState('')
  const [promotionDialogOpen, setPromotionDialogOpen] = useState(false)
  const [promotionIsNew, setPromotionIsNew] = useState(false)
  const [promotion, setPromotion] = useState({ code: 'AUTUMN10', title: 'A softer landing into autumn.', message: '10% off the collection for a limited time.', discount: 10 })

  const lowStock = inventory.filter((item) => item.stock <= 5)
  const routeSection = path.split('/')[2] ?? 'overview'
  const section = adminSections.find((item) => item.toLowerCase() === routeSection) ?? 'Overview'

  const navigateSection = (nextSection: string) => {
    onNavigate(nextSection === 'Overview' ? '/admin' : `/admin/${nextSection.toLowerCase()}`)
  }

  const downloadSalesSummary = () => {
    const csv = ['Metric,Value', 'Total revenue,24680', 'Orders,186', 'Average order value,132.69', 'Returning customers,38.4%'].join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'ember-sales-preview.csv'
    link.click()
    URL.revokeObjectURL(url)
    setNotice('Sample sales summary downloaded.')
  }

  const openProductEditor = (product?: CatalogProduct) => {
    setEditingProduct(product ?? null)
    setProductImages(product?.images ?? [])
    setProductImageError('')
    setProductDialogOpen(true)
  }

  const addProduct = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('name') ?? '').trim()
    const price = Number(formData.get('price'))
    const stock = Number(formData.get('stock'))
    const category = String(formData.get('category') ?? '')
    const color = String(formData.get('color') ?? '').trim()
    const badge = String(formData.get('badge') ?? '').trim()
    const description = String(formData.get('description') ?? '').trim()
    const published = formData.get('published') === 'on'
    if (!name || !catalog.categories.some((item) => item.name === category) || !Number.isFinite(price) || price <= 0 || !Number.isInteger(stock) || stock < 0 || !color || !description || productImages.length === 0) {
      setProductImageError(productImages.length ? '' : 'Add at least one product image before saving.')
      setNotice('Complete the required product details and add an image.')
      return
    }
    const savedProduct: CatalogProduct = {
      id: editingProduct?.id ?? Math.max(0, ...inventory.map((item) => item.id)) + 1,
      sku: editingProduct?.sku ?? `EMB-${Date.now().toString().slice(-6)}`,
      name,
      category,
      price,
      images: productImages,
      color,
      badge: badge || undefined,
      stock,
      published,
      description,
    }
    setCatalog((current) => ({
      ...current,
      products: editingProduct
        ? current.products.map((product) => product.id === editingProduct.id ? savedProduct : product)
        : [...current.products, savedProduct],
    }))
    setProductDialogOpen(false)
    setNotice(`${name} was ${editingProduct ? 'updated' : 'added'} in the catalog preview.`)
  }

  const handleProductImages = async (files: FileList | null) => {
    if (!files?.length) return
    setProductImageError('')
    try {
      const remainingSlots = 5 - productImages.length
      if (remainingSlots <= 0) {
        setProductImageError('A product can have up to five images.')
        return
      }
      const selected = Array.from(files).slice(0, remainingSlots)
      const images = await Promise.all(selected.map(prepareProductImage))
      setProductImages((current) => [...current, ...images].slice(0, 5))
    } catch (imageError) {
      setProductImageError(imageError instanceof Error ? imageError.message : 'Could not prepare the selected image.')
    }
  }

  const addCategory = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('categoryName') ?? '').trim()
    if (!name) {
      setCategoryFormError('Enter a category name.')
      return
    }
    if (catalog.categories.some((category) => category.name.toLowerCase() === name.toLowerCase())) {
      setCategoryFormError('A category with this name already exists.')
      return
    }
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    if (!id) {
      setCategoryFormError('Use a category name containing letters or numbers.')
      return
    }
    const newCategory: CatalogCategory = {
      id: `${id}-${Date.now().toString().slice(-5)}`,
      name,
      image: categoryImage || catalog.categories[0]?.image || '',
    }
    setCatalog((current) => ({ ...current, categories: [...current.categories, newCategory] }))
    setCategoryImage('')
    setCategoryFormError('')
    event.currentTarget.reset()
    setNotice(`${name} is now available as a product category.`)
  }

  const handleCategoryImage = async (file: File | undefined) => {
    if (!file) return
    try {
      setCategoryImage(await prepareProductImage(file))
      setCategoryFormError('')
    } catch (imageError) {
      setCategoryFormError(imageError instanceof Error ? imageError.message : 'Could not prepare this category image.')
    }
  }

  const removeCategory = (category: CatalogCategory) => {
    if (inventory.some((product) => product.category === category.name)) {
      setNotice(`Move or remove the products in ${category.name} before deleting this category.`)
      return
    }
    setCatalog((current) => ({
      ...current,
      categories: current.categories.filter((item) => item.id !== category.id),
    }))
    setNotice(`${category.name} was removed from the catalog.`)
  }

  const togglePublished = (productId: number) => {
    const product = inventory.find((item) => item.id === productId)
    if (!product) return
    setCatalog((current) => ({
      ...current,
      products: current.products.map((item) => item.id === productId ? { ...item, published: !item.published } : item),
    }))
    setNotice(`${product.name} is now ${product.published ? 'hidden from' : 'visible in'} the storefront.`)
  }

  const removeProduct = (product: CatalogProduct) => {
    setCatalog((current) => ({
      ...current,
      products: current.products.filter((item) => item.id !== product.id),
    }))
    setNotice(`${product.name} was removed from the catalog.`)
  }

  const savePromotion = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const code = String(formData.get('code') ?? '').trim().toUpperCase()
    const title = String(formData.get('title') ?? '').trim()
    const message = String(formData.get('message') ?? '').trim()
    const discount = Number(formData.get('discount'))
    if (!code || !title || !message || !Number.isInteger(discount) || discount < 1 || discount > 100) {
      setNotice('Complete each promotion field before saving.')
      return
    }
    setPromotion({ code, title, message, discount })
    setPromotionDialogOpen(false)
    setNotice(`Promotion ${code} was updated in this preview.`)
  }

  const updateOrder = (id: string, status: OrderStatus) => {
    setOrders((current) => current.map((order) => order.id === id ? { ...order, status } : order))
    setNotice(`${id} status updated to ${status}.`)
  }

  const adjustStock = (sku: string, amount: number) => {
    const item = inventory.find((product) => product.sku === sku)
    if (item && item.stock + amount < 0) {
      setNotice(`${item.name} stock cannot go below zero.`)
      return
    }
    setCatalog((current) => ({
      ...current,
      products: current.products.map((product) => product.sku === sku ? { ...product, stock: product.stock + amount } : product),
    }))
    setNotice('Inventory preview updated.')
  }

  return (
    <main className="admin-app">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="/admin" onClick={(event) => { event.preventDefault(); navigateSection('Overview') }}>
          <span className="admin-brand-lockup">
            <img className="admin-brand-logo" src="/emberlogo-transparent.png" alt="Ember" />
            <small>STUDIO</small>
          </span>
        </a>
        <p className="sidebar-label">WORKSPACE</p>
        <nav className="admin-nav" aria-label="Admin navigation">
          {[
            ['Overview', '◫'],
            ['Products', '◇'],
            ['Categories', '▦'],
            ['Orders', '▤'],
            ['Inventory', '▧'],
            ['Promotions', '✳'],
            ['Analytics', '↗'],
          ].map(([name, icon]) => (
            <button className={section === name ? 'active' : ''} key={name} onClick={() => navigateSection(name)}>
              <span className="nav-icon">{icon}</span>{name}
              {name === 'Inventory' && lowStock.length > 0 && <span className="nav-badge">{lowStock.length}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="admin-user"><span className="admin-avatar">E</span><span><strong>Ember team</strong><small>Preview access</small></span></div>
          <button className="return-store" onClick={onBackToStore}>← <span>Back to storefront</span></button>
        </div>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div className="breadcrumb">Ember Studio <span>/</span> {section}</div>
          <div className="topbar-right"><span className="preview-label"><span /> PREVIEW MODE</span><button className="topbar-avatar" aria-label="Ember team account" onClick={() => setNotice('You are using the local Ember team preview.')}>E</button></div>
        </header>

        <div className="admin-content">
          {catalogError && <button className="admin-notice error" onClick={clearError}>Catalog storage issue: {catalogError} <span>×</span></button>}
          {!catalogReady && <p className="catalog-loading" role="status">Loading the saved Ember catalog…</p>}
          {notice && <button className="admin-notice" onClick={() => setNotice('')}>{notice} <span>×</span></button>}
          <div className="admin-page-heading">
            <div><p className="admin-overline">THURSDAY, OCTOBER 22, 2026</p><h1>{section === 'Overview' ? 'A good morning, team.' : section}</h1><p className="admin-subheading">{section === 'Overview' ? 'Here’s what’s happening around Ember today.' : `A little overview of your ${section.toLowerCase()} for this preview.`}</p></div>
            <label className="admin-date-button"><span className="visually-hidden">Report date range</span><select aria-label="Report date range" defaultValue="Last 30 days" onChange={(event) => setNotice(`Showing sample reporting period: ${event.target.value}.`)}><option>Last 7 days</option><option>Last 30 days</option><option>Last 90 days</option></select><span>⌄</span></label>
          </div>

          {section === 'Overview' && <DashboardPage
            lowStock={lowStock}
            orders={orders}
            onDownloadSales={downloadSalesSummary}
            onNavigate={navigateSection}
            onUpdateOrder={updateOrder}
          />}

          {section === 'Products' && <ProductsPage products={inventory} onAdd={() => openProductEditor()} onEdit={openProductEditor} onTogglePublished={togglePublished} onRemove={removeProduct} />}

          {section === 'Categories' && <CategoriesPage categories={catalog.categories} products={inventory} image={categoryImage} error={categoryFormError} onSubmit={addCategory} onImageChange={(file) => { void handleCategoryImage(file) }} onRemove={removeCategory} />}

          {section === 'Inventory' && <InventoryPage
            inventory={inventory}
            lowStockCount={lowStock.filter((item) => item.stock > 0).length}
            outOfStockCount={inventory.filter((item) => item.stock === 0).length}
            onAdjust={adjustStock}
          />}

          {section === 'Orders' && <OrdersPage orders={orders} onUpdate={updateOrder} />}

          {section === 'Promotions' && <PromotionsPage
            promotion={promotion}
            onEdit={() => { setPromotionIsNew(false); setPromotionDialogOpen(true) }}
            onCreate={() => { setPromotionIsNew(true); setPromotion({ code: '', title: '', message: '', discount: 10 }); setPromotionDialogOpen(true) }}
          />}

          {section === 'Analytics' && <AnalyticsPage products={inventory} />}

          <p className="admin-footnote">Ember Studio · Preview dashboard · Sample data only</p>
        </div>
      </section>

      {(productDialogOpen || promotionDialogOpen) && (
        <div className="admin-modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            setProductDialogOpen(false)
            setPromotionDialogOpen(false)
          }
        }}>
          <section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="admin-modal-title">
            <button className="admin-modal-close" onClick={() => { setProductDialogOpen(false); setPromotionDialogOpen(false) }} aria-label="Close dialog">×</button>
            {productDialogOpen ? (
              <>
                <p className="admin-overline">PRODUCT CATALOGUE</p>
                <h2 id="admin-modal-title">{editingProduct ? 'Edit product' : 'Add a piece'}</h2>
                <form className="admin-edit-form" onSubmit={addProduct}>
                  <label>Product name<input name="name" required maxLength={80} defaultValue={editingProduct?.name ?? ''} /></label>
                  <label>Category<select name="category" defaultValue={editingProduct?.category ?? catalog.categories[0]?.name ?? ''} required>{catalog.categories.map((category) => <option key={category.id}>{category.name}</option>)}</select></label>
                  <label>Price<input name="price" type="number" min="0.01" step="0.01" required defaultValue={editingProduct?.price ?? ''} /></label>
                  <label>Available stock<input name="stock" type="number" min="0" step="1" required defaultValue={editingProduct?.stock ?? 0} /></label>
                  <label>Color<input name="color" required maxLength={40} defaultValue={editingProduct?.color ?? ''} /></label>
                  <label>Badge (optional)<input name="badge" maxLength={24} defaultValue={editingProduct?.badge ?? ''} placeholder="e.g. New or Bestseller" /></label>
                  <label>Description<textarea name="description" required maxLength={500} rows={4} defaultValue={editingProduct?.description ?? ''} /></label>
                  <div className="product-image-upload">
                    <span className="form-label">Product images (up to five)</span>
                    <div className="image-source-actions">
                      <label className="admin-secondary-button">Choose from device<input type="file" accept="image/*" multiple onChange={(event) => { void handleProductImages(event.target.files); event.currentTarget.value = '' }} /></label>
                      <label className="admin-secondary-button">Take a photo<input type="file" accept="image/*" capture="environment" onChange={(event) => { void handleProductImages(event.target.files); event.currentTarget.value = '' }} /></label>
                    </div>
                    <p className="image-upload-help">Images are resized for the local preview. Each original image must be under 12 MB.</p>
                    {productImageError && <p className="form-error" role="alert">{productImageError}</p>}
                    {productImages.length > 0 && <div className="product-image-previews">{productImages.map((image, index) => (
                      <div key={`${index}-${image.slice(0, 32)}`}><img src={image} alt={`Product preview ${index + 1}`} /><button type="button" onClick={() => setProductImages((current) => current.filter((_, imageIndex) => imageIndex !== index))} aria-label={`Remove image ${index + 1}`}>×</button></div>
                    ))}</div>}
                  </div>
                  <label className="publish-toggle"><input type="checkbox" name="published" defaultChecked={editingProduct?.published ?? true} /> Visible in the customer storefront</label>
                  <button className="admin-primary-button" type="submit">{editingProduct ? 'Save product changes' : 'Add product'}</button>
                </form>
              </>
            ) : (
              <>
                <p className="admin-overline">PROMOTIONS</p>
                <h2 id="admin-modal-title">{promotionIsNew ? 'Create a promotion' : 'Edit promotion'}</h2>
                <form className="admin-edit-form" onSubmit={savePromotion}>
                  <label>Discount code<input name="code" value={promotion.code} onChange={(event) => setPromotion((current) => ({ ...current, code: event.target.value }))} required maxLength={24} /></label>
                  <label>Promotion title<input name="title" value={promotion.title} onChange={(event) => setPromotion((current) => ({ ...current, title: event.target.value }))} required maxLength={100} /></label>
                  <label>Customer message<textarea name="message" value={promotion.message} onChange={(event) => setPromotion((current) => ({ ...current, message: event.target.value }))} required maxLength={180} rows={3} /></label>
                  <label>Discount percent<input name="discount" type="number" min="1" max="100" step="1" value={promotion.discount} onChange={(event) => setPromotion((current) => ({ ...current, discount: Number(event.target.value) }))} required /></label>
                  <button className="admin-primary-button" type="submit">Save promotion</button>
                </form>
              </>
            )}
            <p className="admin-modal-note">Published products appear in this browser's customer storefront preview. Nothing is sent to a live site.</p>
          </section>
        </div>
      )}
    </main>
  )
}

export default AdminDashboard
