# Lightspeed Mockapp

A modern inventory management system mockup built with Next.js and Bun.

## Features

- 🔐 **Authentication System** - Secure login to access inventory
- 📊 **Inventory Management** - View and manage product inventory
- 🎨 **Modern UI** - Built with Shadcn UI components
- 🚀 **Fast Backend** - Powered by Bun HTTP server
- 📱 **Responsive Design** - Works on desktop and mobile devices

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

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

### Demo Credentials

- **Username**: `admin`
- **Password**: `password`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Inventory
- `GET /api/inventory` - Get all inventory items

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
- Product listing with search and filtering
- Stock status indicators (In Stock, Low Stock, Out of Stock)
- Responsive data table
- Real-time inventory updates

### UI/UX
- Modern gradient backgrounds
- Card-based layouts
- Consistent spacing and typography
- Mobile-first responsive design
- Accessible form controls

## Future Enhancements

- [ ] Add product creation/editing functionality
- [ ] Implement search and filtering
- [ ] Add pagination for large inventories
- [ ] Include product images
- [ ] Add inventory analytics dashboard
- [ ] Implement role-based access control
- [ ] Add real database integration
- [ ] Include unit tests and E2E testing

## Contributing

This is a mockapp project. Feel free to extend and customize according to your needs.

## License

MIT License - feel free to use this project as a starting point for your own applications.