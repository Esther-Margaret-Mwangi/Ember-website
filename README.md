# Ember

Ember is a responsive home-decor ecommerce experience built around thoughtful product discovery and simple, considered design. It brings a customer storefront and a companion store-management dashboard together in one React application.

The storefront lets visitors explore home accessories by category, search and sort the catalog, and view product details. A separate admin area demonstrates everyday catalog and operations workflows, including product editing, inventory adjustments, category management, promotions, order statuses, and sales reporting.

> **Project status:** Customer accounts, checkout, and admin tools are interactive demonstrations backed by browser-local state; there is no production server or payment integration.

## Features

### Customer storefront

- Responsive home, shop, collections, product detail, story, and contact pages.
- Browse a catalog of home-decor products across 12 categories.
- Search products and filter by category; sort products by price.
- View product photography, descriptions, colors, availability, and size options.
- Use a browser-local wishlist and shopping bag after the simulated sign-in flow.
- Try the demo checkout experience and the `AUTUMN10` promotion code.

### Store management

- Add and edit products, update product details, and publish or hide listings.
- Add product photos from a device, including supported mobile camera pickers.
- Create and manage catalog categories.
- Adjust stock and see low-stock and out-of-stock items.
- Change sample order statuses and edit the displayed promotion.
- View dashboard and analytics screens, and download a sample sales report as CSV.

### Architecture and interface

- Feature-oriented React and TypeScript structure, with route composition in `src/app/`.
- Shared catalog access between storefront and admin features.
- Responsive layouts for desktop and mobile screen widths.
- Catalog data and images persist in the current browser using IndexedDB.

## Technology

- React 19
- TypeScript
- Vite
- CSS
- IndexedDB for browser-local catalog persistence

## Run locally

Requirements: Node.js and npm.

```sh
npm install
npm run dev
```

Vite prints the local development URL when the server starts.

Other available commands:

```sh
npm run lint
npm run build
npm run preview
```

`npm run build` type-checks the application and creates a production bundle in `dist/`. `npm run preview` serves that built bundle locally.

## Project structure

```text
src/
  app/                  # Route selection and application composition
  features/
    about/
    admin/              # Dashboard, products, categories, orders, inventory, promotions, analytics
    catalog/            # Catalog domain, context, and IndexedDB adapter
    collections/
    contact/
    customer/            # Profile, wishlist, and cart
    home/
    product-detail/
    shop/
    storefront/          # Storefront composition and shared storefront styles
  shared/                # Reusable components and global styles
```

## Demo behavior and limitations

- Sign-in is simulated in the browser. It does not create or authenticate accounts, and the admin area is not protected by server-side authorization.
- Catalog, category, and stock changes are saved to IndexedDB in the current browser profile. They are not shared across devices or users. Clearing site data removes them.
- Wishlist, cart, promotion, order, and account activity are not connected to a customer or business database. Orders and analytics shown in the dashboard are sample data.
- Checkout does not contact a payment provider or create a real order. It does not provide an inventory reservation system, so it cannot prevent concurrent purchases of the last item.
- Product photography is loaded from Unsplash and requires an internet connection.

A production commerce system would need a trusted backend, authenticated and authorized accounts, shared persistent data, real order processing, atomic inventory reservations, and a payment provider integration before accepting live payments.
