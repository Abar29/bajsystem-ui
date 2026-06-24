import { deliveryService } from '../../api/services/delivery';
import type { DeliveryOrder } from '../../types';

export async function renderDeliveries(container: HTMLElement): Promise<void> {
  container.innerHTML = '<div class="loading">Loading deliveries...</div>';

  try {
    const [deliveries, pending] = await Promise.all([
      deliveryService.getAll(),
      deliveryService.getPending(),
    ]);

    container.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Delivery Management</h1>
        <p class="page-subtitle">Track and manage deliveries to agencies</p>
      </div>

      <div class="dashboard-grid" style="grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); margin-bottom: 2rem;">
        <div class="stat-card">
          <div class="stat-label">Total Deliveries</div>
          <div class="stat-value">${deliveries.length}</div>
        </div>
        <div class="stat-card warning">
          <div class="stat-label">Pending/In Transit</div>
          <div class="stat-value">${pending.length}</div>
        </div>
        <div class="stat-card success">
          <div class="stat-label">Completed Today</div>
          <div class="stat-value">${deliveries.filter(d => d.status === 'delivered').length}</div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Delivery Orders</h2>
          <button class="btn btn-primary">
            <span>➕</span>
            Create Delivery
          </button>
        </div>

        <div class="search-box">
          <input 
            type="text" 
            class="search-input" 
            placeholder="Search by delivery number or agency..."
            id="delivery-search"
          />
        </div>

        <div class="table-container">
          <table id="delivery-table">
            <thead>
              <tr>
                <th>Delivery Number</th>
                <th>Date</th>
                <th>Agency</th>
                <th>Driver</th>
                <th>Vehicle</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${renderDeliveryRows(deliveries)}
            </tbody>
          </table>
        </div>
      </div>
    `;

    setupDeliverySearch(deliveries);
  } catch (error) {
    container.innerHTML = '<div class="error">Failed to load deliveries</div>';
    console.error('Deliveries error:', error);
  }
}

function renderDeliveryRows(deliveries: DeliveryOrder[]): string {
  return deliveries.map(delivery => `
    <tr>
      <td><strong>${delivery.deliveryNumber}</strong></td>
      <td>${formatDate(delivery.deliveryDate)}</td>
      <td>${delivery.agencyName}</td>
      <td>${delivery.driver}</td>
      <td>${delivery.vehicle}</td>
      <td><span class="badge badge-${getStatusBadgeClass(delivery.status)}">${delivery.status.replace('_', ' ').toUpperCase()}</span></td>
      <td>
        <button class="btn btn-sm btn-outline" title="View">👁️</button>
        <button class="btn btn-sm btn-outline" title="Track">📍</button>
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
    case 'scheduled': return 'info';
    case 'in_transit': return 'warning';
    case 'delivered': return 'success';
    case 'cancelled': return 'danger';
    default: return 'secondary';
  }
}

function setupDeliverySearch(deliveries: DeliveryOrder[]): void {
  const searchInput = document.getElementById('delivery-search') as HTMLInputElement;
  const tableBody = document.querySelector('#delivery-table tbody');

  if (!searchInput || !tableBody) return;

  searchInput.addEventListener('input', (e) => {
    const query = (e.target as HTMLInputElement).value.toLowerCase();
    const filtered = deliveries.filter(d => 
      d.deliveryNumber.toLowerCase().includes(query) ||
      d.agencyName.toLowerCase().includes(query) ||
      d.driver.toLowerCase().includes(query)
    );
    tableBody.innerHTML = renderDeliveryRows(filtered);
  });
}
