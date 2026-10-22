import { useMemo, useState } from 'react'
import { useCatalog, type CatalogProduct as Product } from '../../catalog'
import HomePage from '../../home/presentation/HomePage'
import CollectionsPage from '../../collections/presentation/CollectionsPage'
import ShopPage from '../../shop/presentation/ShopPage'
import AboutPage from '../../about/presentation/AboutPage'
import ContactPage from '../../contact/presentation/ContactPage'
import ProductDetailPage from '../../product-detail/presentation/ProductDetailPage'
import ProfilePage from '../../customer/profile/presentation/ProfilePage'
import WishlistPage from '../../customer/wishlist/presentation/WishlistPage'
import CartPage from '../../customer/cart/presentation/CartPage'
import type { CartLine } from '../../customer/domain/cart'
import ProductGrid from '../../shop/presentation/ProductGrid'
import { StorefrontIcon as Icon } from '../../../shared/components/StorefrontIcon'
import './Storefront.css'

type PendingAction =
  | { type: 'favorite'; product: Product }
  | { type: 'cart'; product: Product; color: string; size: string }

type StorefrontProps = {
  path: string
  onNavigate: (destination: string) => void
  onOpenAdmin: () => void
}

function Storefront({ path, onNavigate, onOpenAdmin }: StorefrontProps) {
  const { catalog, setCatalog } = useCatalog()
  const products = catalog.products
  const categories = catalog.categories
  const currentUrl = new URL(path, 'http://ember.local')
  const route = currentUrl.pathname
  const routeCategory = currentUrl.searchParams.get('category') ?? 'All'
  const routeQuery = currentUrl.searchParams.get('q') ?? ''
  const category = routeCategory === 'All' || categories.some((item) => item.name === routeCategory) ? routeCategory : 'All'
  const [announcementVisible, setAnnouncementVisible] = useState(true)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchDraft, setSearchDraft] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sort, setSort] = useState('Featured')
  const [dialog, setDialog] = useState<'login' | 'cart' | 'product' | null>(null)
  const [loginRole, setLoginRole] = useState<'customer' | 'admin'>('customer')
  const [customerPreview, setCustomerPreview] = useState(false)
  const [activeProduct, setActiveProduct] = useState<Product>(products[0])
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('One size')
  const [favorites, setFavorites] = useState<number[]>([])
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null)
  const [loginDestination, setLoginDestination] = useState<string | null>(null)
  const [cart, setCart] = useState<CartLine[]>([])
  const [notice, setNotice] = useState('')
  const [discountApplied, setDiscountApplied] = useState(false)
  const [checkoutComplete, setCheckoutComplete] = useState(false)

  const query = searchOpen ? searchDraft : routeQuery
  const detailId = Number(route.split('/')[2])
  const detailProduct = products.find((product) => product.id === detailId)
  const go = (destination: string) => {
    setMobileMenuOpen(false)
    setSearchOpen(false)
    onNavigate(destination)
  }
  const handleLink = (destination: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    go(destination)
  }

  const visibleProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesCategory = category === 'All' || product.category === category
      const matchesWishlist = route !== '/wishlist' || favorites.includes(product.id)
      const matchesPublished = product.published
      const matchesQuery = `${product.name} ${product.category} ${product.color}`
        .toLowerCase()
        .includes(query.toLowerCase())
      return matchesCategory && matchesWishlist && matchesPublished && matchesQuery
    })

    if (sort === 'Price: low to high') return filtered.sort((a, b) => a.price - b.price)
    if (sort === 'Price: high to low') return filtered.sort((a, b) => b.price - a.price)
    return filtered
  }, [category, favorites, products, query, route, sort])

  const cartCount = cart.reduce((total, line) => total + line.quantity, 0)
  const subtotal = cart.reduce((total, line) => total + line.product.price * line.quantity, 0)
  const total = subtotal - (discountApplied ? subtotal * 0.1 : 0)

  const requestLogin = (role: 'customer' | 'admin' = 'customer', destination: string | null = null) => {
    setLoginRole(role)
    setLoginDestination(destination)
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
    if (!product.published) {
      setNotice('This piece is not currently available.')
      return
    }
    const quantityInCart = cart
      .filter((line) => line.product.id === product.id)
      .reduce((quantity, line) => quantity + line.quantity, 0)
    if (quantityInCart >= product.stock) {
      setNotice(product.stock === 0 ? 'This piece is currently out of stock.' : `Only ${product.stock} available; your bag already has ${quantityInCart}.`)
      return
    }
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
    const line = cart[index]
    if (line && amount > 0) {
      const quantityInCart = cart
        .filter((item) => item.product.id === line.product.id)
        .reduce((quantity, item) => quantity + item.quantity, 0)
      if (quantityInCart >= line.product.stock) {
        setNotice(line.product.stock === 0 ? 'This piece is currently out of stock.' : `Only ${line.product.stock} available.`)
        return
      }
    }
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
      const quantityInCart = cart
        .filter((line) => line.product.id === action.product.id)
        .reduce((quantity, line) => quantity + line.quantity, 0)
      if (quantityInCart >= action.product.stock) {
        setNotice(action.product.stock === 0 ? 'This piece is currently out of stock.' : `Only ${action.product.stock} available.`)
        setDialog(null)
      } else {
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
      }
    } else {
      setNotice('You are browsing as a customer preview.')
      setDialog(null)
      if (loginDestination) go(loginDestination)
      setLoginDestination(null)
    }
  }

  const submitCheckout = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const quantities = new Map<number, number>()
    cart.forEach((line) => quantities.set(line.product.id, (quantities.get(line.product.id) ?? 0) + line.quantity))
    const unavailableId = [...quantities].find(([id, quantity]) => {
      const currentProduct = products.find((product) => product.id === id)
      return !currentProduct?.published || !currentProduct || currentProduct.stock < quantity
    })?.[0]
    if (unavailableId !== undefined) {
      const unavailableProduct = products.find((product) => product.id === unavailableId)
      setNotice(`${unavailableProduct?.name ?? 'A piece'} no longer has enough stock. Update your bag to continue.`)
      return
    }
    setCatalog((current) => ({
      ...current,
      products: current.products.map((product) => {
        const purchased = quantities.get(product.id) ?? 0
        return purchased ? { ...product, stock: product.stock - purchased } : product
      }),
    }))
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
        <a className="brand" href="/" onClick={handleLink('/')} aria-label="Ember home">
          <img
            className="brand-logo"
            src="/emberlogo-transparent.png"
            alt="Ember — Warmth, thoughtfully styled"
          />
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <a href="/" onClick={handleLink('/')}>Home</a>
          <a href="/shop" onClick={handleLink('/shop')}>Shop <span className="nav-caret">⌄</span></a>
          <a href="/collections" onClick={handleLink('/collections')}>Collections</a>
          <a href="/about" onClick={handleLink('/about')}>Our story</a>
        </nav>
        <div className="header-actions">
          <button
            className={`icon-button search-toggle ${searchOpen || routeQuery ? 'is-active' : ''}`}
            aria-label={searchOpen || routeQuery ? 'Close search' : 'Search products'}
            onClick={() => {
              if (searchOpen || routeQuery) {
                setSearchOpen(false)
                setSearchDraft('')
                if (routeQuery) go('/shop')
              } else {
                setSearchDraft('')
                setSearchOpen(true)
              }
            }}
          >
            <Icon name={searchOpen || routeQuery ? 'close' : 'search'} />
          </button>
          <button
            className="icon-button"
            aria-label={customerPreview ? 'Open your account' : 'Sign in'}
            onClick={() => customerPreview ? go('/account') : requestLogin('customer', '/account')}
          >
            <Icon name="user" />
          </button>
          <button
            className={`icon-button ${favorites.length ? 'has-favorite' : ''}`}
            aria-label={customerPreview ? `Wishlist, ${favorites.length} saved` : 'Sign in to use wishlist'}
            onClick={() => customerPreview ? go('/wishlist') : requestLogin('customer', '/wishlist')}
          >
            <Icon name="heart" filled={favorites.length > 0} />
          </button>
          <button
            className="icon-button bag-button"
            aria-label={customerPreview ? `Shopping bag, ${cartCount} items` : 'Sign in to use shopping bag'}
            onClick={() => customerPreview ? go('/cart') : requestLogin('customer', '/cart')}
          >
            <Icon name="bag" />
            <span className="bag-count">{cartCount}</span>
          </button>
          <button className="icon-button mobile-menu" aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen((open) => !open)}>
            <Icon name={mobileMenuOpen ? 'close' : 'menu'} />
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          <a href="/" onClick={handleLink('/')}>Home</a>
          <a href="/shop" onClick={handleLink('/shop')}>Shop all</a>
          <a href="/collections" onClick={handleLink('/collections')}>Collections</a>
          <a href="/about" onClick={handleLink('/about')}>Our story</a>
          <a href="/contact" onClick={handleLink('/contact')}>Contact</a>
        </nav>
      )}

      {(searchOpen || Boolean(routeQuery)) && (
        <form
          className="search-bar"
          onSubmit={(event) => {
            event.preventDefault()
            const search = searchDraft.trim()
            setSearchDraft(search)
            go(search ? `/shop?q=${encodeURIComponent(search)}` : '/shop')
          }}
        >
          <Icon name="search" size={18} />
          <input
            autoFocus
            aria-label="Search the collection"
            placeholder="Search the collection..."
            value={searchOpen ? searchDraft : routeQuery}
            onChange={(event) => setSearchDraft(event.target.value)}
          />
          {(searchOpen ? searchDraft : routeQuery) && <button type="button" onClick={() => { setSearchOpen(true); setSearchDraft('') }}>Clear</button>}
          <button type="submit" aria-label="Search">Search</button>
        </form>
      )}

      {notice && (
        <button className="preview-notice" onClick={() => setNotice('')} aria-label="Dismiss preview notice">
          {notice} <Icon name="close" size={15} />
        </button>
      )}

      {route === '/' && <HomePage categories={categories} onNavigate={go} />}
      {route === '/collections' && <CollectionsPage categories={categories} onNavigate={go} />}

      {route.startsWith('/product/') && !detailProduct && (
        <section className="store-page page-empty">
          <h1>We couldn’t find that piece.</h1>
          <p>It may have been removed from the collection.</p>
          <a className="button button-clay" href="/shop" onClick={handleLink('/shop')}>Return to the shop</a>
        </section>
      )}

      {route === '/shop' && <ShopPage
        products={visibleProducts}
        categories={categories.map((item) => item.name)}
        selectedCategory={category}
        onCategoryChange={(selected) => {
          go(selected === 'All' ? `/shop${query ? `?q=${encodeURIComponent(query)}` : ''}` : `/shop?category=${encodeURIComponent(selected)}${query ? `&q=${encodeURIComponent(query)}` : ''}`)
        }}
        sort={sort}
        onSortChange={setSort}
        favorites={favorites}
        onNavigate={go}
        onToggleFavorite={toggleFavorite}
        onOpenProduct={openProduct}
      />}

      {route === '/about' && <AboutPage onNavigate={go} />}

      {route === '/contact' && <ContactPage onSubmit={(event) => {
        event.preventDefault()
        setNotice('Thanks for reaching out. Your message is saved in this preview only.')
        event.currentTarget.reset()
      }} />}

      {route.startsWith('/product/') && detailProduct && <ProductDetailPage
        key={detailProduct.id}
        product={detailProduct}
        favorite={favorites.includes(detailProduct.id)}
        onAddToCart={(size) => addToCart(detailProduct, detailProduct.color, size)}
        onToggleFavorite={() => toggleFavorite(detailProduct)}
      />}

      {route === '/wishlist' && <WishlistPage
        signedIn={customerPreview}
        products={visibleProducts}
        onSignIn={() => requestLogin('customer', '/wishlist')}
        onNavigate={go}
        onRemove={toggleFavorite}
      />}

      {route === '/account' && <ProfilePage
        signedIn={customerPreview}
        favoriteCount={favorites.length}
        cartCount={cartCount}
        onSignIn={() => requestLogin('customer', '/account')}
        onSignOut={() => {
          setCustomerPreview(false)
          setFavorites([])
          setCart([])
          setDiscountApplied(false)
          setCheckoutComplete(false)
          go('/')
        }}
      />}

      {(route === '/cart' || route === '/checkout') && <CartPage
        isCheckout={route === '/checkout'}
        signedIn={customerPreview}
        orderComplete={checkoutComplete}
        cart={cart}
        subtotal={subtotal}
        total={total}
        discountApplied={discountApplied}
        onSignIn={() => requestLogin('customer', '/cart')}
        onNavigate={go}
        onChangeQuantity={changeQuantity}
        onToggleDiscount={() => setDiscountApplied((applied) => !applied)}
        onCheckout={submitCheckout}
        onResetCheckout={() => setCheckoutComplete(false)}
      />}

      {route === '/' && <section className="products-section" id="shop">
        <div className="section-heading">
          <div><p className="eyebrow"><span /> FIND YOUR EVERYDAY</p><h2>Little things, <em>lasting feeling.</em></h2></div>
          <a className="text-link" href="/shop" onClick={handleLink('/shop')}>View all pieces <Icon name="arrow" size={17} /></a>
        </div>
        <ProductGrid products={visibleProducts} favorites={favorites} onNavigate={go} onToggleFavorite={toggleFavorite} onOpenProduct={openProduct} />
      </section>}

      {route === '/' && <section className="brand-note">
        <span className="brand-note-mark" aria-hidden="true">e</span>
        <p>Fewer things. <em>More feeling.</em></p>
        <span>Objects chosen to stay, not just to be seen.</span>
      </section>}

      <footer className="store-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="footer-brand-lockup">
              <a className="footer-brand-logo" href="/" onClick={handleLink('/')} aria-label="Ember home">
                <img src="/emberlogo2.png" alt="" />
              </a>
              <span className="footer-brand-name">EMBER</span>
            </div>
            <p>Make room for a little more feeling.</p>
          </div>
          <div className="footer-links"><strong>Explore</strong><a href="/shop" onClick={handleLink('/shop')}>Shop all</a><a href="/collections" onClick={handleLink('/collections')}>Collections</a><a href="/about" onClick={handleLink('/about')}>Our story</a></div>
          <div className="footer-links"><strong>Here to help</strong><a href="/contact" onClick={handleLink('/contact')}>Shipping & returns</a><a href="/contact" onClick={handleLink('/contact')}>Get in touch</a><a href="/contact" onClick={handleLink('/contact')}>FAQs</a></div>
          <div className="newsletter">
            <strong>A note from home</strong>
            <p>New things, thoughtful stories, and the occasional little treat.</p>
            <form onSubmit={(event) => { event.preventDefault(); setNotice('Thanks for joining our little corner of the internet.') }}>
              <label className="visually-hidden" htmlFor="newsletter-email">Newsletter email address</label>
              <input id="newsletter-email" type="email" placeholder="Your email address" required />
              <button aria-label="Subscribe to newsletter"><Icon name="arrow" size={18} /></button>
            </form>
          </div>
        </div>
        <div className="footer-bottom" id="footer">
          <span>© 2025 Ember Home. Made for the moments in between.</span>
          <a href="/contact" onClick={handleLink('/contact')}>Privacy · Terms</a>
        </div>
      </footer>

      {dialog === 'login' && (
        <div className="dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setDialog(null)}>
          <section className="dialog-card login-dialog" role="dialog" aria-modal="true" aria-labelledby="login-title">
            <button className="dialog-close" onClick={() => setDialog(null)} aria-label="Close"><Icon name="close" /></button>
            <img className="dialog-logo" src="/emberlogo-transparent.png" alt="Ember" />
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
            <img src={activeProduct.images[0]} alt={activeProduct.name} />
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
              <button className="button button-outline full-width" onClick={() => { setDialog(null); go(`/product/${activeProduct.id}`) }}>View full details</button>
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
              <div className="empty-cart"><Icon name="bag" size={34} /><h3>Your bag is taking a little rest.</h3><p>Find something you’d love to live with.</p><button className="button button-clay" onClick={() => { setDialog(null); go('/shop') }}>Explore the collection <Icon name="arrow" size={17} /></button></div>
            ) : (
              <>
                <div className="cart-lines">
                  {cart.map((line, index) => (
                    <div className="cart-line" key={`${line.product.id}-${line.color}-${line.size}`}>
                      <img src={line.product.images[0]} alt="" />
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

    </main>
  )
}

export default Storefront
