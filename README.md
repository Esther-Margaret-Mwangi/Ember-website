# Ember

Ember is a responsive home-decor storefront and business dashboard preview built with React, TypeScript, and Vite.

## Run locally

```sh
npm install
npm run dev
```

Use `npm run lint` to lint the project and `npm run build` to type-check and create the production bundle.

## Preview features

- Browse and filter the home collection, search products, choose product options, and sort by price.
- Open the sign-in preview to explore customer-only wishlist and bag interactions.
- View sample order-history rows in the customer account preview.
- Explore the separate Ember Studio dashboard preview, including sample sales reporting, product stock controls, promotions, and order status changes.
- Try the `AUTUMN10` preview discount in the shopping bag.

## Important limitations

This repository currently contains only a client-side application. Sign-in forms are previews and do not authenticate users or create accounts. Customer and admin roles are not secured. Cart, wishlist, stock, and dashboard changes are in-memory demo state, not durable customer or business records.

Checkout does not contact a payment provider or submit an order. Stock is not reserved or decremented by checkout, so this preview does not prevent concurrent purchases of the last item. A production launch needs a trusted backend with authorization, persistent data, atomic inventory reservations with expiration/release behavior, order processing, and a payment provider's sandbox integration before live payments are enabled.

Product photography is loaded from Unsplash image URLs and requires an internet connection.
