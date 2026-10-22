export type CatalogProduct = {
  id: number
  sku: string
  name: string
  category: string
  price: number
  images: string[]
  color: string
  badge?: string
  stock: number
  published: boolean
  description: string
}

export type CatalogCategory = {
  id: string
  name: string
  image: string
}

export type CatalogData = {
  products: CatalogProduct[]
  categories: CatalogCategory[]
}

export const initialCatalog: CatalogData = {
  categories: [
    { id: 'lighting', name: 'Lighting', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=640&q=85' },
    { id: 'textiles', name: 'Textiles', image: 'https://images.unsplash.com/photo-1600369671236-e74521d4b6ad?auto=format&fit=crop&w=640&q=85' },
    { id: 'decor', name: 'Decor', image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=640&q=85' },
    { id: 'atmosphere', name: 'Atmosphere', image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=640&q=85' },
  ],
  products: [
    {
      id: 1, sku: 'ATM-001', name: 'The Sunday Candle', category: 'Atmosphere', price: 38,
      images: ['https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=85'],
      color: 'Amber', badge: 'Bestseller', stock: 8, published: true,
      description: 'A considered piece, made to bring a little warmth to your everyday. Designed with care and chosen to stay.',
    },
    {
      id: 2, sku: 'DEC-014', name: 'Sculpted Stoneware Vase', category: 'Decor', price: 84,
      images: ['https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=900&q=85'],
      color: 'Sand', badge: 'New', stock: 3, published: true,
      description: 'A considered piece, made to bring a little warmth to your everyday. Designed with care and chosen to stay.',
    },
    {
      id: 3, sku: 'TEX-008', name: 'Cloud Knit Throw', category: 'Textiles', price: 112,
      images: ['https://images.unsplash.com/photo-1600369671236-e74521d4b6ad?auto=format&fit=crop&w=900&q=85'],
      color: 'Oat', stock: 0, published: true,
      description: 'A considered piece, made to bring a little warmth to your everyday. Designed with care and chosen to stay.',
    },
    {
      id: 4, sku: 'LGT-003', name: 'Arc Table Lamp', category: 'Lighting', price: 146,
      images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85'],
      color: 'Natural', stock: 24, published: true,
      description: 'A considered piece, made to bring a little warmth to your everyday. Designed with care and chosen to stay.',
    },
    {
      id: 5, sku: 'DEC-015', name: 'Hand-thrown Bud Vase', category: 'Decor', price: 58,
      images: ['https://images.unsplash.com/photo-1612196808214-b7e1d6145a8c?auto=format&fit=crop&w=900&q=85'],
      color: 'Terracotta', stock: 12, published: true,
      description: 'A considered piece, made to bring a little warmth to your everyday. Designed with care and chosen to stay.',
    },
    {
      id: 6, sku: 'TEX-009', name: 'Linen Cushion Cover', category: 'Textiles', price: 46,
      images: ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=900&q=85'],
      color: 'Flax', stock: 12, published: true,
      description: 'A considered piece, made to bring a little warmth to your everyday. Designed with care and chosen to stay.',
    },
    {
      id: 7, sku: 'ATM-002', name: 'Evening Glow Candle', category: 'Atmosphere', price: 32,
      images: ['https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=900&q=85'],
      color: 'Spiced Fig', stock: 12, published: true,
      description: 'A considered piece, made to bring a little warmth to your everyday. Designed with care and chosen to stay.',
    },
    {
      id: 8, sku: 'DEC-016', name: 'Gathering Bowl', category: 'Decor', price: 72,
      images: ['https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&q=85'],
      color: 'Warm White', stock: 12, published: true,
      description: 'A considered piece, made to bring a little warmth to your everyday. Designed with care and chosen to stay.',
    },
  ],
}
