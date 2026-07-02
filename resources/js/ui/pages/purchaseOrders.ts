import { purchaseOrderService } from '../../api/services/purchaseOrders';
import type { PurchaseOrder } from '../../types';
import { FilterPanel, type FilterConfig } from '../components/FilterPanel';
import { Icons } from '../components/Icons';

export async function renderPurchaseOrders(container: HTMLElement): Promise<void> {
  container.innerHTML = '<div class="loading">Loading purchase orders...</div>';

  try {
    const [purchaseOrders, requests, quotations] = await Promise.all([
      purchaseOrderService.getAll(),
      purchaseOrderService.getRequests(),
      purchaseOrderService.getQuotations(),
    ]);

    let filteredPOs = [...purchaseOrders];

    // Define filters
    const filterConfigs: FilterConfig[] = [
      {
        id: 'search',
        label: 'Search',
        type: 'search',
        placeholder: 'Search by PO number or supplier...',
      },
      {
        id: 'status',
        label: 'Status',
        type: 'select',
        options: [
          { value: 'draft', label: 'Draft' },
          { value: 'sent', label: 'Sent' },
          { value: 'confirmed', label: 'Confirmed' },
          { value: 'partially_received', label: 'Partially Received' },
          { value: 'received', label: 'Received' },
          { value: 'cancelled', label: 'Cancelled' },
        ],
      },
      {
        id: 'dateRange',
        label: 'PO Date',
        type: 'dateRange',
      },
      {
        id: 'amountRange',
        label: 'Amount',
        type: 'range',
      },
    ];

    const filterPanel = new FilterPanel(filterConfigs, (values) => {
      filteredPOs = purchaseOrders.filter(po => {
        // Search filter
        if (values.search) {
          const search = values.search.toLowerCase();
          const matchesSearch = 
            po.poNumber.toLowerCase().includes(search) ||
            po.supplierName.toLowerCase().includes(search);
          if (!matchesSearch) return false;
        }

        // Status filter
        if (values.status && po.status !== values.status) {
          return false;
        }

        // Date range filter
        if (values.dateRange?.start || values.dateRange?.end) {
          const poDate = new Date(po.poDate);
          if (values.dateRange.start) {
            const startDate = new Date(values.dateRange.start);
            if (poDate < startDate) return false;
          }
          if (values.dateRange.end) {
            const endDate = new Date(values.dateRange.end);
            if (poDate > endDate) return false;
          }
        }

        // Amount range filter
        if (values.amountRange?.min !== undefined && po.totalAmount < values.amountRange.min) {
          return false;
        }
        if (values.amountRange?.max !== undefined && po.totalAmount > values.amountRange.max) {
          return false;
        }

        return true;
      });
      
      const tableBody = document.querySelector('#po-table tbody');
      if (tableBody) {
        tableBody.innerHTML = renderPORows(filteredPOs);
      }
    });

    container.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Purchasing</h1>
        <p class="page-subtitle">Purchase orders and procurement management</p>
      </div>

      <div class="dashboard-grid" style="grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); margin-bottom: 2rem;">
        <div class="stat-card">
          <div class="stat-label">Purchase Requests</div>
          <div class="stat-value">${requests.length}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Quotations</div>
          <div class="stat-value">${quotations.length}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Purchase Orders</div>
          <div class="stat-value">${purchaseOrders.length}</div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Purchase Orders</h2>
          <button class="btn btn-primary">
            ${Icons.add}
            <span>Create PO</span>
          </button>
        </div>

        ${filterPanel.render()}

        <div class="table-container">
          <table id="po-table">
            <thead>
              <tr>
                <th>PO Number</th>
                <th>Date</th>
                <th>Supplier</th>
                <th>Delivery Date</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${renderPORows(filteredPOs)}
            </tbody>
          </table>
        </div>
      </div>
    `;

    filterPanel.setupEventListeners();
  } catch (error) {
    container.innerHTML = '<div class="error">Failed to load purchase orders</div>';
    console.error('Purchase orders error:', error);
  }
}

function renderPORows(orders: PurchaseOrder[]): string {
  return orders.map(po => `
    <tr>
      <td><strong>${po.poNumber}</strong></td>
      <td>${formatDate(po.poDate)}</td>
      <td>${po.supplierName}</td>
      <td>${formatDate(po.deliveryDate)}</td>
      <td><strong>$${po.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></td>
      <td><span class="badge badge-${getStatusBadgeClass(po.status)}">${po.status.replace('_', ' ').toUpperCase()}</span></td>
      <td>
        <button class="btn btn-sm btn-outline" title="View">${Icons.view}</button>
        <button class="btn btn-sm btn-outline" title="Edit">${Icons.edit}</button>
        <button class="btn btn-sm btn-outline" title="Print">${Icons.print}</button>
      </td>
    </tr>
  `).join('');
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'draft': return 'secondary';
    case 'sent': return 'info';
    case 'confirmed': return 'success';
    case 'partially_received': return 'warning';
    case 'received': return 'success';
    case 'cancelled': return 'danger';
    default: return 'secondary';
  }
}
