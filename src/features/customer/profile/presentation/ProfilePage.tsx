export default function ProfilePage({
  signedIn,
  favoriteCount,
  cartCount,
  onSignIn,
  onSignOut,
}: {
  signedIn: boolean
  favoriteCount: number
  cartCount: number
  onSignIn: () => void
  onSignOut: () => void
}) {
  return (
    <section className="store-page account-page">
      <p className="eyebrow"><span /> YOUR LITTLE CORNER</p>
      <h1>Hello, home lover.</h1>
      {!signedIn ? (
        <div className="page-empty"><p>Sign in to view your saved pieces and order history.</p><button className="button button-clay" onClick={onSignIn}>Sign in to continue</button></div>
      ) : (
        <>
          <p className="page-lead">This customer session is a local preview. Saved pieces only last while this page is open.</p>
          <div className="account-stats"><div><strong>{favoriteCount}</strong><span>Saved pieces</span></div><div><strong>{cartCount}</strong><span>In your bag</span></div></div>
          <h2 className="saved-title">Sample order history</h2>
          <div className="sample-order-list"><div><span><strong>EM-2079</strong><small>Oct 18, 2026 · 2 pieces</small></span><b>Delivered</b></div><div><span><strong>EM-2051</strong><small>Oct 04, 2026 · 1 piece</small></span><b>Delivered</b></div></div>
          <p className="preview-disclaimer">Sample account details only. Orders are not connected to checkout.</p>
          <button className="button button-outline" onClick={onSignOut}>Sign out of preview</button>
        </>
      )}
    </section>
  )
}
