import type { CatalogCategory } from '../../catalog'
import { StorefrontIcon } from '../../../shared/components/StorefrontIcon'

export default function CollectionsPage({
  categories,
  onNavigate,
}: {
  categories: CatalogCategory[]
  onNavigate: (destination: string) => void
}) {
  return (
    <>
      <section className="store-page page-intro collections-intro">
        <p className="eyebrow"><span /> THOUGHTFULLY GATHERED</p>
        <h1>Collections for the way you live.</h1>
        <p>Explore considered pieces for every room, ritual, and slower moment at home.</p>
      </section>
      <section className="collections-page-grid" aria-label="Explore collections">
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
            <span className="collection-category-number">0{index + 1} / {String(categories.length).padStart(2, '0')}</span>
            <span className="collection-category-copy"><strong>{category.name}</strong><span>Discover the edit <StorefrontIcon name="arrow" size={16} /></span></span>
          </a>
        ))}
      </section>
      <section className="collection-banner collection-feature">
        <div className="collection-image" role="img" aria-label="Autumn-toned living room with a textured throw and handmade pottery" />
        <div className="collection-shade" />
        <div className="collection-copy">
          <p className="eyebrow light">THE SEASONAL EDIT · NO. 04</p>
          <h2>Gather close.<br />Stay a little longer.</h2>
          <p>Warm layers, glowing light, and small things that make a house feel like yours.</p>
          <a className="button button-light" href="/shop?category=Atmosphere" onClick={(event) => { event.preventDefault(); onNavigate('/shop?category=Atmosphere') }}>Shop the seasonal edit <StorefrontIcon name="arrow" size={17} /></a>
        </div>
        <span className="collection-caption">MADE FOR THE IN-BETWEEN MOMENTS</span>
      </section>
    </>
  )
}
