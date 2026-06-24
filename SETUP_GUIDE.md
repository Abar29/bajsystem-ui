# BAJ System UI - Quick Setup Guide

## ✅ Project Status

**The frontend application is fully built and ready to run!**

Build completed successfully with:
- TypeScript compilation ✅
- Vite bundling ✅
- CSS processing with Tailwind ✅
- All assets optimized ✅

## 🚀 Quick Start (3 Steps)

### 1. Start the Server

Open a terminal in the project directory and run:

```bash
php artisan serve
```

The application will start at: **http://localhost:8000**

### 2. (Optional) Development Mode with Hot Reload

For active development with auto-refresh, open a **second terminal** and run:

```bash
npm run dev
```

This enables hot module replacement (HMR) for instant updates when you edit code.

### 3. Open Your Browser

Navigate to: **http://localhost:8000**

You should see the BAJ System dashboard!

## 📋 What You'll See

The application includes these working modules with mock data:

### Dashboard
- Business overview cards showing key metrics
- Pending approvals, stock alerts, delivery queue
- Recent activity feed
- System alerts (low stock, expiring items, etc.)

### Master Data
- **Suppliers** - List of suppliers with search functionality
- **Agencies** - Healthcare agencies/branches
- **Items** - Product catalog
- **Warehouses** - Storage facilities
- **Branches** - Branch locations

### Purchasing
- **Purchase Requests** - Request forms for needed items
- **Quotations** - Supplier quotations
- **Purchase Orders** - Active PO tracking with status

### Inventory
- **Stock List** - Current stock levels across warehouses
- **Low Stock Alerts** - Items below reorder point
- **Expiring Items** - Batches expiring soon
- **Stock Batches** - Batch number tracking
- **Stock Movements** - Movement history
- **Receiving & Transfers**

### Delivery
- **Delivery Orders** - Outbound delivery tracking
- **Acknowledgements** - Receipt confirmations
- **Boxing** - Packaging records
- **Shipments** - Shipment tracking
- **Returns/Recalls**

### Documents
- Document repository with upload placeholders
- Status tracking (draft, under review, approved)
- Document search

### Administration
- User management (placeholder)
- Roles & permissions (placeholder)
- Audit log preview (placeholder)

## 🎨 Design Features

✅ **Modern dark green theme** with gradients and depth  
✅ **Responsive sidebar** - Smooth animations, collapsible on desktop, slide-out on mobile  
✅ **Beautiful data tables** - Rounded corners, hover effects, gradient headers  
✅ **Professional styling** - Layered shadows, micro-animations, contemporary design  
✅ **Mobile-first** - Fully responsive across all devices (desktop, tablet, mobile)  
✅ **Interactive elements** - Button ripple effects, card hover lifts, smooth transitions  
✅ **Modern typography** - Gradient text effects, optimized hierarchy  
✅ **Enhanced UX** - Loading animations, status badges, visual feedback  

## 🔧 Using Laragon

If you're using Laragon (which you appear to be):

1. The project is already in `C:\laragon\www\bajsystem-ui\`
2. The site is auto-configured as: **http://bajsystem-ui.test**
3. Just start Laragon services and visit that URL
4. For development mode: Run `npm run dev` in the project folder

## 📊 Mock Data

Currently using **mock data only**. Changes are not persisted.

Mock data includes:
- 3 suppliers (ABC Medical, Global Pharma, HealthCare Equipment)
- 3 agencies (North Regional, Central Medical, South District)
- 4 items (Paracetamol, Amoxicillin, Gloves, Masks)
- 2 purchase orders with realistic data
- Stock items with low stock alerts
- Recent delivery orders
- Sample documents

## 🔌 API Integration (Future)

When ready to connect to Spring Boot API:

1. Update `.env`:
   ```env
   VITE_USE_MOCK_DATA=false
   VITE_API_BASE_URL=http://your-spring-boot-server:8080/api/v1
   ```

2. Restart the dev server (npm run dev)

3. The frontend will automatically switch from mock to real API calls

See `README.md` for complete API endpoint specifications.

## 📁 Project Structure

```
resources/
├── css/app.css              # Styles with dark green theme
├── js/
│   ├── app.ts              # Main entry point
│   ├── types/index.ts      # TypeScript definitions
│   ├── mock/data.ts        # Mock data (current mode)
│   ├── api/
│   │   ├── client.ts       # API client (ready for Spring Boot)
│   │   └── services/       # Service layer
│   └── ui/
│       ├── app.ts          # Navigation & UI logic
│       └── pages/          # Page components
└── views/app.blade.php     # Main HTML template
```

## ✏️ Making Changes

### To Edit Styles
Edit `resources/css/app.css`

### To Change Mock Data
Edit `resources/js/mock/data.ts`

### To Add a New Page
1. Create `resources/js/ui/pages/yourpage.ts`
2. Add route in `resources/js/ui/app.ts`
3. Add nav item in `resources/views/app.blade.php`

### To Add API Services
1. Add service in `resources/js/api/services/yourservice.ts`
2. Export in `resources/js/api/index.ts`

After editing TypeScript/CSS:
- In dev mode (`npm run dev`): Changes apply automatically
- In production mode: Run `npm run build` to rebuild

## 🐛 Troubleshooting

### Port 8000 already in use
```bash
php artisan serve --port=8001
```

### Assets not loading
```bash
npm run build
php artisan serve
```

### Changes not reflecting
1. Stop `npm run dev` (Ctrl+C)
2. Clear browser cache
3. Run `npm run build`
4. Restart `php artisan serve`

### TypeScript errors
```bash
npm install
npm run build
```

## 📖 Next Steps

1. **Explore the UI** - Click through all modules
2. **Test search functionality** - Try searching in tables
3. **Check responsive design** - Resize browser window
4. **Review mock data** - See `resources/js/mock/data.ts`
5. **Plan API integration** - Review `README.md` API section

## 🎯 Current Status Summary

| Feature | Status |
|---------|--------|
| Frontend UI | ✅ Complete |
| Mock Data | ✅ Working |
| Navigation | ✅ Working |
| Search/Filter | ✅ Working |
| Responsive Design | ✅ Working |
| API Client Layer | ✅ Ready |
| Spring Boot API | ⏳ Pending |
| Database Connection | ⏳ Pending |
| Authentication | ⏳ Pending |

## 📞 Support

Having issues? Check:
1. PHP version: `php -v` (need 8.2+)
2. Node version: `node -v` (need 18+)
3. Dependencies installed: `composer install` & `npm install`
4. Build successful: `npm run build`

---

**Ready to use!** Just run `php artisan serve` and visit http://localhost:8000 🚀
