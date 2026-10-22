import type { FormEvent } from 'react'
import type { CartLine } from '../../domain/cart'
import { StorefrontIcon } from '../../../../shared/components/StorefrontIcon'

export default function CartPage({
  isCheckout,
  signedIn,
  orderComplete,
  cart,
  subtotal,
  total,
  discountApplied,
  onSignIn,
  onNavigate,
  onChangeQuantity,
  onToggleDiscount,
  onCheckout,
  onResetCheckout,
}: {
  isCheckout: boolean
  signedIn: boolean
  orderComplete: boolean
  cart: CartLine[]
  subtotal: number
  total: number
  discountApplied: boolean
  onSignIn: () => void
  onNavigate: (destination: string) => void
  onChangeQuantity: (index: number, amount: number) => void
  onToggleDiscount: () => void
  onCheckout: (event: FormEvent<HTMLFormElement>) => void
  onResetCheckout: () => void
}) {
  return (
    <section className="store-page cart-page">
      <p className="eyebrow"><span /> YOUR BAG</p>
      <h1>{isCheckout ? 'A little closer to home.' : 'Your shopping bag.'}</h1>
      {!signedIn ? (
        <div className="page-empty"><p>Sign in to use your shopping bag.</p><button className="button button-clay" onClick={onSignIn}>Sign in to continue</button></div>
      ) : orderComplete ? (
        <div className="page-empty"><h2>Thank you for your order.</h2><p>Your order has been received.</p><button className="button button-clay" onClick={() => { onResetCheckout(); onNavigate('/shop') }}>Continue exploring</button></div>
      ) : cart.length === 0 ? (
        <div className="page-empty"><p>Your bag is taking a little rest.</p><a className="button button-clay" href="/shop" onClick={(event) => { event.preventDefault(); onNavigate('/shop') }}>Explore the collection</a></div>
      ) : (
        <div className="cart-page-layout">
          <div className="cart-lines">{cart.map((line, index) => (
            <div className="cart-line" key={`${line.product.id}-${line.color}-${line.size}`}>
              <img src={line.product.images[0]} alt="" />
              <div className="cart-line-content">
                <div className="cart-line-top"><div><h3>{line.product.name}</h3><p>{line.color} · {line.size}</p></div><strong>${(line.product.price * line.quantity).toFixed(2)}</strong></div>
                <div className="quantity-control">
                  <button onClick={() => onChangeQuantity(index, -1)} aria-label={`Decrease ${line.product.name} quantity`}><StorefrontIcon name="minus" size={14} /></button>
                  <span>{line.quantity}</span>
                  <button onClick={() => onChangeQuantity(index, 1)} aria-label={`Increase ${line.product.name} quantity`}><StorefrontIcon name="plus" size={14} /></button>
                </div>
              </div>
            </div>
          ))}</div>
          <div className="cart-page-summary">
            <button className={`discount-code ${discountApplied ? 'applied' : ''}`} onClick={onToggleDiscount}>
              <span><strong>AUTUMN10</strong><small>{discountApplied ? '10% discount applied' : 'Add your discount code'}</small></span>
              <span>{discountApplied ? 'Applied ✓' : 'Add code +'}</span>
            </button>
            <div className="cart-summary">
              <div><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div>
              {discountApplied && <div><span>Autumn discount</span><strong>−${(subtotal * .1).toFixed(2)}</strong></div>}
              <div className="total-row"><span>Total</span><strong>${total.toFixed(2)}</strong></div>
            </div>
            {isCheckout ? (
              <form className="checkout-form" onSubmit={onCheckout}>
                <label>Email address<input type="email" required autoComplete="email" /></label>
                <label>Shipping address<input required autoComplete="street-address" /></label>
                <label>City<input required autoComplete="address-level2" /></label>
                <button className="button button-clay full-width" type="submit">Place order <StorefrontIcon name="arrow" size={17} /></button>
              </form>
            ) : (
              <button className="button button-clay full-width" onClick={() => onNavigate('/checkout')}>Continue to checkout <StorefrontIcon name="arrow" size={17} /></button>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
