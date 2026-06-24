import { dashboardService } from '../api/services/dashboard';
import { renderDashboard } from './pages/dashboard';
import { renderSuppliers } from './pages/suppliers';
import { renderAgencies } from './pages/agencies';
import { renderItems } from './pages/items';
import { renderWarehouses } from './pages/warehouses';
import { renderBranches } from './pages/branches';
import { renderUnits } from './pages/units';
import { renderInventory } from './pages/inventory';
import { renderPurchaseRequests } from './pages/purchaseRequests';
import { renderQuotationRequests } from './pages/quotationRequests';
import { renderQuotations } from './pages/quotations';
import { renderPurchaseOrders } from './pages/purchaseOrders';
import { renderStockBatches } from './pages/stockBatches';
import { renderStockMovements } from './pages/stockMovements';
import { renderReceiving } from './pages/receiving';
import { renderTransfers } from './pages/transfers';
import { renderDeliveries } from './pages/deliveries';
import { renderAcknowledgements } from './pages/acknowledgements';
import { renderBoxing } from './pages/boxing';
import { renderShipments } from './pages/shipments';
import { renderReturns } from './pages/returns';
import { renderDocuments } from './pages/documents';
import { renderUsers } from './pages/users';
import { renderRoles } from './pages/roles';
import { renderAuditLog } from './pages/auditLog';

// Application state
let currentPage: string = 'dashboard';
let sidebarOpen: boolean = true;

export function initializeApp(): void {
  setupSidebar();
  setupNavigation();
  navigateTo('dashboard');
}

function setupSidebar(): void {
  const burgerMenu = document.getElementById('burger-menu');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('main-content');

  const toggleSidebar = () => {
    sidebarOpen = !sidebarOpen;
    
    if (window.innerWidth < 768) {
      sidebar?.classList.toggle('open');
      sidebarOverlay?.classList.toggle('active');
    } else {
      sidebar?.classList.toggle('collapsed');
      mainContent?.classList.toggle('expanded');
    }
  };

  burgerMenu?.addEventListener('click', toggleSidebar);
  sidebarOverlay?.addEventListener('click', () => {
    if (window.innerWidth < 768) {
      sidebar?.classList.remove('open');
      sidebarOverlay?.classList.remove('active');
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
      sidebar?.classList.remove('open');
      sidebarOverlay?.classList.remove('active');
    } else {
      sidebar?.classList.remove('collapsed');
      sidebar?.classList.remove('open');
      mainContent?.classList.remove('expanded');
    }
  });
}

function setupNavigation(): void {
  const navItems = document.querySelectorAll('[data-page]');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const page = (e.currentTarget as HTMLElement).getAttribute('data-page');
      if (page) navigateTo(page);
    });
  });
}

export function navigateTo(page: string): void {
  currentPage = page;
  
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  const activeNavItem = document.querySelector(`[data-page="${page}"]`);
  activeNavItem?.classList.add('active');
  
  const contentWrapper = document.getElementById('content-wrapper');
  if (!contentWrapper) return;

  switch (page) {
    case 'dashboard':
      renderDashboard(contentWrapper);
      break;
    // Master Data
    case 'suppliers':
      renderSuppliers(contentWrapper);
      break;
    case 'agencies':
      renderAgencies(contentWrapper);
      break;
    case 'items':
      renderItems(contentWrapper);
      break;
    case 'warehouses':
      renderWarehouses(contentWrapper);
      break;
    case 'branches':
      renderBranches(contentWrapper);
      break;
    case 'units':
      renderUnits(contentWrapper);
      break;
    // Purchasing
    case 'purchase-requests':
      renderPurchaseRequests(contentWrapper);
      break;
    case 'quotation-requests':
      renderQuotationRequests(contentWrapper);
      break;
    case 'quotations':
      renderQuotations(contentWrapper);
      break;
    case 'purchase-orders':
      renderPurchaseOrders(contentWrapper);
      break;
    // Inventory
    case 'inventory':
      renderInventory(contentWrapper);
      break;
    case 'stock-batches':
      renderStockBatches(contentWrapper);
      break;
    case 'stock-movements':
      renderStockMovements(contentWrapper);
      break;
    case 'receiving':
      renderReceiving(contentWrapper);
      break;
    case 'transfers':
      renderTransfers(contentWrapper);
      break;
    // Delivery
    case 'deliveries':
      renderDeliveries(contentWrapper);
      break;
    case 'acknowledgements':
      renderAcknowledgements(contentWrapper);
      break;
    case 'boxing':
      renderBoxing(contentWrapper);
      break;
    case 'shipments':
      renderShipments(contentWrapper);
      break;
    case 'returns':
      renderReturns(contentWrapper);
      break;
    // Documents
    case 'documents':
      renderDocuments(contentWrapper);
      break;
    // Administration
    case 'users':
      renderUsers(contentWrapper);
      break;
    case 'roles':
      renderRoles(contentWrapper);
      break;
    case 'audit-log':
      renderAuditLog(contentWrapper);
      break;
    default:
      renderDashboard(contentWrapper);
  }

  if (window.innerWidth < 768) {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    sidebar?.classList.remove('open');
    overlay?.classList.remove('active');
  }
}
