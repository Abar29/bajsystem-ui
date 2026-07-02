import type { StockBatch } from '../../types';
import { modal } from '../components/Modal';
import { Icons } from '../components/Icons';
import { FilterPanel, type FilterConfig } from '../components/FilterPanel';

const mockStockBatches: StockBatch[] = [
  {
    id: 'batch-1',
    batchNumber: 'BATCH-2024-001',
    itemId: 'item-1',
    itemCode: 'MED-001',
    itemName: 'Paracetamol 500mg Tablets',
    warehouseId: 'wh-1',
    quantity: 250,
    unit: 'Box',
    receivedDate: '2024-06-01T00:00:00Z',
    expiryDate: '2026-06-01T00:00:00Z',
    poNumber: 'PO-2024-0100',
    status: 'active',
    createdAt: '2024-06-01T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'batch-2',
    batchNumber: 'BATCH-2024-002',
    itemId: 'item-2',
    itemCode: 'MED-002',
    itemName: 'Amoxicillin 250mg Capsules',
    warehouseId: 'wh-2',
    quantity: 80,
    unit: 'Box',
    receivedDate: '2024-06-05T00:00:00Z',
    expiryDate: '2024-07-01T00:00:00Z',
    poNumber: 'PO-2024-0105',
    status: 'active',
    createdAt: '2024-06-05T00:00:00Z',
    updatedAt: '2024-06-05T00:00:00Z',
  },
  {
    id: 'batch-3',
    batchNumber: 'BATCH-2024-003',
    itemId: 'item-3',
    itemCode: 'SUP-001',
    itemName: 'Surgical Gloves Large',
    warehouseId: 'wh-1',
    quantity: 450,
    unit: 'Box',
    receivedDate: '2024-06-10T00:00:00Z',
    expiryDate: '2025-12-31T00:00:00Z',
    poNumber: 'PO-2024-0110',
    status: 'active',
    createdAt: '2024-06-10T00:00:00Z',
    updatedAt: '2024-06-10T00:00:00Z',
  },
  {
    id: 'batch-4',
    batchNumber: 'BATCH-2024-004',
    itemId: 'item-4',
    itemCode: 'SUP-002',
    itemName: 'Face Masks Surgical',
    warehouseId: 'wh-1',
    quantity: 1200,
    unit: 'Box',
    receivedDate: '2024-06-12T00:00:00Z',
    expiryDate: '2027-01-01T00:00:00Z',
    poNumber: 'PO-2024-0112',
    status: 'active',
    createdAt: '2024-06-12T00:00:00Z',
    updatedAt: '2024-06-12T00:00:00Z',
  },
];

export async function renderStockBatches(container: HTMLElement): Promise<void> {
  let currentFilters: any = {};
  
  const filterConfigs: FilterConfig[] = [
    { id: 'search', label: 'Search', type: 'search', placeholder: 'Search batches...' },
    { 
      id: 'status', 
      label: 'Status', 
      type: 'select',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'depleted', label: 'Depleted' },
        { value: 'expired', label: 'Expired' }
      ]
    },
    { id: 'dateRange', label: 'Expiry Date', type: 'dateRange' }
  ];

  const filterPanel = new FilterPanel(filterConfigs, (filters) => {
    currentFilters = filters;
    applyFilters();
  });

  const applyFilters = () => {
    let filtered = [...mockStockBatches];
    
    if (currentFilters.search) {
      const query = currentFilters.search.toLowerCase();
      filtered = filtered.filter(b => 
        b.batchNumber.toLowerCase().includes(query) ||
        b.itemName.toLowerCase().includes(query) ||
        b.itemCode.toLowerCase().includes(query)
      );
    }
    
    if (currentFilters.status) {
      filtered = filtered.filter(b => b.status === currentFilters.status);
    }
    
    if (currentFilters.dateRange?.start || currentFilters.dateRange?.end) {
      filtered = filtered.filter(b => {
        const date = new Date(b.expiryDate);
        const start = currentFilters.dateRange.start ? new Date(currentFilters.dateRange.start) : null;
        const end = currentFilters.dateRange.end ? new Date(currentFilters.dateRange.end) : null;
        if (start && date < start) return false;
        if (end && date > end) return false;
        return true;
      });
    }
    
    const tableBody = document.querySelector('#batches-table tbody');
    if (tableBody) {
      tableBody.innerHTML = renderBatchRows(filtered);
      setupBatchActions(mockStockBatches);
    }
  };

  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Stock Batches</h1>
      <p class="page-subtitle">Track stock batches and expiry dates</p>
    </div>

    <div class="card">
      <div class="card-header">
        <h2 class="card-title">All Stock Batches</h2>
        <button class="btn btn-primary" id="add-batch-btn">
          ${Icons.add}
          <span>Add Batch</span>
        </button>
      </div>

      ${filterPanel.render()}

      <div class="table-container">
        <table id="batches-table">
          <thead>
            <tr>
              <th>Batch Number</th>
              <th>Item</th>
              <th>Quantity</th>
              <th>Received Date</th>
              <th>Expiry Date</th>
              <th>PO Number</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${renderBatchRows(mockStockBatches)}
          </tbody>
        </table>
      </div>
    </div>
  `;

  filterPanel.setupEventListeners();
  setupBatchActions(mockStockBatches);
}

function renderBatchRows(batches: StockBatch[]): string {
  return batches.map(batch => {
    const expiryDate = new Date(batch.expiryDate);
    const daysUntilExpiry = Math.floor((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    const isExpiringSoon = daysUntilExpiry < 30 && daysUntilExpiry > 0;
    const isExpired = daysUntilExpiry <= 0;

    return `
      <tr data-id="${batch.id}">
        <td><strong>${batch.batchNumber}</strong></td>
        <td>${batch.itemCode} - ${batch.itemName}</td>
        <td>${batch.quantity} ${batch.unit}</td>
        <td>${new Date(batch.receivedDate).toLocaleDateString()}</td>
        <td class="${isExpired ? 'text-danger' : isExpiringSoon ? 'text-warning' : ''}">
          ${expiryDate.toLocaleDateString()}
          ${isExpired ? '(EXPIRED)' : isExpiringSoon ? `(${daysUntilExpiry} days)` : ''}
        </td>
        <td>${batch.poNumber || 'N/A'}</td>
        <td>
          <span class="badge badge-${batch.status === 'active' ? 'success' : 'secondary'}">
            ${batch.status.toUpperCase()}
          </span>
        </td>
        <td>
          <button class="btn btn-sm btn-outline view-batch" data-id="${batch.id}" title="View">${Icons.view}</button>
          <button class="btn btn-sm btn-outline edit-batch" data-id="${batch.id}" title="Edit">${Icons.edit}</button>
          <button class="btn btn-sm btn-outline delete-batch" data-id="${batch.id}" title="Delete">${Icons.delete}</button>
        </td>
      </tr>
    `;
  }).join('');
}

function setupBatchActions(batches: StockBatch[]): void {
  document.getElementById('add-batch-btn')?.addEventListener('click', () => {
    showBatchForm('create');
  });

  document.querySelectorAll('.view-batch').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id;
      const batch = batches.find(b => b.id === id);
      if (batch) showBatchDetails(batch);
    });
  });

  document.querySelectorAll('.edit-batch').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id;
      const batch = batches.find(b => b.id === id);
      if (batch) showBatchForm('edit', batch);
    });
  });

  document.querySelectorAll('.delete-batch').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id;
      const batch = batches.find(b => b.id === id);
      if (batch) {
        modal.delete(
          'Delete Batch',
          `Are you sure you want to delete batch <strong>${batch.batchNumber}</strong>?`,
          async () => {
            console.log('Batch deleted:', id);
            window.location.reload();
          }
        );
      }
    });
  });
}

function showBatchDetails(batch: StockBatch): void {
  const expiryDate = new Date(batch.expiryDate);
  const daysUntilExpiry = Math.floor((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const content = `
    <div class="modal-details">
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Batch Number</label>
          <p><strong>${batch.batchNumber}</strong></p>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Status</label>
          <p><span class="badge badge-${batch.status === 'active' ? 'success' : 'secondary'}">${batch.status.toUpperCase()}</span></p>
        </div>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Item</label>
        <p>${batch.itemCode} - ${batch.itemName}</p>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Quantity</label>
          <p>${batch.quantity} ${batch.unit}</p>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">PO Number</label>
          <p>${batch.poNumber || 'N/A'}</p>
        </div>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Received Date</label>
          <p>${new Date(batch.receivedDate).toLocaleDateString()}</p>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Expiry Date</label>
          <p class="${daysUntilExpiry <= 0 ? 'text-danger' : daysUntilExpiry < 30 ? 'text-warning' : ''}">
            ${expiryDate.toLocaleDateString()}
            ${daysUntilExpiry <= 0 ? '(EXPIRED)' : daysUntilExpiry < 30 ? `(${daysUntilExpiry} days remaining)` : ''}
          </p>
        </div>
      </div>
    </div>
  `;

  modal.view('Stock Batch Details', content, 'lg');
}

function showBatchForm(mode: 'create' | 'edit', batch?: StockBatch): void {
  const content = `
    <form id="batch-form">
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Batch Number *</label>
          <input type="text" class="form-input" name="batchNumber" value="${batch?.batchNumber || ''}" required>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Status *</label>
          <select class="form-select" name="status" required>
            <option value="active" ${batch?.status === 'active' ? 'selected' : ''}>Active</option>
            <option value="depleted" ${batch?.status === 'depleted' ? 'selected' : ''}>Depleted</option>
            <option value="expired" ${batch?.status === 'expired' ? 'selected' : ''}>Expired</option>
          </select>
        </div>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Item *</label>
        <select class="form-select" name="itemId" required>
          <option value="item-1" ${batch?.itemId === 'item-1' ? 'selected' : ''}>MED-001 - Paracetamol 500mg Tablets</option>
          <option value="item-2" ${batch?.itemId === 'item-2' ? 'selected' : ''}>MED-002 - Amoxicillin 250mg Capsules</option>
          <option value="item-3" ${batch?.itemId === 'item-3' ? 'selected' : ''}>SUP-001 - Surgical Gloves Large</option>
          <option value="item-4" ${batch?.itemId === 'item-4' ? 'selected' : ''}>SUP-002 - Face Masks Surgical</option>
        </select>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Quantity *</label>
          <input type="number" class="form-input" name="quantity" value="${batch?.quantity || ''}" required>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">PO Number</label>
          <input type="text" class="form-input" name="poNumber" value="${batch?.poNumber || ''}">
        </div>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Received Date *</label>
          <input type="date" class="form-input" name="receivedDate" value="${batch?.receivedDate.split('T')[0] || ''}" required>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Expiry Date *</label>
          <input type="date" class="form-input" name="expiryDate" value="${batch?.expiryDate.split('T')[0] || ''}" required>
        </div>
      </div>
    </form>
  `;

  modal.form(
    mode === 'create' ? 'Create Stock Batch' : 'Edit Stock Batch',
    content,
    async () => {
      const form = document.getElementById('batch-form') as HTMLFormElement;
      if (form.checkValidity()) {
        const formData = new FormData(form);
        console.log('Batch saved:', Object.fromEntries(formData.entries()));
        window.location.reload();
      } else {
        form.reportValidity();
      }
    },
    mode
  );
}
