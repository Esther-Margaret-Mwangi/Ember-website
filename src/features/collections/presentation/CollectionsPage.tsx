import type { CatalogCategory } from '../../catalog'
import { StorefrontIcon } from '../../../shared/components/StorefrontIcon'
import './CollectionsPage.css'

export default function CollectionsPage({
  categories,
  onNavigate,
}: {
  categories: CatalogCategory[]
  onNavigate: (destination: string) => void
}) {
  return (
    <>
      <section className="collections-hero">
        <div className="collections-hero-image" role="img" aria-label="Sunlit living room with warm leather seating, plants, and gathered home decor" />
        <div className="collections-hero-shade" />
        <div className="collections-hero-copy">
          <p className="eyebrow light">THOUGHTFULLY GATHERED · EMBER EDITS</p>
          <h1>Collections for<br />the way you live.</h1>
          <p>Warm layers, considered objects, and little details that make a house feel like yours.</p>
          <a className="button button-light" href="#collections-list" onClick={(event) => { event.preventDefault(); document.getElementById('collections-list')?.scrollIntoView({ behavior: 'smooth' }) }}>Explore the collections <StorefrontIcon name="arrow" size={17} /></a>
        </div>
        <span className="collections-hero-caption">GATHERED WITH CARE · MADE TO BE LIVED WITH</span>
      </section>
      <section className="collections-page-grid" id="collections-list" aria-label="Explore collections">
        {categories.map((category, index) => (
          <a
            className="collection-category-card"
            href={`/shop?category=${encodeURIComponent(category.name)}`}
            key={category.id}
            onClick={(event) => {
              event.preventDefault()
              onNavigate(`/shop?category=${encodeURIComponent(category.name)}`)
            }}
          >
            <img src={category.image} alt="" loading="lazy" />
            <span className="collection-category-number">{String(index + 1).padStart(2, '0')} / {String(categories.length).padStart(2, '0')}</span>
            <span className="collection-category-copy"><strong>{category.name}</strong><span>Discover the edit <StorefrontIcon name="arrow" size={16} /></span></span>
          </a>
        ))}
      </section>
    </>
  )
}
