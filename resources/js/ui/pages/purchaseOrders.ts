import { purchaseOrderService } from '../../api/services/purchaseOrders';
import type { PurchaseOrder } from '../../types';

export async function renderPurchaseOrders(container: HTMLElement): Promise<void> {
  container.innerHTML = '<div class="loading">Loading purchase orders...</div>';

  try {
    const [purchaseOrders, requests, quotations] = await Promise.all([
      purchaseOrderService.getAll(),
      purchaseOrderService.getRequests(),
      purchaseOrderService.getQuotations(),
    ]);

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
            <span>➕</span>
            Create PO
          </button>
        </div>

        <div class="search-box">
          <input 
            type="text" 
            class="search-input" 
            placeholder="Search by PO number or supplier..."
            id="po-search"
          />
        </div>

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
              ${renderPORows(purchaseOrders)}
            </tbody>
          </table>
        </div>
      </div>
    `;

    setupPOSearch(purchaseOrders);
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
        <button class="btn btn-sm btn-outline" title="View">👁️</button>
        <button class="btn btn-sm btn-outline" title="Edit">✏️</button>
        <button class="btn btn-sm btn-outline" title="Print">🖨️</button>
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

function setupPOSearch(orders: PurchaseOrder[]): void {
  const searchInput = document.getElementById('po-search') as HTMLInputElement;
  const tableBody = document.querySelector('#po-table tbody');

  if (!searchInput || !tableBody) return;

  searchInput.addEventListener('input', (e) => {
    const query = (e.target as HTMLInputElement).value.toLowerCase();
    const filtered = orders.filter(po => 
      po.poNumber.toLowerCase().includes(query) ||
      po.supplierName.toLowerCase().includes(query)
    );
    tableBody.innerHTML = renderPORows(filtered);
  });
}
