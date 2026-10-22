import type { FormEvent } from 'react'
import { StorefrontIcon } from '../../../shared/components/StorefrontIcon'

export default function ContactPage({ onSubmit }: { onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return (
    <section className="store-page contact-page">
      <p className="eyebrow"><span /> HERE TO HELP</p>
      <h1>Let’s talk about home.</h1>
      <p className="page-lead">Questions about a piece, an order, or finding the right thing? Send us a note.</p>
      <form className="contact-form" onSubmit={onSubmit}>
        <label>Your name<input name="name" required autoComplete="name" /></label>
        <label>Email address<input name="email" type="email" required autoComplete="email" /></label>
        <label>What can we help with?<select name="topic" defaultValue="Product question"><option>Product question</option><option>Order support</option><option>Shipping and returns</option><option>Something else</option></select></label>
        <label>Your message<textarea name="message" rows={5} required /></label>
        <button className="button button-clay" type="submit">Send your note <StorefrontIcon name="arrow" size={17} /></button>
      </form>
    </section>
  )
}
