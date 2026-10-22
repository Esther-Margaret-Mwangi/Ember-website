import { useMemo, useState } from 'react'
import './Storefront.css'

type Product = {
  id: number
  name: string
  category: string
  price: number
  image: string
  color: string
  badge?: string
}

type CartLine = {
  product: Product
  quantity: number
  color: string
  size: string
}

type PendingAction =
  | { type: 'favorite'; product: Product }
  | { type: 'cart'; product: Product; color: string; size: string }

type StorefrontProps = {
  onOpenAdmin: () => void
}

const products: Product[] = [
  {
    id: 1,
    name: 'The Sunday Candle',
    category: 'Atmosphere',
    price: 38,
    image:
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=85',
    color: 'Amber',
    badge: 'Bestseller',
  },
  {
    id: 2,
    name: 'Sculpted Stoneware Vase',
    category: 'Decor',
    price: 84,
    image:
      'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=900&q=85',
    color: 'Sand',
    badge: 'New',
  },
  {
    id: 3,
    name: 'Cloud Knit Throw',
    category: 'Textiles',
    price: 112,
    image:
      'https://images.unsplash.com/photo-1600369671236-e74521d4b6ad?auto=format&fit=crop&w=900&q=85',
    color: 'Oat',
  },
  {
    id: 4,
    name: 'Arc Table Lamp',
    category: 'Lighting',
    price: 146,
    image:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85',
    color: 'Natural',
  },
  {
    id: 5,
    name: 'Hand-thrown Bud Vase',
    category: 'Decor',
    price: 58,
    image:
      'https://images.unsplash.com/photo-1612196808214-b7e1d6145a8c?auto=format&fit=crop&w=900&q=85',
    color: 'Terracotta',
  },
  {
    id: 6,
    name: 'Linen Cushion Cover',
    category: 'Textiles',
    price: 46,
    image:
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=900&q=85',
    color: 'Flax',
  },
  {
    id: 7,
    name: 'Evening Glow Candle',
    category: 'Atmosphere',
    price: 32,
    image:
      'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=900&q=85',
    color: 'Spiced Fig',
  },
  {
    id: 8,
    name: 'Gathering Bowl',
    category: 'Decor',
    price: 72,
    image:
      'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&q=85',
    color: 'Warm White',
  },
]

const categories = [
  {
    name: 'Lighting',
    image:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=640&q=85',
  },
  {
    name: 'Textiles',
    image:
      'https://images.unsplash.com/photo-1600369671236-e74521d4b6ad?auto=format&fit=crop&w=640&q=85',
  },
  {
    name: 'Decor',
    image:
      'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=640&q=85',
  },
  {
    name: 'Atmosphere',
    image:
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=640&q=85',
  },
]

function Icon({
  name,
  size = 20,
  filled = false,
}: {
  name: 'search' | 'user' | 'heart' | 'bag' | 'arrow' | 'close' | 'minus' | 'plus' | 'menu'
  size?: number
  filled?: boolean
}) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
  }

  if (name === 'search') {
    return <svg {...common}><circle cx="10.8" cy="10.8" r="6.3" /><path d="m16 16 4.2 4.2" /></svg>
  }
  if (name === 'user') {
    return <svg {...common}><circle cx="12" cy="8" r="3.4" /><path d="M5.5 20c.4-3.5 2.6-5.5 6.5-5.5s6.1 2 6.5 5.5" /></svg>
  }
  if (name === 'heart') {
    return <svg {...common} fill={filled ? 'currentColor' : 'none'}><path d="M20.4 8.7c0 4.1-8.4 10-8.4 10s-8.4-5.9-8.4-10a4.4 4.4 0 0 1 8.4-1.8 4.4 4.4 0 0 1 8.4 1.8Z" /></svg>
  }
  if (name === 'bag') {
    return <svg {...common}><path d="M5 8.5h14l1 12H4l1-12Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></svg>
  }
  if (name === 'arrow') {
    return <svg {...common}><path d="M4.5 12h14m-5.5-5.5 5.5 5.5-5.5 5.5" /></svg>
  }
  if (name === 'close') {
    return <svg {...common}><path d="m6 6 12 12M18 6 6 18" /></svg>
  }
  if (name === 'minus') {
    return <svg {...common}><path d="M5 12h14" /></svg>
  }
  if (name === 'plus') {
    return <svg {...common}><path d="M12 5v14m-7-7h14" /></svg>
  }
  return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
}

function Storefront({ onOpenAdmin }: StorefrontProps) {
  const [category, setCategory] = useState('All')
  const [announcementVisible, setAnnouncementVisible] = useState(true)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('Featured')
  const [dialog, setDialog] = useState<'login' | 'cart' | 'product' | 'account' | null>(null)
  const [loginRole, setLoginRole] = useState<'customer' | 'admin'>('customer')
  const [customerPreview, setCustomerPreview] = useState(false)
  const [activeProduct, setActiveProduct] = useState<Product>(products[0])
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('One size')
  const [favorites, setFavorites] = useState<number[]>([])
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null)
  const [cart, setCart] = useState<CartLine[]>([])
  const [notice, setNotice] = useState('')
  const [discountApplied, setDiscountApplied] = useState(false)
  const [checkoutComplete, setCheckoutComplete] = useState(false)

  const visibleProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesCategory = category === 'All' || product.category === category
      const matchesQuery = `${product.name} ${product.category} ${product.color}`
        .toLowerCase()
        .includes(query.toLowerCase())
      return matchesCategory && matchesQuery
    })

    if (sort === 'Price: low to high') return filtered.sort((a, b) => a.price - b.price)
    if (sort === 'Price: high to low') return filtered.sort((a, b) => b.price - a.price)
    return filtered
  }, [category, query, sort])

  const cartCount = cart.reduce((total, line) => total + line.quantity, 0)
  const subtotal = cart.reduce((total, line) => total + line.product.price * line.quantity, 0)
  const total = subtotal - (discountApplied ? subtotal * 0.1 : 0)

  const requestLogin = (role: 'customer' | 'admin' = 'customer') => {
    setLoginRole(role)
    setDialog('login')
  }

  const openProduct = (product: Product) => {
    setActiveProduct(product)
    setSelectedColor(product.color)
    setSelectedSize('One size')
    setDialog('product')
  }

  const toggleFavorite = (product: Product) => {
    if (!customerPreview) {
      setPendingAction({ type: 'favorite', product })
      requestLogin()
      return
    }
    setFavorites((current) =>
      current.includes(product.id)
        ? current.filter((id) => id !== product.id)
        : [...current, product.id],
    )
  }

  const addToCart = (product: Product, color = product.color, size = 'One size') => {
    if (!customerPreview) {
      setPendingAction({ type: 'cart', product, color, size })
      requestLogin()
      return
    }
    setCart((current) => {
      const existing = current.find(
        (line) => line.product.id === product.id && line.color === color && line.size === size,
      )
      if (existing) {
        return current.map((line) =>
          line === existing ? { ...line, quantity: line.quantity + 1 } : line,
        )
      }
      return [...current, { product, quantity: 1, color, size }]
    })
    setDialog('cart')
    setNotice('')
    setCheckoutComplete(false)
  }

  const changeQuantity = (index: number, amount: number) => {
    setCart((current) =>
      current
        .map((line, lineIndex) =>
          lineIndex === index ? { ...line, quantity: line.quantity + amount } : line,
        )
        .filter((line) => line.quantity > 0),
    )
  }

  const submitLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (loginRole === 'admin') {
      setPendingAction(null)
      setDialog(null)
      onOpenAdmin()
      return
    }
    setCustomerPreview(true)
    const action = pendingAction
    setPendingAction(null)
    if (action?.type === 'favorite') {
      setFavorites((current) =>
        current.includes(action.product.id)
          ? current.filter((id) => id !== action.product.id)
          : [...current, action.product.id],
      )
      setNotice(`${action.product.name} saved to your preview wishlist.`)
      setDialog(null)
    } else if (action?.type === 'cart') {
      setCart((current) => {
        const existing = current.find(
          (line) => line.product.id === action.product.id &&
            line.color === action.color &&
            line.size === action.size,
        )
        if (existing) {
          return current.map((line) =>
            line === existing ? { ...line, quantity: line.quantity + 1 } : line,
          )
        }
        return [...current, { product: action.product, quantity: 1, color: action.color, size: action.size }]
      })
      setNotice('You are browsing as a customer preview.')
      setDialog('cart')
    } else {
      setNotice('You are browsing as a customer preview.')
      setDialog(null)
    }
  }

  const submitCheckout = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setCheckoutComplete(true)
    setCart([])
  }

  return (
    <main className="storefront">
      {announcementVisible && (
        <div className="announcement">
          <span>Thoughtful things for slower days</span>
          <span>Complimentary shipping on orders over $100 <span aria-hidden="true">↗</span></span>
          <button
            className="announcement-dismiss"
            type="button"
            aria-label="Dismiss announcement"
            onClick={() => setAnnouncementVisible(false)}
          >
            <Icon name="close" size={14} />
          </button>
        </div>
      )}

      <header className="store-header">
        <a className="brand" href="#home" aria-label="Ember home">
          <img
            className="brand-logo"
            src="/emberlogo-transparent.png"
            alt="Ember — Warmth, thoughtfully styled"
          />
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <a href="#home">Home</a>
          <a href="#shop">Shop <span className="nav-caret">⌄</span></a>
          <a href="#collections">Collections</a>
          <a href="#story">Our story</a>
        </nav>
        <div className="header-actions">
          <button
            className={`icon-button search-toggle ${searchOpen ? 'is-active' : ''}`}
            aria-label={searchOpen ? 'Close search' : 'Search products'}
            onClick={() => setSearchOpen((open) => !open)}
          >
            <Icon name={searchOpen ? 'close' : 'search'} />
          </button>
          <button
            className="icon-button"
            aria-label={customerPreview ? 'Open your account' : 'Sign in'}
            onClick={() => customerPreview ? setDialog('account') : requestLogin()}
          >
            <Icon name="user" />
          </button>
          <button
            className={`icon-button ${favorites.length ? 'has-favorite' : ''}`}
            aria-label={customerPreview ? `Wishlist, ${favorites.length} saved` : 'Sign in to use wishlist'}
            onClick={() => customerPreview ? setDialog('account') : requestLogin()}
          >
            <Icon name="heart" filled={favorites.length > 0} />
          </button>
          <button
            className="icon-button bag-button"
            aria-label={customerPreview ? `Shopping bag, ${cartCount} items` : 'Sign in to use shopping bag'}
            onClick={() => customerPreview ? setDialog('cart') : requestLogin()}
          >
            <Icon name="bag" />
            <span className="bag-count">{cartCount}</span>
          </button>
          <button className="icon-button mobile-menu" aria-label="Open menu">
            <Icon name="menu" />
          </button>
        </div>
      </header>

      {searchOpen && (
        <div className="search-bar">
          <Icon name="search" size={18} />
          <input
            autoFocus
            aria-label="Search the collection"
            placeholder="Search the collection..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query && <button onClick={() => setQuery('')}>Clear</button>}
        </div>
      )}

      {notice && (
        <button className="preview-notice" onClick={() => setNotice('')} aria-label="Dismiss preview notice">
          {notice} <Icon name="close" size={15} />
        </button>
      )}

      <section className="hero" id="home">
        <div className="hero-image" role="img" aria-label="Warm, sunlit home with handmade ceramics and soft textiles" />
        <div className="hero-shade" />
        <div className="hero-copy">
          <p className="eyebrow"><span /> A HOME THAT FEELS LIKE YOU</p>
          <h1>Design.<br />Warmth.<br />A better home.</h1>
          <p className="hero-description">
            Considered home essentials that bring comfort, character, and calm to your everyday.
          </p>
          <div className="hero-ctas">
            <a className="button button-clay" href="#shop">Shop the collection <Icon name="arrow" size={17} /></a>
            <a className="button button-quiet" href="#story">Our story</a>
          </div>
          <div className="hero-social-proof">
            <div className="avatar-stack" aria-hidden="true">
              <span>J</span><span>M</span><span>A</span><span>S</span>
            </div>
            <div><strong>10k+</strong><span>happy homes</span></div>
          </div>
        </div>
        <div className="season-card">
          <div className="season-art" />
          <div><span>IN SEASON</span><strong>Autumn, at home</strong><small>Discover the collection</small></div>
          <a href="#collections" aria-label="Explore the autumn collection"><Icon name="arrow" size={17} /></a>
        </div>
        <div className="shipping-card">
          <span className="shipping-symbol">✳</span>
          <div><strong>Made for living</strong><small>Thoughtful, lasting pieces</small></div>
        </div>
        <div className="hero-pagination"><span className="active" /><span /><span /></div>
      </section>

      <section className="category-strip" id="collections" aria-label="Shop by category">
        {categories.map((item, index) => (
          <button
            className={`category-tile ${category === item.name ? 'selected' : ''}`}
            key={item.name}
            onClick={() => {
              setCategory(category === item.name ? 'All' : item.name)
              document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            <img src={item.image} alt="" loading="lazy" />
            <span className="category-number">0{index + 1}</span>
            <span className="category-name">{item.name}</span>
            <span className="category-arrow"><Icon name="arrow" size={16} /></span>
          </button>
        ))}
      </section>

      <section className="collection-banner" id="story">
        <div className="collection-image" role="img" aria-label="Autumn-toned living room with a textured throw and handmade pottery" />
        <div className="collection-shade" />
        <div className="collection-copy">
          <p className="eyebrow light">THE SEASONAL EDIT · NO. 04</p>
          <h2>Gather close.<br />Stay a little longer.</h2>
          <p>Warm layers, glowing light, and small things that make a house feel like yours.</p>
          <a className="button button-light" href="#shop">Explore the autumn edit <Icon name="arrow" size={17} /></a>
        </div>
        <span className="collection-caption">MADE FOR THE IN-BETWEEN MOMENTS</span>
      </section>

      <section className="products-section" id="shop">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span /> FIND YOUR EVERYDAY</p>
            <h2>Little things, <em>lasting feeling.</em></h2>
          </div>
          <a className="text-link" href="#shop">View all pieces <Icon name="arrow" size={17} /></a>
        </div>
        <div className="shop-controls">
          <div className="filter-list" aria-label="Filter by category">
            {['All', 'Lighting', 'Textiles', 'Decor', 'Atmosphere'].map((item) => (
              <button
                className={category === item ? 'filter-chip active' : 'filter-chip'}
                key={item}
                onClick={() => setCategory(item)}
              >{item}</button>
            ))}
          </div>
          <label className="sort-select">
            <span>Sort</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option>Featured</option>
              <option>Price: low to high</option>
              <option>Price: high to low</option>
            </select>
          </label>
        </div>
        {visibleProducts.length > 0 ? (
          <div className="product-grid">
            {visibleProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-image-wrap">
                  <button className="product-image-button" onClick={() => openProduct(product)} aria-label={`View ${product.name}`}>
                    <img src={product.image} alt={product.name} loading="lazy" />
                  </button>
                  {product.badge && <span className="product-badge">{product.badge}</span>}
                  <button
                    className={`favorite-button ${favorites.includes(product.id) ? 'saved' : ''}`}
                    onClick={() => toggleFavorite(product)}
                    aria-label={favorites.includes(product.id) ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
                  >
                    <Icon name="heart" size={18} filled={favorites.includes(product.id)} />
                  </button>
                  <button className="quick-add" onClick={() => openProduct(product)}>Quick add <Icon name="plus" size={15} /></button>
                </div>
                <div className="product-details">
                  <div><p className="product-category">{product.category}</p><h3>{product.name}</h3></div>
                  <strong>${product.price}</strong>
                </div>
                <p className="product-color"><span /> {product.color}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-search">Nothing found just yet. Try another search or category.</div>
        )}
      </section>

      <section className="brand-note">
        <span className="brand-note-mark" aria-hidden="true">e</span>
        <p>Fewer things. <em>More feeling.</em></p>
        <span>Objects chosen to stay, not just to be seen.</span>
      </section>

      <footer className="store-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="footer-brand-lockup">
              <a className="footer-brand-logo" href="#home" aria-label="Ember home">
                <img src="/emberlogo2.png" alt="" />
              </a>
              <span className="footer-brand-name">EMBER</span>
            </div>
            <p>Make room for a little more feeling.</p>
          </div>
          <div className="footer-links"><strong>Explore</strong><a href="#shop">Shop all</a><a href="#collections">Collections</a><a href="#story">Our story</a></div>
          <div className="footer-links"><strong>Here to help</strong><a href="#footer">Shipping & returns</a><a href="#footer">Get in touch</a><a href="#footer">FAQs</a></div>
          <div className="newsletter">
            <strong>A note from home</strong>
            <p>New things, thoughtful stories, and the occasional little treat.</p>
            <form onSubmit={(event) => { event.preventDefault(); setNotice('Thanks for joining our little corner of the internet.') }}>
              <label className="visually-hidden" htmlFor="newsletter-email">Email address</label>
              <input id="newsletter-email" type="email" placeholder="Your email address" required />
              <button aria-label="Subscribe to newsletter"><Icon name="arrow" size={18} /></button>
            </form>
          </div>
        </div>
        <div className="footer-bottom" id="footer">
          <span>© 2025 Ember Home. Made for the moments in between.</span>
          <button onClick={() => requestLogin('admin')}>Admin preview</button>
          <span>Privacy · Terms</span>
        </div>
      </footer>

      {dialog === 'login' && (
        <div className="dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setDialog(null)}>
          <section className="dialog-card login-dialog" role="dialog" aria-modal="true" aria-labelledby="login-title">
            <button className="dialog-close" onClick={() => setDialog(null)} aria-label="Close"><Icon name="close" /></button>
            <span className="dialog-mark">e</span>
            <p className="eyebrow centered">A LITTLE SPACE, JUST FOR YOU</p>
            <h2 id="login-title">{loginRole === 'admin' ? 'Welcome, Ember team.' : 'Welcome back home.'}</h2>
            <p className="dialog-description">
              {loginRole === 'admin'
                ? 'Enter the dashboard preview to explore the business side of Ember.'
                : 'Sign in to save the pieces you love and keep your bag close.'}
            </p>
            <div className="role-switch" role="group" aria-label="Choose account type">
              <button className={loginRole === 'customer' ? 'active' : ''} onClick={() => setLoginRole('customer')}>Customer</button>
              <button className={loginRole === 'admin' ? 'active' : ''} onClick={() => setLoginRole('admin')}>Ember team</button>
            </div>
            <form className="login-form" onSubmit={submitLogin}>
              <label>Email address<input type="email" placeholder="you@example.com" required /></label>
              <label>Password<input type="password" placeholder="At least 8 characters" minLength={8} required /></label>
              <button className="button button-clay full-width" type="submit">
                {loginRole === 'admin' ? 'Open dashboard preview' : 'Continue to preview'} <Icon name="arrow" size={17} />
              </button>
            </form>
            <p className="preview-disclaimer">Preview only — no account or password is created or checked.</p>
          </section>
        </div>
      )}

      {dialog === 'product' && (
        <div className="dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setDialog(null)}>
          <section className="dialog-card product-dialog" role="dialog" aria-modal="true" aria-labelledby="product-dialog-title">
            <button className="dialog-close" onClick={() => setDialog(null)} aria-label="Close"><Icon name="close" /></button>
            <img src={activeProduct.image} alt={activeProduct.name} />
            <div className="product-dialog-copy">
              <p className="eyebrow">{activeProduct.category}</p>
              <h2 id="product-dialog-title">{activeProduct.name}</h2>
              <strong className="dialog-price">${activeProduct.price}</strong>
              <p className="dialog-description">A considered piece, made to bring a little warmth to your everyday. Designed with care and chosen to stay.</p>
              <label className="option-label">Color <span>{selectedColor}</span></label>
              <div className="swatch-row">
                {[activeProduct.color, 'Warm White', 'Cinnamon'].map((color, index) => (
                  <button
                    key={color}
                    className={`color-swatch ${selectedColor === color ? 'selected' : ''} swatch-${index}`}
                    aria-label={color}
                    aria-pressed={selectedColor === color}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
              <label className="option-label" htmlFor="product-size">Size</label>
              <select id="product-size" className="size-select" value={selectedSize} onChange={(event) => setSelectedSize(event.target.value)}>
                <option>One size</option><option>Small</option><option>Medium</option><option>Large</option>
              </select>
              <button className="button button-clay full-width" onClick={() => addToCart(activeProduct, selectedColor, selectedSize)}>
                Add to bag · ${activeProduct.price} <Icon name="arrow" size={17} />
              </button>
              <p className="preview-disclaimer">Availability shown for preview; stock is not reserved.</p>
            </div>
          </section>
        </div>
      )}

      {dialog === 'cart' && (
        <div className="dialog-backdrop drawer-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setDialog(null)}>
          <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
            <div className="drawer-heading"><div><p className="eyebrow">THE GOOD THINGS</p><h2 id="cart-title">{checkoutComplete ? 'Thank you.' : 'Your bag'}</h2></div><button className="dialog-close" onClick={() => setDialog(null)} aria-label="Close bag"><Icon name="close" /></button></div>
            {checkoutComplete ? (
              <div className="checkout-success"><span>✓</span><h3>Your preview order is in.</h3><p>This was a demo checkout; no payment was taken and no order was submitted.</p><button className="button button-clay full-width" onClick={() => { setCheckoutComplete(false); setDialog(null) }}>Back to exploring</button></div>
            ) : cart.length === 0 ? (
              <div className="empty-cart"><Icon name="bag" size={34} /><h3>Your bag is taking a little rest.</h3><p>Find something you’d love to live with.</p><button className="button button-clay" onClick={() => setDialog(null)}>Explore the collection <Icon name="arrow" size={17} /></button></div>
            ) : (
              <>
                <div className="cart-lines">
                  {cart.map((line, index) => (
                    <div className="cart-line" key={`${line.product.id}-${line.color}-${line.size}`}>
                      <img src={line.product.image} alt="" />
                      <div className="cart-line-content">
                        <div className="cart-line-top"><div><h3>{line.product.name}</h3><p>{line.color} · {line.size}</p></div><strong>${line.product.price * line.quantity}</strong></div>
                        <div className="quantity-control"><button onClick={() => changeQuantity(index, -1)} aria-label={`Decrease ${line.product.name} quantity`}><Icon name="minus" size={14} /></button><span>{line.quantity}</span><button onClick={() => changeQuantity(index, 1)} aria-label={`Increase ${line.product.name} quantity`}><Icon name="plus" size={14} /></button></div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className={`discount-code ${discountApplied ? 'applied' : ''}`} onClick={() => setDiscountApplied((applied) => !applied)}>
                  <span><strong>AUTUMN10</strong><small>{discountApplied ? '10% preview discount applied' : 'Tap to try our preview code'}</small></span><span>{discountApplied ? 'Applied ✓' : 'Add code +'}</span>
                </button>
                <div className="cart-summary"><div><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div>{discountApplied && <div><span>Autumn preview</span><strong>−${(subtotal * 0.1).toFixed(2)}</strong></div>}<div className="total-row"><span>Total</span><strong>${total.toFixed(2)}</strong></div><small>Shipping and taxes calculated at checkout.</small></div>
                <form className="checkout-form" onSubmit={submitCheckout}>
                  <label>Email for your preview order<input type="email" placeholder="you@example.com" required /></label>
                  <button className="button button-clay full-width" type="submit">Continue to demo checkout <Icon name="arrow" size={17} /></button>
                </form>
                <p className="preview-disclaimer">Demo checkout only. No payment, inventory reservation, or order submission occurs.</p>
              </>
            )}
          </aside>
        </div>
      )}

      {dialog === 'account' && (
        <div className="dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setDialog(null)}>
          <section className="dialog-card account-dialog" role="dialog" aria-modal="true" aria-labelledby="account-title">
            <button className="dialog-close" onClick={() => setDialog(null)} aria-label="Close"><Icon name="close" /></button>
            <p className="eyebrow">YOUR LITTLE CORNER</p>
            <h2 id="account-title">Hello, home lover.</h2>
            <p className="dialog-description">Your current session is a local preview. Saved pieces are only kept while this page is open.</p>
            <div className="account-stats"><div><strong>{favorites.length}</strong><span>Saved pieces</span></div><div><strong>{cartCount}</strong><span>In your bag</span></div></div>
            <h3 className="saved-title">Your saved pieces</h3>
            {favorites.length ? (
              <div className="saved-list">{products.filter((product) => favorites.includes(product.id)).map((product) => <button key={product.id} onClick={() => openProduct(product)}><img src={product.image} alt="" /><span>{product.name}<small>${product.price}</small></span><Icon name="arrow" size={16} /></button>)}</div>
            ) : <p className="empty-saved">Your wishlist is waiting for its first favorite.</p>}
            <h3 className="saved-title">Sample order history</h3>
            <div className="sample-order-list">
              <div><span><strong>EM-2079</strong><small>Oct 18, 2026 · 2 pieces</small></span><b>Delivered</b></div>
              <div><span><strong>EM-2051</strong><small>Oct 04, 2026 · 1 piece</small></span><b>Delivered</b></div>
            </div>
            <p className="preview-disclaimer">Sample account details only. Orders are not connected to checkout.</p>
            <button className="button button-outline full-width" onClick={() => { setCustomerPreview(false); setFavorites([]); setCart([]); setDiscountApplied(false); setCheckoutComplete(false); setNotice(''); setDialog(null) }}>Sign out of preview</button>
          </section>
        </div>
      )}
    </main>
  )
}

export default Storefront
