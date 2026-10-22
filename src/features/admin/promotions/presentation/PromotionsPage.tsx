export type Promotion = {
  code: string
  title: string
  message: string
  discount: number
}

export default function PromotionsPage({
  promotion,
  onEdit,
  onCreate,
}: {
  promotion: Promotion
  onEdit: () => void
  onCreate: () => void
}) {
  return (
    <div className="promo-grid">
      <article className="promo-card active-promo"><span className="promo-status">ACTIVE PREVIEW</span><span className="promo-code">{promotion.code}</span><h2>{promotion.title}</h2><p>{promotion.message}</p><div className="promo-meta"><span>Discount</span><strong>{promotion.discount}% off</strong><span>Uses</span><strong>38 / unlimited</strong><span>Ends</span><strong>Oct 31, 2026</strong></div><button className="admin-secondary-button" onClick={onEdit}>Edit promotion</button></article>
      <button className="new-promo-card" onClick={onCreate}><span>+</span><strong>Create a promotion</strong><small>Share a little something with your customers.</small></button>
    </div>
  )
}
