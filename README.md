# BAJ System UI - Frontend Application

A professional Laravel + Vite + TypeScript frontend application for the BAJ System, designed to eventually connect to a Spring Boot Maven REST API.

## Overview

This is a **frontend-only** implementation with mock data. It provides a complete user interface for the BAJ System business management platform, covering:

- Dashboard with business metrics
- Master data management (Suppliers, Agencies, Items, Warehouses, Branches)
- Purchasing workflow (Purchase Requests, Quotations, Purchase Orders)
- Inventory management (Stock tracking, Batches, Movements, Receiving, Transfers)
- Delivery management (Delivery Orders, Acknowledgements, Boxing, Shipments, Returns)
- Document management
- Administration (Users, Roles, Audit Logs)

## Technology Stack

- **Laravel 11** - Backend framework (serving as frontend shell only)
- **Vite** - Modern asset bundler
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **Axios** - HTTP client for future API integration

## Project Structure

```
resources/
├── css/
│   └── app.css                 # Main stylesheet with BAJ theme
├── js/
│   ├── app.ts                  # Main entry point
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   ├── mock/
│   │   └── data.ts             # Mock data for development
│   ├── api/
│   │   ├── client.ts           # API client configuration
│   │   └── services/           # Service layer for API calls
│   │       ├── dashboard.ts
│   │       ├── suppliers.ts
│   │       ├── inventory.ts
│   │       ├── purchaseOrders.ts
│   │       ├── delivery.ts
│   │       └── documents.ts
│   └── ui/
│       ├── app.ts              # UI initialization & navigation
│       └── pages/              # Page components
│           ├── dashboard.ts
│           ├── suppliers.ts
│           ├── inventory.ts
│           ├── purchaseOrders.ts
│           ├── deliveries.ts
│           └── documents.ts
└── views/
    └── app.blade.php           # Main HTML template
```

## Features

### Current Implementation (Mock Data)

✅ Responsive dashboard with business metrics  
✅ Suppliers list with search functionality  
✅ Inventory management with low stock alerts  
✅ Purchase orders tracking  
✅ Delivery management  
✅ Document management system  
✅ Collapsible sidebar navigation  
✅ Mobile-responsive design  
✅ Clean business-style interface with dark green theme  

### Prepared for Future Integration

🔌 API client layer ready for Spring Boot REST API  
🔌 Service layer with mock/real data switching  
🔌 Environment-based configuration  
🔌 Type-safe API contracts  

## Installation & Setup

### Prerequisites

- PHP 8.2 or higher
- Composer
- Node.js 18+ and npm
- Laragon, XAMPP, or similar local development environment

### Step 1: Install Dependencies

```bash
# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install
```

### Step 2: Environment Configuration

```bash
# Copy the example environment file
copy .env.example .env

# Generate application key
php artisan key:generate
```

### Step 3: Configure Environment Variables

Edit `.env` file and set:

```env
APP_NAME="BAJ System"
APP_URL=http://localhost

# Future API configuration
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_USE_MOCK_DATA=true
```

**Important:** 
- Keep `VITE_USE_MOCK_DATA=true` to use mock data (current mode)
- Change to `false` when Spring Boot API is ready

### Step 4: Build Assets

For development:
```bash
npm run dev
```

For production:
```bash
npm run build
```

### Step 5: Start Development Server

```bash
php artisan serve
```

The application will be available at: `http://localhost:8000`

## Usage

### Running the Application

1. Start the PHP development server:
   ```bash
   php artisan serve
   ```

2. In a separate terminal, start Vite dev server for hot reloading:
   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:8000`

### Using Laragon

If using Laragon:

1. Place the project in `C:\laragon\www\`
2. The site will be automatically available at `http://bajsystem-ui.test`
3. Run `npm run dev` in the project directory
4. Access the application in your browser

## Design Theme

The BAJ System uses a professional business color scheme:

- **Primary Color:** Dark Green (#1e5631)
- **Accent Color:** Gold (#c9a961)
- **Supporting Colors:** White, Light Gray, Slate
- **Font:** Instrument Sans

The interface focuses on:
- Clean, readable layouts
- Professional data tables
- Clear status indicators
- Responsive design
- Business-appropriate styling (no gradients or marketing fluff)

## API Integration Guide

When the Spring Boot API is ready, follow these steps:

### 1. Update Environment

```env
VITE_USE_MOCK_DATA=false
VITE_API_BASE_URL=http://your-api-server:8080/api/v1
```

### 2. API Expected Endpoints

The frontend expects these REST API endpoints:

**Dashboard:**
- `GET /dashboard/stats` → Dashboard statistics
- `GET /dashboard/activities` → Recent activities
- `GET /dashboard/alerts` → System alerts

**Suppliers:**
- `GET /suppliers` → List all suppliers
- `GET /suppliers/{id}` → Get supplier by ID
- `POST /suppliers` → Create supplier
- `PUT /suppliers/{id}` → Update supplier
- `DELETE /suppliers/{id}` → Delete supplier
- `GET /suppliers/search?q={query}` → Search suppliers

**Inventory:**
- `GET /inventory/stock` → All stock items
- `GET /inventory/stock/{id}` → Stock item by ID
- `GET /inventory/batches` → Stock batches
- `GET /inventory/stock/low-stock` → Low stock items
- `GET /inventory/batches/expiring?days={n}` → Expiring batches
- `GET /inventory/items` → Master item list

**Purchase Orders:**
- `GET /purchase-orders` → All purchase orders
- `GET /purchase-orders/{id}` → PO by ID
- `POST /purchase-orders` → Create PO
- `PUT /purchase-orders/{id}` → Update PO
- `GET /purchase-requests` → Purchase requests
- `GET /quotations` → Quotations

**Deliveries:**
- `GET /deliveries` → All delivery orders
- `GET /deliveries/{id}` → Delivery by ID
- `POST /deliveries` → Create delivery
- `PUT /deliveries/{id}` → Update delivery
- `GET /deliveries?status=pending` → Pending deliveries

**Documents:**
- `GET /documents` → All documents
- `GET /documents/{id}` → Document by ID
- `POST /documents/upload` → Upload document
- `PATCH /documents/{id}/status` → Update status
- `GET /documents/search?q={query}` → Search documents

### 3. API Response Format

The API should return JSON responses matching the TypeScript types defined in `resources/js/types/index.ts`.

Example response format:
```json
{
  "id": "sup-1",
  "code": "SUP-001",
  "name": "ABC Medical Supplies",
  "status": "active",
  "createdAt": "2024-01-15T00:00:00Z",
  "updatedAt": "2024-01-15T00:00:00Z"
}
```

### 4. Authentication

The API client is prepared for JWT token authentication. When implementing:

1. Store auth token in localStorage after login:
   ```typescript
   localStorage.setItem('auth_token', token);
   ```

2. The client automatically adds `Authorization: Bearer {token}` header

3. On 401 responses, redirect to login (uncomment in `api/client.ts`)

## Development Notes

### Mock Data

Mock data is located in `resources/js/mock/data.ts`. This provides realistic sample data for:
- Suppliers, Agencies, Items, Warehouses, Branches
- Purchase Requests, Orders, Quotations
- Stock Items, Batches
- Delivery Orders
- Documents
- Dashboard statistics

### TypeScript Types

All data structures are strongly typed in `resources/js/types/index.ts`. When the Spring Boot API is ready, ensure the JSON responses match these type definitions.

### Adding New Pages

To add a new page:

1. Create page component in `resources/js/ui/pages/yourpage.ts`
2. Add render function following existing patterns
3. Register in `resources/js/ui/app.ts` navigation
4. Add nav item in `resources/views/app.blade.php`

### Styling

Custom styles are in `resources/css/app.css`. The project uses:
- CSS custom properties for theming
- Tailwind CSS for utilities
- Custom component classes for consistency

## Production Build

To build for production:

```bash
# Build optimized assets
npm run build

# Ensure .env has production settings
APP_ENV=production
APP_DEBUG=false

# Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Known Limitations

Current version is **frontend-only**:

- ❌ No real backend business logic
- ❌ No database persistence
- ❌ No real authentication
- ❌ No file uploads
- ❌ Mock data resets on page refresh

These will be resolved when integrating with the Spring Boot API.

## Future Roadmap

1. **Phase 1 - Current:** Frontend-only with mock data ✅
2. **Phase 2:** Spring Boot REST API development
3. **Phase 3:** API integration & authentication
4. **Phase 4:** Database connection & real data
5. **Phase 5:** Advanced features (reports, analytics, notifications)

## Support

For questions or issues:
- Review the code structure in `resources/js/`
- Check TypeScript types in `resources/js/types/index.ts`
- Examine mock data in `resources/js/mock/data.ts`
- Review API client setup in `resources/js/api/client.ts`

## License

This project is proprietary software for BAJ System.

---

**Built with Laravel, Vite, and TypeScript** | **Ready for Spring Boot Integration**
