import type { FormEvent } from 'react'
import type { CatalogCategory, CatalogProduct } from '../../../catalog'

export default function CategoriesPage({
  categories,
  products,
  image,
  error,
  onSubmit,
  onImageChange,
  onRemove,
}: {
  categories: CatalogCategory[]
  products: CatalogProduct[]
  image: string
  error: string
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onImageChange: (file: File | undefined) => void
  onRemove: (category: CatalogCategory) => void
}) {
  return (
    <div className="category-admin-layout">
      <article className="admin-panel category-create-panel">
        <div className="panel-heading"><div><h2>Add a category</h2><p>New categories appear in the storefront filters and collections.</p></div></div>
        <form className="admin-edit-form" onSubmit={onSubmit}>
          <label>Category name<input name="categoryName" required maxLength={40} placeholder="e.g. Tableware" /></label>
          <label>Category image (optional)<input type="file" accept="image/*" onChange={(event) => onImageChange(event.target.files?.[0])} /></label>
          {image && <img className="category-image-preview" src={image} alt="Selected category preview" />}
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="admin-primary-button" type="submit">Add category</button>
        </form>
      </article>
      <article className="admin-panel category-list-panel">
        <div className="panel-heading"><div><h2>Store categories</h2><p>{categories.length} categories are available for products.</p></div></div>
        <div className="admin-category-list">
          {categories.map((category) => {
            const productCount = products.filter((product) => product.category === category.name).length
            return <div className="admin-category-row" key={category.id}><img src={category.image} alt="" /><span><strong>{category.name}</strong><small>{productCount} {productCount === 1 ? 'product' : 'products'}</small></span><button className="admin-secondary-button" onClick={() => onRemove(category)} aria-label={`Remove ${category.name} category`}>Remove</button></div>
          })}
          {categories.length === 0 && <p className="empty-categories">Add a category before creating products.</p>}
        </div>
      </article>
    </div>
  )
}
