import type { CatalogCategory } from '../../catalog'
import { StorefrontIcon } from '../../../shared/components/StorefrontIcon'

export default function HomePage({
  categories,
  onNavigate,
}: {
  categories: CatalogCategory[]
  onNavigate: (destination: string) => void
}) {
  return (
    <>
      <section className="hero" id="home">
        <div className="hero-image" role="img" aria-label="Warm, sunlit home with handmade ceramics and soft textiles" />
        <div className="hero-shade" />
        <div className="hero-copy">
          <p className="eyebrow"><span /> A HOME THAT FEELS LIKE YOU</p>
          <h1>Design.<br />Warmth.<br />A better home.</h1>
          <p className="hero-description">Considered home essentials that bring comfort, character, and calm to your everyday.</p>
          <div className="hero-ctas">
            <a className="button button-clay" href="/shop" onClick={(event) => { event.preventDefault(); onNavigate('/shop') }}>Shop the collection <StorefrontIcon name="arrow" size={17} /></a>
            <a className="button button-quiet" href="/about" onClick={(event) => { event.preventDefault(); onNavigate('/about') }}>Our story</a>
          </div>
          <div className="hero-social-proof">
            <div className="avatar-stack" aria-hidden="true"><span>J</span><span>M</span><span>A</span><span>S</span></div>
            <div><strong>10k+</strong><span>happy homes</span></div>
          </div>
        </div>
        <div className="season-card">
          <div className="season-art" />
          <div><span>IN SEASON</span><strong>Autumn, at home</strong><small>Discover the collection</small></div>
          <a href="/collections" onClick={(event) => { event.preventDefault(); onNavigate('/collections') }} aria-label="Explore the autumn collection"><StorefrontIcon name="arrow" size={17} /></a>
        </div>
        <div className="shipping-card"><span className="shipping-symbol">✳</span><div><strong>Made for living</strong><small>Thoughtful, lasting pieces</small></div></div>
        <div className="hero-pagination"><span className="active" /><span /><span /></div>
      </section>

      <section className="category-strip" id="collections" aria-label="Shop by category">
        {categories.map((item, index) => (
          <a className="category-tile" href={`/shop?category=${encodeURIComponent(item.name)}`} key={item.id} onClick={(event) => { event.preventDefault(); onNavigate(`/shop?category=${encodeURIComponent(item.name)}`) }}>
            <img src={item.image} alt="" loading="lazy" />
            <span className="category-number">0{index + 1}</span>
            <span className="category-name">{item.name}</span>
            <span className="category-arrow"><StorefrontIcon name="arrow" size={16} /></span>
          </a>
        ))}
      </section>

      <section className="collection-banner" id="story">
        <div className="collection-image" role="img" aria-label="Autumn-toned living room with a textured throw and handmade pottery" />
        <div className="collection-shade" />
        <div className="collection-copy">
          <p className="eyebrow light">THE SEASONAL EDIT · NO. 04</p>
          <h2>Gather close.<br />Stay a little longer.</h2>
          <p>Warm layers, glowing light, and small things that make a house feel like yours.</p>
          <a className="button button-light" href="/shop?category=Atmosphere" onClick={(event) => { event.preventDefault(); onNavigate('/shop?category=Atmosphere') }}>Explore the autumn edit <StorefrontIcon name="arrow" size={17} /></a>
        </div>
        <span className="collection-caption">MADE FOR THE IN-BETWEEN MOMENTS</span>
      </section>
    </>
  )
}
