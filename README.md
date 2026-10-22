# Ember

Ember is a responsive home-decor storefront and business dashboard preview built with React, TypeScript, and Vite.

## Run locally

```sh
npm install
npm run dev
```

Use `npm run lint` to lint the project and `npm run build` to type-check and create the production bundle.

## Preview features

- Browse the home page, shop, collections, story, contact, product-detail, wishlist, account, cart, and demo-checkout pages.
- Search products, filter by category, sort by price, choose product options, and add favorites or pieces to the bag.
- Open the sign-in preview to explore customer-only wishlist and bag interactions.
- View sample order-history rows in the customer account page.
- Explore the Ember Studio dashboard at `/admin` after choosing the team preview sign-in. Dashboard sections have direct routes and include sample sales reporting, product and stock controls, category management, promotions, and order status changes.
- Create or edit products, add up to five images from a device (or use a supported mobile camera picker), change stock, and publish or hide products. The published catalog is shared between the dashboard and storefront in the same browser.
- Try the `AUTUMN10` preview discount in the shopping bag.

## Important limitations

This repository currently contains only a client-side application. Catalog products, categories, images, and stock are saved in IndexedDB in the current browser profile; they are not sent to a server or shared with other browsers or devices. Sign-in forms are previews and do not authenticate users or create accounts, and customer and admin roles are not secured. Cart, wishlist, promotions, and sample dashboard reporting are preview state, not durable customer or business records.

Checkout does not contact a payment provider or submit an order. Demo checkout validates and decrements local catalog stock, but it does not reserve inventory across customers or browsers and cannot prevent concurrent purchases of the last item. A production launch needs a trusted backend with authorization, shared persistent data, atomic inventory reservations with expiration/release behavior, order processing, and a payment provider's sandbox integration before live payments are enabled.

Product photography is loaded from Unsplash image URLs and requires an internet connection.
