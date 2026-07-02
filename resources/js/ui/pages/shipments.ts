import { modal } from '../components/Modal';
import { Icons } from '../components/Icons';
import { FilterPanel, type FilterConfig } from '../components/FilterPanel';

interface Shipment {
  id: string;
  shipmentNumber: string;
  shipmentDate: string;
  deliveryNumber: string;
  agencyName: string;
  destination: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'cancelled';
  vehicle: string;
  driver: string;
  totalBoxes: number;
  estimatedDelivery: string;
  actualDelivery?: string;
  trackingNumber?: string;
  notes?: string;
}

const mockShipments: Shipment[] = [
  {
    id: 'ship-1',
    shipmentNumber: 'SHIP-2024-0134',
    shipmentDate: '2024-06-22T08:00:00Z',
    deliveryNumber: 'DO-2024-0089',
    agencyName: 'North Regional Health Center',
    destination: '100 Health Ave, North District',
    status: 'delivered',
    vehicle: 'TRUCK-001',
    driver: 'Mike Thompson',
    totalBoxes: 2,
    estimatedDelivery: '2024-06-22T11:00:00Z',
    actualDelivery: '2024-06-22T10:45:00Z',
    trackingNumber: 'TRK-2024-0134',
    notes: 'Delivered successfully',
  },
  {
    id: 'ship-2',
    shipmentNumber: 'SHIP-2024-0135',
    shipmentDate: '2024-06-23T07:30:00Z',
    deliveryNumber: 'DO-2024-0090',
    agencyName: 'Central Medical Clinic',
    destination: '200 Central Plaza, Downtown',
    status: 'in_transit',
    vehicle: 'VAN-002',
    driver: 'Sarah Lee',
    totalBoxes: 3,
    estimatedDelivery: '2024-06-23T14:00:00Z',
    trackingNumber: 'TRK-2024-0135',
  },
  {
    id: 'ship-3',
    shipmentNumber: 'SHIP-2024-0136',
    shipmentDate: '2024-06-24T09:00:00Z',
    deliveryNumber: 'DO-2024-0091',
    agencyName: 'South District Hospital',
    destination: '300 Hospital Road, South District',
    status: 'pending',
    vehicle: 'TRUCK-003',
    driver: 'David Brown',
    totalBoxes: 1,
    estimatedDelivery: '2024-06-24T15:00:00Z',
    trackingNumber: 'TRK-2024-0136',
  },
];

export async function renderShipments(container: HTMLElement): Promise<void> {
  let currentFilters: any = {};
  
  const filterConfigs: FilterConfig[] = [
    { id: 'search', label: 'Search', type: 'search', placeholder: 'Search shipments...' },
    { 
      id: 'status', 
      label: 'Status', 
      type: 'select',
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'in_transit', label: 'In Transit' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'cancelled', label: 'Cancelled' }
      ]
    },
    { id: 'dateRange', label: 'Shipment Date', type: 'dateRange' }
  ];

  const filterPanel = new FilterPanel(filterConfigs, (filters) => {
    currentFilters = filters;
    applyFilters();
  });

  const applyFilters = () => {
    let filtered = [...mockShipments];
    
    if (currentFilters.search) {
      const query = currentFilters.search.toLowerCase();
      filtered = filtered.filter(s => 
        s.shipmentNumber.toLowerCase().includes(query) ||
        s.deliveryNumber.toLowerCase().includes(query) ||
        s.agencyName.toLowerCase().includes(query) ||
        s.trackingNumber?.toLowerCase().includes(query)
      );
    }
    
    if (currentFilters.status) {
      filtered = filtered.filter(s => s.status === currentFilters.status);
    }
    
    if (currentFilters.dateRange?.start || currentFilters.dateRange?.end) {
      filtered = filtered.filter(s => {
        const date = new Date(s.shipmentDate);
        const start = currentFilters.dateRange.start ? new Date(currentFilters.dateRange.start) : null;
        const end = currentFilters.dateRange.end ? new Date(currentFilters.dateRange.end) : null;
        if (start && date < start) return false;
        if (end && date > end) return false;
        return true;
      });
    }
    
    const tableBody = document.querySelector('#shipments-table tbody');
    if (tableBody) {
      tableBody.innerHTML = renderShipmentRows(filtered);
      setupShipmentActions(mockShipments);
    }
  };

  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Shipments</h1>
      <p class="page-subtitle">Track shipments and deliveries</p>
    </div>

    <div class="card">
      <div class="card-header">
        <h2 class="card-title">All Shipments</h2>
        <button class="btn btn-primary" id="add-shipment-btn">
          ${Icons.add}
          <span>New Shipment</span>
        </button>
      </div>

      ${filterPanel.render()}

      <div class="table-container">
        <table id="shipments-table">
          <thead>
            <tr>
              <th>Shipment #</th>
              <th>Date</th>
              <th>Delivery #</th>
              <th>Agency</th>
              <th>Driver</th>
              <th>Status</th>
              <th>ETA</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${renderShipmentRows(mockShipments)}
          </tbody>
        </table>
      </div>
    </div>
  `;

  filterPanel.setupEventListeners();
  setupShipmentActions(mockShipments);
}

function renderShipmentRows(shipments: Shipment[]): string {
  return shipments.map(ship => `
    <tr data-id="${ship.id}">
      <td><strong>${ship.shipmentNumber}</strong></td>
      <td>${new Date(ship.shipmentDate).toLocaleDateString()}</td>
      <td>${ship.deliveryNumber}</td>
      <td>${ship.agencyName}</td>
      <td>${ship.driver}</td>
      <td>
        <span class="badge badge-${
          ship.status === 'delivered' ? 'success' :
          ship.status === 'in_transit' ? 'info' :
          ship.status === 'pending' ? 'warning' : 'secondary'
        }">
          ${ship.status.toUpperCase().replace('_', ' ')}
        </span>
      </td>
      <td>${new Date(ship.estimatedDelivery).toLocaleString()}</td>
      <td>
        <button class="btn btn-sm btn-outline view-shipment" data-id="${ship.id}" title="View">${Icons.view}</button>
        <button class="btn btn-sm btn-outline edit-shipment" data-id="${ship.id}" title="Edit">${Icons.edit}</button>
        <button class="btn btn-sm btn-outline delete-shipment" data-id="${ship.id}" title="Delete">${Icons.delete}</button>
      </td>
    </tr>
  `).join('');
}

function setupShipmentActions(shipments: Shipment[]): void {
  document.getElementById('add-shipment-btn')?.addEventListener('click', () => {
    showShipmentForm('create');
  });

  document.querySelectorAll('.view-shipment').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id;
      const shipment = shipments.find(s => s.id === id);
      if (shipment) showShipmentDetails(shipment);
    });
  });

  document.querySelectorAll('.edit-shipment').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id;
      const shipment = shipments.find(s => s.id === id);
      if (shipment) showShipmentForm('edit', shipment);
    });
  });

  document.querySelectorAll('.delete-shipment').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id;
      const shipment = shipments.find(s => s.id === id);
      if (shipment) {
        modal.delete(
          'Delete Shipment',
          `Are you sure you want to delete <strong>${shipment.shipmentNumber}</strong>?`,
          async () => {
            console.log('Shipment deleted:', id);
            window.location.reload();
          }
        );
      }
    });
  });
}

function showShipmentDetails(ship: Shipment): void {
  const content = `
    <div class="modal-details">
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Shipment Number</label>
          <p><strong>${ship.shipmentNumber}</strong></p>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Status</label>
          <p><span class="badge badge-${
            ship.status === 'delivered' ? 'success' :
            ship.status === 'in_transit' ? 'info' :
            ship.status === 'pending' ? 'warning' : 'secondary'
          }">${ship.status.toUpperCase().replace('_', ' ')}</span></p>
        </div>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Delivery Number</label>
          <p>${ship.deliveryNumber}</p>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Tracking Number</label>
          <p>${ship.trackingNumber || 'N/A'}</p>
        </div>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Agency</label>
        <p>${ship.agencyName}</p>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Destination</label>
        <p>${ship.destination}</p>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Vehicle</label>
          <p>${ship.vehicle}</p>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Driver</label>
          <p>${ship.driver}</p>
        </div>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Shipment Date</label>
          <p>${new Date(ship.shipmentDate).toLocaleString()}</p>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Total Boxes</label>
          <p>${ship.totalBoxes}</p>
        </div>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Estimated Delivery</label>
          <p>${new Date(ship.estimatedDelivery).toLocaleString()}</p>
        </div>
        ${ship.actualDelivery ? `
          <div class="modal-form-group">
            <label class="modal-form-label">Actual Delivery</label>
            <p>${new Date(ship.actualDelivery).toLocaleString()}</p>
          </div>
        ` : ''}
      </div>
      ${ship.notes ? `
        <div class="modal-form-group">
          <label class="modal-form-label">Notes</label>
          <p>${ship.notes}</p>
        </div>
      ` : ''}
    </div>
  `;

  modal.view('Shipment Details', content, 'lg');
}

function showShipmentForm(mode: 'create' | 'edit', ship?: Shipment): void {
  const content = `
    <form id="shipment-form">
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Shipment Number *</label>
          <input type="text" class="form-input" name="shipmentNumber" value="${ship?.shipmentNumber || ''}" required>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Status *</label>
          <select class="form-select" name="status" required>
            <option value="pending" ${ship?.status === 'pending' ? 'selected' : ''}>Pending</option>
            <option value="in_transit" ${ship?.status === 'in_transit' ? 'selected' : ''}>In Transit</option>
            <option value="delivered" ${ship?.status === 'delivered' ? 'selected' : ''}>Delivered</option>
            <option value="cancelled" ${ship?.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </div>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Delivery Number *</label>
          <input type="text" class="form-input" name="deliveryNumber" value="${ship?.deliveryNumber || ''}" required>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Tracking Number</label>
          <input type="text" class="form-input" name="trackingNumber" value="${ship?.trackingNumber || ''}">
        </div>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Agency *</label>
        <select class="form-select" name="agencyId" required>
          <option value="ag-1">North Regional Health Center</option>
          <option value="ag-2">Central Medical Clinic</option>
          <option value="ag-3">South District Hospital</option>
        </select>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Vehicle *</label>
          <input type="text" class="form-input" name="vehicle" value="${ship?.vehicle || ''}" required>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Driver *</label>
          <input type="text" class="form-input" name="driver" value="${ship?.driver || ''}" required>
        </div>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Shipment Date *</label>
          <input type="datetime-local" class="form-input" name="shipmentDate" value="${ship?.shipmentDate.split('.')[0] || ''}" required>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Estimated Delivery *</label>
          <input type="datetime-local" class="form-input" name="estimatedDelivery" value="${ship?.estimatedDelivery.split('.')[0] || ''}" required>
        </div>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Total Boxes *</label>
        <input type="number" class="form-input" name="totalBoxes" value="${ship?.totalBoxes || ''}" min="1" required>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Notes</label>
        <textarea class="form-textarea" name="notes">${ship?.notes || ''}</textarea>
      </div>
    </form>
  `;

  modal.form(
    mode === 'create' ? 'Create Shipment' : 'Edit Shipment',
    content,
    async () => {
      const form = document.getElementById('shipment-form') as HTMLFormElement;
      if (form.checkValidity()) {
        const formData = new FormData(form);
        console.log('Shipment saved:', Object.fromEntries(formData.entries()));
        window.location.reload();
      } else {
        form.reportValidity();
      }
    },
    mode
  );
}
