# Lightspeed Mockapp

A modern inventory management system mockup built with Next.js and Bun.

## Features

- 🔐 **Authentication System** – Mock username/password + occasional PIN challenge
- 📊 **Inventory Management** – 50 in‑memory products across multiple categories
- 🗂️ **Category & Subcategory Filtering** – Hierarchical picker with graceful fallback
- 🔍 **Debounced Search** – Name / SKU / category / subcategory
- 🔢 **Server Pagination & Counts** – page + pageSize + meta block
- 🧮 **Count Endpoint** – Rapid verification of total vs filtered
- 🪵 **Structured Debug Logging** – Logs dataset & filtered sizes per request
- 🧪 **Integration Test Script** – Quick endpoint sanity checks
- 🎨 **Modern UI** – Shadcn UI + Tailwind CSS
- 🚀 **Fast Backend** – Bun HTTP server (TypeScript)
- 📱 **Responsive Design** – Desktop & mobile

## Project Structure

```
├── frontend/          # Next.js frontend application
│   ├── src/
│   │   ├── app/       # App Router pages
│   │   └── components/ # Shadcn UI components
├── backend/           # Bun HTTP server
│   └── index.ts       # API endpoints
├── shared/            # Shared types and utilities
│   └── types.ts       # TypeScript interfaces
└── package.json       # Root package.json
```

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Bun HTTP server, TypeScript
- **Styling**: Tailwind CSS with modern design patterns
- **UI Components**: Shadcn UI component library

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your system
- Node.js 18+ (for some dependencies)

### Installation

1. **Clone or navigate to the project directory**

2. **Install root dependencies:**
   ```bash
   bun install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd frontend
   bun install
   ```

4. **Install backend dependencies:**
   ```bash
   cd ../backend
   bun install
   ```

### Running the Application

#### Option 1: Run both servers simultaneously (Recommended)
```bash
# From the root directory
bun run dev
```

#### Option 2: Run servers separately

**Terminal 1 - Backend Server:**
```bash
cd backend
bun run index.ts
```

**Terminal 2 - Frontend Development Server:**
```bash
cd frontend
bun dev
```

### Quick Start (One Command)

From the repository root:

```bash
bun install && bun run dev
```

This will:
1. Install workspaces (frontend, backend, shared)
2. Free port 3000 if occupied
3. Start backend (port 3001) & frontend (port 3000) concurrently

When ready you should see:
- Backend: `Lightspeed Mockapp API server running on http://localhost:3001`
- Frontend: Next.js dev server ready log with local URL

### Useful Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Start frontend + backend concurrently (port 3000 / 3001) |
| `bun run dev:backend` | Start only the backend Bun server |
| `bun run dev:frontend-fixed` | Free port 3000 then start Next.js dev server |
| `bun run build` | Build frontend for production |
| `bun run start` | Run built frontend (expect backend started separately) |
| `bun run lint` | Run ESLint on frontend |

### Quick Endpoint Checks

```bash
# Inventory (page 1, default pageSize=25)
curl http://localhost:3001/api/inventory | jq

# Inventory with pagination
curl "http://localhost:3001/api/inventory?page=2&pageSize=10" | jq

# Filter by category & subcategory
curl "http://localhost:3001/api/inventory?category=Cannabis&subcategory=Edibles" | jq

# Search (case-insensitive)
curl "http://localhost:3001/api/inventory?search=flower" | jq

# Count endpoint (total vs filtered)
curl "http://localhost:3001/api/inventory/count?category=Accessories" | jq

# Categories
curl http://localhost:3001/api/categories | jq
```

### Integration Test Script

Run the built-in simple test harness (server must already be running):

```bash
bun run --cwd backend test-server.ts
```

### Demo Login

```text
Username: admin
Password: password
```

### Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Frontend 3000 already in use | Previous crashed process holding port | `bun run free-frontend-port` then `bun run dev` |
| Backend not reachable (connection refused) | Backend not started or port blocked | Run `bun run dev:backend` and check console for startup log |
| Only 5 products show | Old backend instance without new dataset | Kill port 3001 process then restart backend |
| Categories empty | API failed or network delay | Fallback categories auto-load; check console warnings |
| Pagination buttons disabled unexpectedly | On last page or still loading | Verify `meta.total` vs `pageSize` |

### Production-Like Run (Manual)

```bash
# Build frontend
bun run build
# Start backend (in separate terminal)
bun run dev:backend
# Serve built frontend (after build completes)
bun run start
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

### Demo Credentials

- **Username**: `admin`
- **Password**: `password`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Categories
- `GET /api/categories` – Nested category + subcategory list

### Inventory
- `GET /api/inventory` – Query inventory
   - Query params: `search`, `category`, `subcategory`, `page` (default 1), `pageSize` (default 25, max 100)
   - Returns: `{ success, data: Product[], meta: { total, page, pageSize, returned } }`
- `GET /api/inventory/count` – Returns overall dataset size & filtered size
   - Returns: `{ success, total, filtered }`

## Development Guidelines

- Use TypeScript throughout the project
- Follow Shadcn UI component patterns
- Implement proper authentication flow
- Create responsive inventory management interface
- Use modern React patterns (hooks, context)
- Follow RESTful API design for backend endpoints

## Features Overview

### Login System
- Secure authentication with form validation
- Error handling for invalid credentials
- Token-based session management
- Responsive login interface

### Inventory Management
- 50-item mock dataset (Cannabis / Accessories / Apparel)
- Category + subcategory picker modal
- Debounced server-side search & filtering
- Count summary (e.g. `Filtered: 12 / 50 items`)
- Pagination controls + adjustable page size (5–100)
- Stock status badges (In Stock / Low Stock / Out of Stock)

### UI/UX
- Modern gradient backgrounds
- Card-based layouts
- Consistent spacing and typography
- Mobile-first responsive design
- Accessible form controls

## Future Enhancements

- [ ] Persist products (database integration)
- [ ] Product create / edit / delete UI
- [ ] Role-based access control
- [ ] Product images & media gallery
- [ ] Analytics dashboard & low-stock alerts
- [ ] CSV import validation & progress feedback
- [ ] Caching & performance tuning
- [ ] Authentication hardening (refresh tokens, reset flows)
- [ ] Full test suite (unit + E2E)

## Contributing

This is a mockapp project. Feel free to extend and customize according to your needs.

## License

MIT License - feel free to use this project as a starting point for your own applications.