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
    { id: 'tableware', name: 'Tableware', image: 'https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=640&q=85' },
    { id: 'rugs', name: 'Rugs', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=640&q=85' },
    { id: 'wall-art', name: 'Wall Art', image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=640&q=85' },
    { id: 'furniture', name: 'Furniture', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=640&q=85' },
    { id: 'planters', name: 'Planters', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=640&q=85' },
    { id: 'mirrors', name: 'Mirrors', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=640&q=85' },
    { id: 'storage', name: 'Storage', image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=640&q=85' },
    { id: 'bedding', name: 'Bedding', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=640&q=85' },
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
      images: ['https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=900&q=85'],
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
    {
      id: 9, sku: 'TAB-001', name: 'Everyday Stoneware Set', category: 'Tableware', price: 68,
      images: ['https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=900&q=85'],
      color: 'Chalk', badge: 'New', stock: 14, published: true,
      description: 'A quietly beautiful stoneware set for slow breakfasts, shared suppers, and everyday rituals.',
    },
    {
      id: 10, sku: 'RUG-001', name: 'Woven Meadow Rug', category: 'Rugs', price: 185,
      images: ['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85'],
      color: 'Natural', stock: 7, published: true,
      description: 'A softly textured foundation that brings warmth and an easy sense of calm to a room.',
    },
    {
      id: 11, sku: 'ART-001', name: 'Still Life Framed Print', category: 'Wall Art', price: 76,
      images: ['https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=900&q=85'],
      color: 'Earth tones', stock: 9, published: true,
      description: 'An expressive art print in a warm timber frame, chosen to make a wall feel more personal.',
    },
    {
      id: 12, sku: 'FUR-001', name: 'Low Oak Side Table', category: 'Furniture', price: 228,
      images: ['https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=85'],
      color: 'Natural Oak', stock: 5, published: true,
      description: 'A simple, considered side table with warm oak grain and room for the little things you reach for.',
    },
    {
      id: 13, sku: 'PLT-001', name: 'Hand-finished Clay Planter', category: 'Planters', price: 44,
      images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=85'],
      color: 'Terracotta', stock: 16, published: true,
      description: 'A hand-finished clay planter that gives leafy corners a grounded, natural home.',
    },
    {
      id: 14, sku: 'MIR-001', name: 'Soft Arch Wall Mirror', category: 'Mirrors', price: 138,
      images: ['https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=85'],
      color: 'Aged Brass', stock: 6, published: true,
      description: 'A gentle arch and warm frame bring a little more light and shape to your everyday spaces.',
    },
    {
      id: 15, sku: 'STO-001', name: 'Seagrass Keepsake Basket', category: 'Storage', price: 52,
      images: ['https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=900&q=85'],
      color: 'Natural', stock: 11, published: true,
      description: 'A useful, handwoven place for blankets, toys, and all the things that make a home lived in.',
    },
    {
      id: 16, sku: 'BED-001', name: 'Washed Linen Duvet Cover', category: 'Bedding', price: 164,
      images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=85'],
      color: 'Soft White', stock: 8, published: true,
      description: 'Relaxed washed linen with a soft hand, made for unhurried mornings and restful nights.',
    },
    {
      id: 17, sku: 'LGT-004', name: 'Mushroom Ceramic Lamp', category: 'Lighting', price: 128,
      images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85'],
      color: 'Warm Ivory', badge: 'New', stock: 10, published: true,
      description: 'A softly sculpted lamp that casts a warm pool of light across a bedside or reading nook.',
    },
    {
      id: 18, sku: 'TEX-010', name: 'Textured Bouclé Cushion', category: 'Textiles', price: 54,
      images: ['https://images.unsplash.com/photo-1600369671236-e74521d4b6ad?auto=format&fit=crop&w=900&q=85'],
      color: 'Oatmeal', stock: 18, published: true,
      description: 'A tactile bouclé cushion in a gentle neutral, made for layering on a favorite chair or sofa.',
    },
    {
      id: 19, sku: 'DEC-017', name: 'Rippled Ceramic Catchall', category: 'Decor', price: 42,
      images: ['https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=900&q=85'],
      color: 'Soft Sand', stock: 15, published: true,
      description: 'A small, sculptural dish for keys, jewelry, and the everyday things worth keeping close.',
    },
    {
      id: 20, sku: 'ATM-003', name: 'Cedar & Fig Room Mist', category: 'Atmosphere', price: 36,
      images: ['https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=900&q=85'],
      color: 'Cedarwood', stock: 20, published: true,
      description: 'A fresh, grounding room mist with cedar and ripe fig notes for a softer-feeling space.',
    },
    {
      id: 21, sku: 'TAB-002', name: 'Hand-glazed Serving Platter', category: 'Tableware', price: 82,
      images: ['https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=900&q=85'],
      color: 'Cream', stock: 12, published: true,
      description: 'An easy-to-love serving platter with a hand-glazed finish for slow lunches and shared suppers.',
    },
    {
      id: 22, sku: 'RUG-002', name: 'Soft Step Wool Runner', category: 'Rugs', price: 142,
      images: ['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85'],
      color: 'Dune', stock: 6, published: true,
      description: 'A softly woven runner that brings a little warmth and texture to hallways and bedside floors.',
    },
    {
      id: 23, sku: 'PLT-002', name: 'Speckled Stone Planter', category: 'Planters', price: 48,
      images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=85'],
      color: 'Moss', stock: 14, published: true,
      description: 'A softly speckled planter with a calm, natural finish for herbs, leafy greens, and small trees.',
    },
    {
      id: 24, sku: 'BED-002', name: 'Linen Pillowcase Pair', category: 'Bedding', price: 68,
      images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=85'],
      color: 'Warm White', stock: 13, published: true,
      description: 'A pair of breathable washed-linen pillowcases that soften beautifully with every sleep.',
    },
  ],
}
