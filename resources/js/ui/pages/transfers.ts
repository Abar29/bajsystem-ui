import { modal } from '../components/Modal';
import { Icons } from '../components/Icons';
import { FilterPanel, type FilterConfig } from '../components/FilterPanel';

interface Transfer {
  id: string;
  transferNumber: string;
  transferDate: string;
  fromWarehouse: string;
  toWarehouse: string;
  status: 'draft' | 'in_transit' | 'completed' | 'cancelled';
  items: Array<{
    itemCode: string;
    itemName: string;
    quantity: number;
    unit: string;
    batchNumber: string;
  }>;
  requestedBy: string;
  approvedBy?: string;
  notes?: string;
}

const mockTransfers: Transfer[] = [
  {
    id: 'trf-1',
    transferNumber: 'TRF-2024-0015',
    transferDate: '2024-06-22T09:00:00Z',
    fromWarehouse: 'Main Warehouse',
    toWarehouse: 'Cold Storage Facility',
    status: 'completed',
    items: [
      {
        itemCode: 'SUP-001',
        itemName: 'Surgical Gloves Large',
        quantity: 200,
        unit: 'Box',
        batchNumber: 'BATCH-2024-010',
      },
    ],
    requestedBy: 'Lisa Chen',
    approvedBy: 'Warehouse Manager',
    notes: 'Stock redistribution',
  },
  {
    id: 'trf-2',
    transferNumber: 'TRF-2024-0016',
    transferDate: '2024-06-23T10:30:00Z',
    fromWarehouse: 'Cold Storage Facility',
    toWarehouse: 'Main Warehouse',
    status: 'in_transit',
    items: [
      {
        itemCode: 'MED-002',
        itemName: 'Amoxicillin 250mg Capsules',
        quantity: 50,
        unit: 'Box',
        batchNumber: 'BATCH-2024-002',
      },
    ],
    requestedBy: 'Robert Johnson',
    approvedBy: 'Warehouse Manager',
  },
  {
    id: 'trf-3',
    transferNumber: 'TRF-2024-0017',
    transferDate: '2024-06-24T14:00:00Z',
    fromWarehouse: 'Main Warehouse',
    toWarehouse: 'Cold Storage Facility',
    status: 'draft',
    items: [
      {
        itemCode: 'MED-001',
        itemName: 'Paracetamol 500mg Tablets',
        quantity: 100,
        unit: 'Box',
        batchNumber: 'BATCH-2024-001',
      },
    ],
    requestedBy: 'John Doe',
  },
];

export async function renderTransfers(container: HTMLElement): Promise<void> {
  let currentFilters: any = {};
  
  const filterConfigs: FilterConfig[] = [
    { id: 'search', label: 'Search', type: 'search', placeholder: 'Search transfers...' },
    { 
      id: 'status', 
      label: 'Status', 
      type: 'select',
      options: [
        { value: 'draft', label: 'Draft' },
        { value: 'in_transit', label: 'In Transit' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' }
      ]
    },
    { id: 'dateRange', label: 'Transfer Date', type: 'dateRange' }
  ];

  const filterPanel = new FilterPanel(filterConfigs, (filters) => {
    currentFilters = filters;
    applyFilters();
  });

  const applyFilters = () => {
    let filtered = [...mockTransfers];
    
    if (currentFilters.search) {
      const query = currentFilters.search.toLowerCase();
      filtered = filtered.filter(t => 
        t.transferNumber.toLowerCase().includes(query) ||
        t.fromWarehouse.toLowerCase().includes(query) ||
        t.toWarehouse.toLowerCase().includes(query)
      );
    }
    
    if (currentFilters.status) {
      filtered = filtered.filter(t => t.status === currentFilters.status);
    }
    
    if (currentFilters.dateRange?.start || currentFilters.dateRange?.end) {
      filtered = filtered.filter(t => {
        const date = new Date(t.transferDate);
        const start = currentFilters.dateRange.start ? new Date(currentFilters.dateRange.start) : null;
        const end = currentFilters.dateRange.end ? new Date(currentFilters.dateRange.end) : null;
        if (start && date < start) return false;
        if (end && date > end) return false;
        return true;
      });
    }
    
    const tableBody = document.querySelector('#transfers-table tbody');
    if (tableBody) {
      tableBody.innerHTML = renderTransferRows(filtered);
      setupTransferActions(mockTransfers);
    }
  };

  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Stock Transfers</h1>
      <p class="page-subtitle">Manage inter-warehouse transfers</p>
    </div>

    <div class="card">
      <div class="card-header">
        <h2 class="card-title">All Transfers</h2>
        <button class="btn btn-primary" id="add-transfer-btn">
          ${Icons.add}
          <span>New Transfer</span>
        </button>
      </div>

      ${filterPanel.render()}

      <div class="table-container">
        <table id="transfers-table">
          <thead>
            <tr>
              <th>Transfer #</th>
              <th>Date</th>
              <th>From</th>
              <th>To</th>
              <th>Items</th>
              <th>Status</th>
              <th>Requested By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${renderTransferRows(mockTransfers)}
          </tbody>
        </table>
      </div>
    </div>
  `;

  filterPanel.setupEventListeners();
  setupTransferActions(mockTransfers);
}

function renderTransferRows(transfers: Transfer[]): string {
  return transfers.map(trf => `
    <tr data-id="${trf.id}">
      <td><strong>${trf.transferNumber}</strong></td>
      <td>${new Date(trf.transferDate).toLocaleDateString()}</td>
      <td>${trf.fromWarehouse}</td>
      <td>${trf.toWarehouse}</td>
      <td>${trf.items.length} item(s)</td>
      <td>
        <span class="badge badge-${
          trf.status === 'completed' ? 'success' :
          trf.status === 'in_transit' ? 'info' :
          trf.status === 'draft' ? 'secondary' : 'dark'
        }">
          ${trf.status.toUpperCase().replace('_', ' ')}
        </span>
      </td>
      <td>${trf.requestedBy}</td>
      <td>
        <button class="btn btn-sm btn-outline view-transfer" data-id="${trf.id}" title="View">${Icons.view}</button>
        <button class="btn btn-sm btn-outline edit-transfer" data-id="${trf.id}" title="Edit">${Icons.edit}</button>
        <button class="btn btn-sm btn-outline delete-transfer" data-id="${trf.id}" title="Delete">${Icons.delete}</button>
      </td>
    </tr>
  `).join('');
}

function setupTransferActions(transfers: Transfer[]): void {
  document.getElementById('add-transfer-btn')?.addEventListener('click', () => {
    showTransferForm('create');
  });

  document.querySelectorAll('.view-transfer').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id;
      const transfer = transfers.find(t => t.id === id);
      if (transfer) showTransferDetails(transfer);
    });
  });

  document.querySelectorAll('.edit-transfer').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id;
      const transfer = transfers.find(t => t.id === id);
      if (transfer) showTransferForm('edit', transfer);
    });
  });

  document.querySelectorAll('.delete-transfer').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id;
      const transfer = transfers.find(t => t.id === id);
      if (transfer) {
        modal.delete(
          'Delete Transfer',
          `Are you sure you want to delete <strong>${transfer.transferNumber}</strong>?`,
          async () => {
            console.log('Transfer deleted:', id);
            window.location.reload();
          }
        );
      }
    });
  });
}

function showTransferDetails(trf: Transfer): void {
  const itemsHtml = trf.items.map(item => `
    <tr>
      <td>${item.itemCode}</td>
      <td>${item.itemName}</td>
      <td>${item.quantity} ${item.unit}</td>
      <td>${item.batchNumber}</td>
    </tr>
  `).join('');

  const content = `
    <div class="modal-details">
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Transfer Number</label>
          <p><strong>${trf.transferNumber}</strong></p>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Status</label>
          <p><span class="badge badge-${
            trf.status === 'completed' ? 'success' :
            trf.status === 'in_transit' ? 'info' : 'secondary'
          }">${trf.status.toUpperCase().replace('_', ' ')}</span></p>
        </div>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Transfer Date</label>
        <p>${new Date(trf.transferDate).toLocaleDateString()}</p>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">From Warehouse</label>
          <p>${trf.fromWarehouse}</p>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">To Warehouse</label>
          <p>${trf.toWarehouse}</p>
        </div>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Items</label>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Batch</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
        </div>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Requested By</label>
          <p>${trf.requestedBy}</p>
        </div>
        ${trf.approvedBy ? `
          <div class="modal-form-group">
            <label class="modal-form-label">Approved By</label>
            <p>${trf.approvedBy}</p>
          </div>
        ` : ''}
      </div>
      ${trf.notes ? `
        <div class="modal-form-group">
          <label class="modal-form-label">Notes</label>
          <p>${trf.notes}</p>
        </div>
      ` : ''}
    </div>
  `;

  modal.view('Transfer Details', content, 'lg');
}

function showTransferForm(mode: 'create' | 'edit', trf?: Transfer): void {
  const content = `
    <form id="transfer-form">
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Transfer Number *</label>
          <input type="text" class="form-input" name="transferNumber" value="${trf?.transferNumber || ''}" required>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Status *</label>
          <select class="form-select" name="status" required>
            <option value="draft" ${trf?.status === 'draft' ? 'selected' : ''}>Draft</option>
            <option value="in_transit" ${trf?.status === 'in_transit' ? 'selected' : ''}>In Transit</option>
            <option value="completed" ${trf?.status === 'completed' ? 'selected' : ''}>Completed</option>
            <option value="cancelled" ${trf?.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </div>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Transfer Date *</label>
        <input type="datetime-local" class="form-input" name="transferDate" value="${trf?.transferDate.split('.')[0] || ''}" required>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">From Warehouse *</label>
          <select class="form-select" name="fromWarehouse" required>
            <option value="wh-1" ${trf?.fromWarehouse === 'Main Warehouse' ? 'selected' : ''}>Main Warehouse</option>
            <option value="wh-2" ${trf?.fromWarehouse === 'Cold Storage Facility' ? 'selected' : ''}>Cold Storage Facility</option>
          </select>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">To Warehouse *</label>
          <select class="form-select" name="toWarehouse" required>
            <option value="wh-1" ${trf?.toWarehouse === 'Main Warehouse' ? 'selected' : ''}>Main Warehouse</option>
            <option value="wh-2" ${trf?.toWarehouse === 'Cold Storage Facility' ? 'selected' : ''}>Cold Storage Facility</option>
          </select>
        </div>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Requested By *</label>
        <input type="text" class="form-input" name="requestedBy" value="${trf?.requestedBy || ''}" required>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Notes</label>
        <textarea class="form-textarea" name="notes">${trf?.notes || ''}</textarea>
      </div>
    </form>
  `;

  modal.form(
    mode === 'create' ? 'Create Transfer' : 'Edit Transfer',
    content,
    async () => {
      const form = document.getElementById('transfer-form') as HTMLFormElement;
      if (form.checkValidity()) {
        const formData = new FormData(form);
        console.log('Transfer saved:', Object.fromEntries(formData.entries()));
        window.location.reload();
      } else {
        form.reportValidity();
      }
    },
    mode
  );
}
