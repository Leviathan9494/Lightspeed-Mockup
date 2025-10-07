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

    if (url.pathname === '/api/inventory' && req.method === 'GET') {
      return handleGetInventory(req, headers);
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
async function handleGetInventory(req: Request, headers: Headers) {
  // Mock inventory data
  const inventory = [
    { id: 1, name: 'Product A', sku: 'SKU001', price: 29.99, stock: 150, category: 'Electronics' },
    { id: 2, name: 'Product B', sku: 'SKU002', price: 49.99, stock: 75, category: 'Clothing' },
    { id: 3, name: 'Product C', sku: 'SKU003', price: 19.99, stock: 200, category: 'Books' },
    { id: 4, name: 'Product D', sku: 'SKU004', price: 99.99, stock: 30, category: 'Electronics' },
    { id: 5, name: 'Product E', sku: 'SKU005', price: 15.99, stock: 100, category: 'Home & Garden' },
  ];

  headers.set('Content-Type', 'application/json');
  return new Response(JSON.stringify({ 
    success: true, 
    data: inventory 
  }), { 
    status: 200, 
    headers 
  });
}

console.log(`Lightspeed Mockapp API server running on http://localhost:${server.port}`);