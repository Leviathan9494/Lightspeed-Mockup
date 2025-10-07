const server = Bun.serve({
  port: 3001,
  hostname: '0.0.0.0', // Bind to all interfaces for accessibility
  fetch(req) {
    const url = new URL(req.url);
    
    // Enable CORS for frontend communication
    const headers = new Headers({
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers });
    }

    // API Routes
    if (url.pathname === '/api/auth/login' && req.method === 'POST') {
      return handleLogin(req, headers);
    }

    if (url.pathname === '/api/auth/pin' && req.method === 'POST') {
      return handlePin(req, headers);
    }

    if (url.pathname === '/api/categories' && req.method === 'GET') {
      return handleGetCategories(headers);
    }

    if (url.pathname === '/api/inventory' && req.method === 'GET') {
      return handleGetInventory(req, headers, url);
    }
    if (url.pathname === '/api/inventory/count' && req.method === 'GET') {
      return handleGetInventoryCount(headers, url);
    }

    // Default response
    headers.set('Content-Type', 'application/json');
    return new Response(JSON.stringify({ message: 'Lightspeed Mockapp API' }), { 
      status: 200, 
      headers 
    });
  },
});

// Store temporary sessions for PIN validation
const tempSessions = new Map<string, { username: string; timestamp: number }>();

// Mock login handler
async function handleLogin(req: Request, headers: Headers) {
  const body = await req.json() as { username: string; password: string };
  const { username, password } = body;

  // Mock authentication - replace with real authentication logic
  if (username === 'admin' && password === 'password') {
    // Simulate timeout case requiring PIN (you can add conditions here)
    const requiresPin = Math.random() > 0.5; // 50% chance for demo
    
    if (requiresPin) {
      const sessionId = `session_${Date.now()}_${Math.random()}`;
      tempSessions.set(sessionId, { username, timestamp: Date.now() });
      
      headers.set('Content-Type', 'application/json');
      return new Response(JSON.stringify({ 
        success: true, 
        requiresPin: true,
        sessionId,
        message: 'PIN required for authentication' 
      }), { 
        status: 200, 
        headers 
      });
    } else {
      headers.set('Content-Type', 'application/json');
      return new Response(JSON.stringify({ 
        success: true, 
        token: 'mock-jwt-token',
        user: { id: 1, username: 'admin', role: 'admin' }
      }), { 
        status: 200, 
        headers 
      });
    }
  }

  headers.set('Content-Type', 'application/json');
  return new Response(JSON.stringify({ 
    success: false, 
    message: 'Invalid credentials' 
  }), { 
    status: 401, 
    headers 
  });
}

// Mock PIN handler
async function handlePin(req: Request, headers: Headers) {
  const body = await req.json() as { sessionId: string; pin: string };
  const { sessionId, pin } = body;

  const session = tempSessions.get(sessionId);
  if (!session) {
    headers.set('Content-Type', 'application/json');
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Invalid or expired session' 
    }), { 
      status: 401, 
      headers 
    });
  }

  // Check session expiry (5 minutes)
  if (Date.now() - session.timestamp > 5 * 60 * 1000) {
    tempSessions.delete(sessionId);
    headers.set('Content-Type', 'application/json');
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Session expired' 
    }), { 
      status: 401, 
      headers 
    });
  }

  // Mock PIN validation (1234 for demo)
  if (pin === '1234') {
    tempSessions.delete(sessionId); // Clean up session
    headers.set('Content-Type', 'application/json');
    return new Response(JSON.stringify({ 
      success: true, 
      token: 'mock-jwt-token',
      user: { id: 1, username: session.username, role: 'admin' }
    }), { 
      status: 200, 
      headers 
    });
  }

  headers.set('Content-Type', 'application/json');
  return new Response(JSON.stringify({ 
    success: false, 
    message: 'Invalid PIN' 
  }), { 
    status: 401, 
    headers 
  });
}

// Mock inventory handler
// In-memory category tree (mock)
const categories = [
  {
    id: 'cannabis',
    name: 'Cannabis',
    subcategories: [
      { id: 'pre-rolled', name: 'Pre-Rolled' },
      { id: 'flower', name: 'Flower' },
      { id: 'edibles', name: 'Edibles' },
      { id: 'concentrates', name: 'Concentrates' },
    ],
  },
  {
    id: 'accessories',
    name: 'Accessories',
    subcategories: [
      { id: 'pipes', name: 'Pipes' },
      { id: 'papers', name: 'Papers' },
      { id: 'grinders', name: 'Grinders' },
    ],
  },
  {
    id: 'apparel',
    name: 'Apparel',
    subcategories: [
      { id: 'shirts', name: 'Shirts' },
      { id: 'hats', name: 'Hats' },
    ],
  },
];

function handleGetCategories(headers: Headers) {
  headers.set('Content-Type', 'application/json');
  return new Response(JSON.stringify({ success: true, data: categories }), {
    status: 200,
    headers,
  });
}

function getInventoryDataset() {
  return [
    { id: 1, name: 'OG Kush Pre-Roll', sku: 'PR001', price: 9.99, stock: 120, category: 'Cannabis', subcategory: 'Pre-Rolled' },
    { id: 2, name: 'Sativa Blend Pre-Roll', sku: 'PR002', price: 11.49, stock: 80, category: 'Cannabis', subcategory: 'Pre-Rolled' },
    { id: 3, name: 'Indica Dream Pre-Roll', sku: 'PR003', price: 10.49, stock: 95, category: 'Cannabis', subcategory: 'Pre-Rolled' },
    { id: 4, name: 'Hybrid Chill Pre-Roll', sku: 'PR004', price: 10.99, stock: 110, category: 'Cannabis', subcategory: 'Pre-Rolled' },
    { id: 5, name: 'CBD Balance Pre-Roll', sku: 'PR005', price: 8.99, stock: 140, category: 'Cannabis', subcategory: 'Pre-Rolled' },
    { id: 6, name: 'Lemon Haze Pre-Roll', sku: 'PR006', price: 11.99, stock: 70, category: 'Cannabis', subcategory: 'Pre-Rolled' },
    { id: 7, name: 'Purple Punch Pre-Roll', sku: 'PR007', price: 12.49, stock: 65, category: 'Cannabis', subcategory: 'Pre-Rolled' },
    { id: 8, name: 'Gorilla Glue Pre-Roll', sku: 'PR008', price: 11.25, stock: 85, category: 'Cannabis', subcategory: 'Pre-Rolled' },
    { id: 9, name: 'Sour Diesel Pre-Roll', sku: 'PR009', price: 12.10, stock: 50, category: 'Cannabis', subcategory: 'Pre-Rolled' },
    { id: 10, name: 'Wedding Cake Pre-Roll', sku: 'PR010', price: 12.75, stock: 42, category: 'Cannabis', subcategory: 'Pre-Rolled' },
    { id: 11, name: 'Indica Supreme Flower 3.5g', sku: 'FL001', price: 34.99, stock: 45, category: 'Cannabis', subcategory: 'Flower' },
    { id: 12, name: 'Hybrid Chill Flower 7g', sku: 'FL002', price: 64.99, stock: 25, category: 'Cannabis', subcategory: 'Flower' },
    { id: 13, name: 'Blue Dream Flower 3.5g', sku: 'FL003', price: 32.99, stock: 55, category: 'Cannabis', subcategory: 'Flower' },
    { id: 14, name: 'Pineapple Express Flower 3.5g', sku: 'FL004', price: 36.49, stock: 38, category: 'Cannabis', subcategory: 'Flower' },
    { id: 15, name: 'Gelato Flower 3.5g', sku: 'FL005', price: 37.99, stock: 41, category: 'Cannabis', subcategory: 'Flower' },
    { id: 16, name: 'Sunset Sherbet Flower 7g', sku: 'FL006', price: 69.99, stock: 22, category: 'Cannabis', subcategory: 'Flower' },
    { id: 17, name: 'Platinum OG Flower 3.5g', sku: 'FL007', price: 39.50, stock: 33, category: 'Cannabis', subcategory: 'Flower' },
    { id: 18, name: 'Jack Herer Flower 3.5g', sku: 'FL008', price: 35.49, stock: 47, category: 'Cannabis', subcategory: 'Flower' },
    { id: 19, name: 'Gummy Bears (THC) 100mg', sku: 'ED001', price: 19.99, stock: 200, category: 'Cannabis', subcategory: 'Edibles' },
    { id: 20, name: 'Chocolate Bar (THC) 250mg', sku: 'ED002', price: 29.99, stock: 60, category: 'Cannabis', subcategory: 'Edibles' },
    { id: 21, name: 'THC Peach Rings 150mg', sku: 'ED003', price: 21.49, stock: 150, category: 'Cannabis', subcategory: 'Edibles' },
    { id: 22, name: 'CBD Fruit Chews 200mg', sku: 'ED004', price: 24.99, stock: 120, category: 'Cannabis', subcategory: 'Edibles' },
    { id: 23, name: 'THC Honey Sticks 10x10mg', sku: 'ED005', price: 18.75, stock: 90, category: 'Cannabis', subcategory: 'Edibles' },
    { id: 24, name: 'Nano Shot Beverage 100mg', sku: 'ED006', price: 16.49, stock: 80, category: 'Cannabis', subcategory: 'Edibles' },
    { id: 25, name: 'Live Resin Cartridge 1g', sku: 'CN001', price: 49.99, stock: 40, category: 'Cannabis', subcategory: 'Concentrates' },
    { id: 26, name: 'Diamond Sauce 0.5g', sku: 'CN002', price: 54.99, stock: 18, category: 'Cannabis', subcategory: 'Concentrates' },
    { id: 27, name: 'Shatter Slab 1g', sku: 'CN003', price: 39.99, stock: 32, category: 'Cannabis', subcategory: 'Concentrates' },
    { id: 28, name: 'Crumble Wax 1g', sku: 'CN004', price: 37.49, stock: 44, category: 'Cannabis', subcategory: 'Concentrates' },
    { id: 29, name: 'Rosin Press Extract 1g', sku: 'CN005', price: 59.99, stock: 15, category: 'Cannabis', subcategory: 'Concentrates' },
    { id: 30, name: 'Full Spectrum Oil 1g', sku: 'CN006', price: 62.50, stock: 12, category: 'Cannabis', subcategory: 'Concentrates' },
    { id: 31, name: 'Glass Hand Pipe', sku: 'AC001', price: 24.99, stock: 70, category: 'Accessories', subcategory: 'Pipes' },
    { id: 32, name: 'Mini Spoon Pipe', sku: 'AC002', price: 14.99, stock: 85, category: 'Accessories', subcategory: 'Pipes' },
    { id: 33, name: 'Color Swirl Pipe', sku: 'AC003', price: 29.99, stock: 55, category: 'Accessories', subcategory: 'Pipes' },
    { id: 34, name: 'Quartz One Hitter', sku: 'AC004', price: 9.99, stock: 150, category: 'Accessories', subcategory: 'Pipes' },
    { id: 35, name: 'Sherlock Glass Pipe', sku: 'AC005', price: 34.49, stock: 28, category: 'Accessories', subcategory: 'Pipes' },
    { id: 36, name: 'Premium Rolling Papers', sku: 'AC006', price: 4.99, stock: 500, category: 'Accessories', subcategory: 'Papers' },
    { id: 37, name: 'Organic Hemp Papers', sku: 'AC007', price: 5.49, stock: 420, category: 'Accessories', subcategory: 'Papers' },
    { id: 38, name: 'Ultra Thin Papers', sku: 'AC008', price: 5.25, stock: 390, category: 'Accessories', subcategory: 'Papers' },
    { id: 39, name: 'Aluminum Grinder 4pc', sku: 'AC009', price: 39.99, stock: 35, category: 'Accessories', subcategory: 'Grinders' },
    { id: 40, name: '2pc Pocket Grinder', sku: 'AC010', price: 12.99, stock: 95, category: 'Accessories', subcategory: 'Grinders' },
    { id: 41, name: 'Wood Finish Grinder', sku: 'AC011', price: 27.49, stock: 42, category: 'Accessories', subcategory: 'Grinders' },
    { id: 42, name: 'Premium Titanium Grinder', sku: 'AC012', price: 54.99, stock: 18, category: 'Accessories', subcategory: 'Grinders' },
    { id: 43, name: 'Logo T-Shirt Small', sku: 'AP001', price: 19.99, stock: 60, category: 'Apparel', subcategory: 'Shirts' },
    { id: 44, name: 'Logo T-Shirt Large', sku: 'AP002', price: 19.99, stock: 90, category: 'Apparel', subcategory: 'Shirts' },
    { id: 45, name: 'Vintage Brand Tee', sku: 'AP003', price: 24.99, stock: 50, category: 'Apparel', subcategory: 'Shirts' },
    { id: 46, name: 'Limited Edition Tie-Dye', sku: 'AP004', price: 29.99, stock: 35, category: 'Apparel', subcategory: 'Shirts' },
    { id: 47, name: 'Brand Snapback Hat', sku: 'AP005', price: 27.99, stock: 55, category: 'Apparel', subcategory: 'Hats' },
    { id: 48, name: 'Classic Trucker Hat', sku: 'AP006', price: 22.49, stock: 44, category: 'Apparel', subcategory: 'Hats' },
    { id: 49, name: 'Premium FlexFit Cap', sku: 'AP007', price: 31.99, stock: 38, category: 'Apparel', subcategory: 'Hats' },
    { id: 50, name: 'Corduroy Brim Cap', sku: 'AP008', price: 28.50, stock: 27, category: 'Apparel', subcategory: 'Hats' },
  ];
}

function filterInventory(url: URL) {
  const search = url.searchParams.get('search')?.toLowerCase() || '';
  const category = url.searchParams.get('category') || '';
  const subcategory = url.searchParams.get('subcategory') || '';
  const dataset = getInventoryDataset();
  let filtered = dataset;
  if (search) {
    filtered = filtered.filter(item => {
      const s = search.toLowerCase();
      return (
        item.name.toLowerCase().includes(s) ||
        item.sku.toLowerCase().includes(s) ||
        item.category.toLowerCase().includes(s) ||
        (item.subcategory?.toLowerCase().includes(s) ?? false)
      );
    });
  }
  if (category) filtered = filtered.filter(i => i.category.toLowerCase() === category.toLowerCase());
  if (subcategory) filtered = filtered.filter(i => i.subcategory?.toLowerCase() === subcategory.toLowerCase());
  return { dataset, filtered };
}

async function handleGetInventory(req: Request, headers: Headers, url: URL) {
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
  const pageSize = Math.min(100, Math.max(1, parseInt(url.searchParams.get('pageSize') || '25', 10)));
  const { dataset, filtered } = filterInventory(url);
  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pageItems = filtered.slice(start, end);
  console.log(`[inventory] dataset=${dataset.length} filtered=${filtered.length} page=${page} size=${pageSize}`);
  headers.set('Content-Type', 'application/json');
  return new Response(JSON.stringify({ success: true, data: pageItems, meta: { total, page, pageSize, returned: pageItems.length } }), { status: 200, headers });
}

function handleGetInventoryCount(headers: Headers, url: URL) {
  const { dataset, filtered } = filterInventory(url);
  headers.set('Content-Type', 'application/json');
  return new Response(JSON.stringify({ success: true, total: dataset.length, filtered: filtered.length }), { status: 200, headers });
}

console.log(`Lightspeed Mockapp API server running on http://localhost:${server.port}`);