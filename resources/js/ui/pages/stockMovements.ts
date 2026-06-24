import { modal } from '../components/Modal';

interface StockMovement {
  id: string;
  movementNumber: string;
  movementDate: string;
  movementType: 'in' | 'out' | 'transfer' | 'adjustment';
  itemCode: string;
  itemName: string;
  quantity: number;
  unit: string;
  fromLocation?: string;
  toLocation?: string;
  batchNumber?: string;
  reference: string;
  performedBy: string;
  notes?: string;
}

const mockStockMovements: StockMovement[] = [
  {
    id: 'mv-1',
    movementNumber: 'MV-2024-0001',
    movementDate: '2024-06-20T10:30:00Z',
    movementType: 'in',
    itemCode: 'MED-001',
    itemName: 'Paracetamol 500mg Tablets',
    quantity: 500,
    unit: 'Box',
    toLocation: 'Main Warehouse',
    batchNumber: 'BATCH-2024-001',
    reference: 'PO-2024-0156',
    performedBy: 'Robert Johnson',
    notes: 'Received from supplier',
  },
  {
    id: 'mv-2',
    movementNumber: 'MV-2024-0002',
    movementDate: '2024-06-21T14:15:00Z',
    movementType: 'out',
    itemCode: 'MED-001',
    itemName: 'Paracetamol 500mg Tablets',
    quantity: 100,
    unit: 'Box',
    fromLocation: 'Main Warehouse',
    batchNumber: 'BATCH-2024-001',
    reference: 'DO-2024-0089',
    performedBy: 'Warehouse Team',
    notes: 'Delivered to North Branch',
  },
  {
    id: 'mv-3',
    movementNumber: 'MV-2024-0003',
    movementDate: '2024-06-22T09:00:00Z',
    movementType: 'transfer',
    itemCode: 'SUP-001',
    itemName: 'Surgical Gloves Large',
    quantity: 200,
    unit: 'Box',
    fromLocation: 'Main Warehouse',
    toLocation: 'Cold Storage Facility',
    batchNumber: 'BATCH-2024-010',
    reference: 'TRF-2024-0015',
    performedBy: 'Lisa Chen',
    notes: 'Stock redistribution',
  },
  {
    id: 'mv-4',
    movementNumber: 'MV-2024-0004',
    movementDate: '2024-06-22T11:45:00Z',
    movementType: 'adjustment',
    itemCode: 'MED-002',
    itemName: 'Amoxicillin 250mg Capsules',
    quantity: -5,
    unit: 'Box',
    fromLocation: 'Cold Storage Facility',
    reference: 'ADJ-2024-0008',
    performedBy: 'Warehouse Manager',
    notes: 'Damaged items removed',
  },
];

export async function renderStockMovements(container: HTMLElement): Promise<void> {
  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Stock Movements</h1>
      <p class="page-subtitle">Track all inventory movements</p>
    </div>

    <div class="card">
      <div class="card-header">
        <h2 class="card-title">All Stock Movements</h2>
        <button class="btn btn-primary" id="add-movement-btn">
          <span>➕</span>
          Record Movement
        </button>
      </div>

      <div class="search-box">
        <input 
          type="text" 
          class="search-input" 
          placeholder="Search movements..."
          id="movement-search"
        />
      </div>

      <div class="table-container">
        <table id="movements-table">
          <thead>
            <tr>
              <th>Movement #</th>
              <th>Date</th>
              <th>Type</th>
              <th>Item</th>
              <th>Quantity</th>
              <th>Location</th>
              <th>Reference</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${renderMovementRows(mockStockMovements)}
          </tbody>
        </table>
      </div>
    </div>
  `;

  setupMovementSearch(mockStockMovements);
  setupMovementActions(mockStockMovements);
}

function renderMovementRows(movements: StockMovement[]): string {
  return movements.map(mv => `
    <tr data-id="${mv.id}">
      <td><strong>${mv.movementNumber}</strong></td>
      <td>${new Date(mv.movementDate).toLocaleString()}</td>
      <td>
        <span class="badge badge-${
          mv.movementType === 'in' ? 'success' :
          mv.movementType === 'out' ? 'info' :
          mv.movementType === 'transfer' ? 'warning' : 'secondary'
        }">
          ${mv.movementType.toUpperCase()}
        </span>
      </td>
      <td>${mv.itemCode} - ${mv.itemName}</td>
      <td class="${mv.quantity < 0 ? 'text-danger' : 'text-success'}">
        ${mv.quantity > 0 ? '+' : ''}${mv.quantity} ${mv.unit}
      </td>
      <td>
        ${mv.fromLocation ? `From: ${mv.fromLocation}` : ''}
        ${mv.fromLocation && mv.toLocation ? '<br>' : ''}
        ${mv.toLocation ? `To: ${mv.toLocation}` : ''}
      </td>
      <td>${mv.reference}</td>
      <td>
        <button class="btn btn-sm btn-outline view-movement" data-id="${mv.id}" title="View">👁️</button>
      </td>
    </tr>
  `).join('');
}

function setupMovementSearch(movements: StockMovement[]): void {
  const searchInput = document.getElementById('movement-search') as HTMLInputElement;
  const tableBody = document.querySelector('#movements-table tbody');

  if (!searchInput || !tableBody) return;

  searchInput.addEventListener('input', (e) => {
    const query = (e.target as HTMLInputElement).value.toLowerCase();
    const filtered = movements.filter(m => 
      m.movementNumber.toLowerCase().includes(query) ||
      m.itemName.toLowerCase().includes(query) ||
      m.reference.toLowerCase().includes(query)
    );
    tableBody.innerHTML = renderMovementRows(filtered);
    setupMovementActions(movements);
  });
}

function setupMovementActions(movements: StockMovement[]): void {
  document.getElementById('add-movement-btn')?.addEventListener('click', () => {
    showMovementForm('create');
  });

  document.querySelectorAll('.view-movement').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id;
      const movement = movements.find(m => m.id === id);
      if (movement) showMovementDetails(movement);
    });
  });
}

function showMovementDetails(mv: StockMovement): void {
  const content = `
    <div class="modal-details">
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Movement Number</label>
          <p><strong>${mv.movementNumber}</strong></p>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Type</label>
          <p><span class="badge badge-${
            mv.movementType === 'in' ? 'success' :
            mv.movementType === 'out' ? 'info' :
            mv.movementType === 'transfer' ? 'warning' : 'secondary'
          }">${mv.movementType.toUpperCase()}</span></p>
        </div>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Date & Time</label>
        <p>${new Date(mv.movementDate).toLocaleString()}</p>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Item</label>
        <p>${mv.itemCode} - ${mv.itemName}</p>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Quantity</label>
          <p class="${mv.quantity < 0 ? 'text-danger' : 'text-success'}">
            ${mv.quantity > 0 ? '+' : ''}${mv.quantity} ${mv.unit}
          </p>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Batch Number</label>
          <p>${mv.batchNumber || 'N/A'}</p>
        </div>
      </div>
      ${mv.fromLocation ? `
        <div class="modal-form-group">
          <label class="modal-form-label">From Location</label>
          <p>${mv.fromLocation}</p>
        </div>
      ` : ''}
      ${mv.toLocation ? `
        <div class="modal-form-group">
          <label class="modal-form-label">To Location</label>
          <p>${mv.toLocation}</p>
        </div>
      ` : ''}
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Reference</label>
          <p>${mv.reference}</p>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Performed By</label>
          <p>${mv.performedBy}</p>
        </div>
      </div>
      ${mv.notes ? `
        <div class="modal-form-group">
          <label class="modal-form-label">Notes</label>
          <p>${mv.notes}</p>
        </div>
      ` : ''}
    </div>
  `;

  modal.view('Stock Movement Details', content, 'lg');
}

function showMovementForm(mode: 'create' | 'edit', mv?: StockMovement): void {
  const content = `
    <form id="movement-form">
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Movement Number *</label>
          <input type="text" class="form-input" name="movementNumber" value="${mv?.movementNumber || ''}" required>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Type *</label>
          <select class="form-select" name="movementType" required>
            <option value="in" ${mv?.movementType === 'in' ? 'selected' : ''}>In</option>
            <option value="out" ${mv?.movementType === 'out' ? 'selected' : ''}>Out</option>
            <option value="transfer" ${mv?.movementType === 'transfer' ? 'selected' : ''}>Transfer</option>
            <option value="adjustment" ${mv?.movementType === 'adjustment' ? 'selected' : ''}>Adjustment</option>
          </select>
        </div>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Item *</label>
        <select class="form-select" name="itemId" required>
          <option value="item-1">MED-001 - Paracetamol 500mg Tablets</option>
          <option value="item-2">MED-002 - Amoxicillin 250mg Capsules</option>
          <option value="item-3">SUP-001 - Surgical Gloves Large</option>
        </select>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Quantity *</label>
          <input type="number" class="form-input" name="quantity" value="${mv?.quantity || ''}" required>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Reference *</label>
          <input type="text" class="form-input" name="reference" value="${mv?.reference || ''}" required>
        </div>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Notes</label>
        <textarea class="form-textarea" name="notes">${mv?.notes || ''}</textarea>
      </div>
    </form>
  `;

  modal.form(
    mode === 'create' ? 'Record Stock Movement' : 'Edit Stock Movement',
    content,
    async () => {
      const form = document.getElementById('movement-form') as HTMLFormElement;
      if (form.checkValidity()) {
        const formData = new FormData(form);
        console.log('Movement saved:', Object.fromEntries(formData.entries()));
        window.location.reload();
      } else {
        form.reportValidity();
      }
    },
    mode
  );
}
