import { deliveryService } from '../../api/services/delivery';
import type { DeliveryOrder } from '../../types';
import { FilterPanel, type FilterConfig } from '../components/FilterPanel';
import { Icons } from '../components/Icons';

export async function renderDeliveries(container: HTMLElement): Promise<void> {
  container.innerHTML = '<div class="loading">Loading deliveries...</div>';

  try {
    const [deliveries, pending] = await Promise.all([
      deliveryService.getAll(),
      deliveryService.getPending(),
    ]);

    let filteredDeliveries = [...deliveries];

    // Define filters
    const filterConfigs: FilterConfig[] = [
      {
        id: 'search',
        label: 'Search',
        type: 'search',
        placeholder: 'Search by delivery number or agency...',
      },
      {
        id: 'status',
        label: 'Status',
        type: 'select',
        options: [
          { value: 'draft', label: 'Draft' },
          { value: 'scheduled', label: 'Scheduled' },
          { value: 'in_transit', label: 'In Transit' },
          { value: 'delivered', label: 'Delivered' },
          { value: 'cancelled', label: 'Cancelled' },
        ],
      },
      {
        id: 'dateRange',
        label: 'Delivery Date',
        type: 'dateRange',
      },
    ];

    const filterPanel = new FilterPanel(filterConfigs, (values) => {
      filteredDeliveries = deliveries.filter(delivery => {
        // Search filter
        if (values.search) {
          const search = values.search.toLowerCase();
          const matchesSearch = 
            delivery.deliveryNumber.toLowerCase().includes(search) ||
            delivery.agencyName.toLowerCase().includes(search) ||
            delivery.driver.toLowerCase().includes(search);
          if (!matchesSearch) return false;
        }

        // Status filter
        if (values.status && delivery.status !== values.status) {
          return false;
        }

        // Date range filter
        if (values.dateRange?.start || values.dateRange?.end) {
          const deliveryDate = new Date(delivery.deliveryDate);
          if (values.dateRange.start) {
            const startDate = new Date(values.dateRange.start);
            if (deliveryDate < startDate) return false;
          }
          if (values.dateRange.end) {
            const endDate = new Date(values.dateRange.end);
            if (deliveryDate > endDate) return false;
          }
        }

        return true;
      });
      
      const tableBody = document.querySelector('#delivery-table tbody');
      if (tableBody) {
        tableBody.innerHTML = renderDeliveryRows(filteredDeliveries);
      }
    });

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
            ${Icons.add}
            <span>Create Delivery</span>
          </button>
        </div>

        ${filterPanel.render()}

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
              ${renderDeliveryRows(filteredDeliveries)}
            </tbody>
          </table>
        </div>
      </div>
    `;

    filterPanel.setupEventListeners();
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
        <button class="btn btn-sm btn-outline" title="View">${Icons.view}</button>
        <button class="btn btn-sm btn-outline" title="Track">${Icons.mapPin}</button>
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
