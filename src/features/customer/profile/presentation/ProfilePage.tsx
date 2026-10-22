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
          <p className="page-lead">Your saved pieces and shopping bag, all in one place.</p>
          <div className="account-stats"><div><strong>{favoriteCount}</strong><span>Saved pieces</span></div><div><strong>{cartCount}</strong><span>In your bag</span></div></div>
          <h2 className="saved-title">Order history</h2>
          <p className="page-lead">Your orders will appear here.</p>
          <button className="button button-outline" onClick={onSignOut}>Sign out</button>
        </>
      )}
    </section>
  )
}
