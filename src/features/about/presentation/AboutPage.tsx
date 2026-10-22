import { StorefrontIcon } from '../../../shared/components/StorefrontIcon'

export default function AboutPage({ onNavigate }: { onNavigate: (destination: string) => void }) {
  return (
    <section className="store-page story-page">
      <p className="eyebrow"><span /> OUR STORY</p>
      <h1>A home is made of how it feels.</h1>
      <p className="page-lead">Ember began with a simple belief: the things we live with should bring a little more meaning to everyday life.</p>
      <div className="story-image" role="img" aria-label="Warm, thoughtfully styled living room" />
      <div className="story-columns">
        <div><h2>Fewer things. More feeling.</h2><p>We look for honest materials, thoughtful details, and objects that feel at home in the rhythms of real life.</p></div>
        <div><h2>Chosen to stay.</h2><p>From soft textiles to the glow of a candle at dusk, every piece is selected to be lived with and loved over time.</p></div>
      </div>
      <a className="button button-clay" href="/shop" onClick={(event) => { event.preventDefault(); onNavigate('/shop') }}>Explore the collection <StorefrontIcon name="arrow" size={17} /></a>
    </section>
  )
}
