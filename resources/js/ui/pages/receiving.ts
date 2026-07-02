import { modal } from '../components/Modal';
import { Icons } from '../components/Icons';
import { FilterPanel, type FilterConfig } from '../components/FilterPanel';

interface Receiving {
  id: string;
  receivingNumber: string;
  receivingDate: string;
  poNumber: string;
  supplierName: string;
  warehouseName: string;
  status: 'pending' | 'partial' | 'completed' | 'discrepancy';
  items: Array<{
    itemCode: string;
    itemName: string;
    orderedQuantity: number;
    receivedQuantity: number;
    unit: string;
    batchNumber?: string;
    condition: 'good' | 'damaged' | 'expired';
  }>;
  receivedBy: string;
  notes?: string;
}

const mockReceivings: Receiving[] = [
  {
    id: 'rcv-1',
    receivingNumber: 'RCV-2024-0045',
    receivingDate: '2024-06-20T10:30:00Z',
    poNumber: 'PO-2024-0156',
    supplierName: 'ABC Medical Supplies Co.',
    warehouseName: 'Main Warehouse',
    status: 'completed',
    items: [
      {
        itemCode: 'MED-001',
        itemName: 'Paracetamol 500mg Tablets',
        orderedQuantity: 500,
        receivedQuantity: 500,
        unit: 'Box',
        batchNumber: 'BATCH-2024-001',
        condition: 'good',
      },
    ],
    receivedBy: 'Robert Johnson',
    notes: 'All items received in good condition',
  },
  {
    id: 'rcv-2',
    receivingNumber: 'RCV-2024-0046',
    receivingDate: '2024-06-21T14:00:00Z',
    poNumber: 'PO-2024-0157',
    supplierName: 'Global Pharma Distributors',
    warehouseName: 'Cold Storage Facility',
    status: 'partial',
    items: [
      {
        itemCode: 'MED-002',
        itemName: 'Amoxicillin 250mg Capsules',
        orderedQuantity: 300,
        receivedQuantity: 250,
        unit: 'Box',
        batchNumber: 'BATCH-2024-002',
        condition: 'good',
      },
    ],
    receivedBy: 'Lisa Chen',
    notes: 'Partial delivery - 50 boxes short, supplier to deliver remaining soon',
  },
  {
    id: 'rcv-3',
    receivingNumber: 'RCV-2024-0047',
    receivingDate: '2024-06-22T09:15:00Z',
    poNumber: 'PO-2024-0158',
    supplierName: 'HealthCare Equipment Inc.',
    warehouseName: 'Main Warehouse',
    status: 'discrepancy',
    items: [
      {
        itemCode: 'SUP-001',
        itemName: 'Surgical Gloves Large',
        orderedQuantity: 1000,
        receivedQuantity: 980,
        unit: 'Box',
        batchNumber: 'BATCH-2024-010',
        condition: 'good',
      },
      {
        itemCode: 'SUP-001',
        itemName: 'Surgical Gloves Large',
        orderedQuantity: 0,
        receivedQuantity: 20,
        unit: 'Box',
        batchNumber: 'BATCH-2024-010',
        condition: 'damaged',
      },
    ],
    receivedBy: 'Robert Johnson',
    notes: '20 boxes damaged during transport - reported to supplier',
  },
];

export async function renderReceiving(container: HTMLElement): Promise<void> {
  let currentFilters: any = {};
  
  const filterConfigs: FilterConfig[] = [
    { id: 'search', label: 'Search', type: 'search', placeholder: 'Search receiving records...' },
    { 
      id: 'status', 
      label: 'Status', 
      type: 'select',
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'partial', label: 'Partial' },
        { value: 'completed', label: 'Completed' },
        { value: 'discrepancy', label: 'Discrepancy' }
      ]
    },
    { id: 'dateRange', label: 'Receiving Date', type: 'dateRange' }
  ];

  const filterPanel = new FilterPanel(filterConfigs, (filters) => {
    currentFilters = filters;
    applyFilters();
  });

  const applyFilters = () => {
    let filtered = [...mockReceivings];
    
    if (currentFilters.search) {
      const query = currentFilters.search.toLowerCase();
      filtered = filtered.filter(r => 
        r.receivingNumber.toLowerCase().includes(query) ||
        r.poNumber.toLowerCase().includes(query) ||
        r.supplierName.toLowerCase().includes(query)
      );
    }
    
    if (currentFilters.status) {
      filtered = filtered.filter(r => r.status === currentFilters.status);
    }
    
    if (currentFilters.dateRange?.start || currentFilters.dateRange?.end) {
      filtered = filtered.filter(r => {
        const date = new Date(r.receivingDate);
        const start = currentFilters.dateRange.start ? new Date(currentFilters.dateRange.start) : null;
        const end = currentFilters.dateRange.end ? new Date(currentFilters.dateRange.end) : null;
        if (start && date < start) return false;
        if (end && date > end) return false;
        return true;
      });
    }
    
    const tableBody = document.querySelector('#receiving-table tbody');
    if (tableBody) {
      tableBody.innerHTML = renderReceivingRows(filtered);
      setupReceivingActions(mockReceivings);
    }
  };

  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Receiving</h1>
      <p class="page-subtitle">Receive and inspect incoming stock</p>
    </div>

    <div class="card">
      <div class="card-header">
        <h2 class="card-title">All Receiving Records</h2>
        <button class="btn btn-primary" id="add-receiving-btn">
          ${Icons.add}
          <span>New Receiving</span>
        </button>
      </div>

      ${filterPanel.render()}

      <div class="table-container">
        <table id="receiving-table">
          <thead>
            <tr>
              <th>Receiving #</th>
              <th>Date</th>
              <th>PO Number</th>
              <th>Supplier</th>
              <th>Warehouse</th>
              <th>Status</th>
              <th>Received By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${renderReceivingRows(mockReceivings)}
          </tbody>
        </table>
      </div>
    </div>
  `;

  filterPanel.setupEventListeners();
  setupReceivingActions(mockReceivings);
}

function renderReceivingRows(receivings: Receiving[]): string {
  return receivings.map(rcv => `
    <tr data-id="${rcv.id}">
      <td><strong>${rcv.receivingNumber}</strong></td>
      <td>${new Date(rcv.receivingDate).toLocaleString()}</td>
      <td>${rcv.poNumber}</td>
      <td>${rcv.supplierName}</td>
      <td>${rcv.warehouseName}</td>
      <td>
        <span class="badge badge-${
          rcv.status === 'completed' ? 'success' :
          rcv.status === 'partial' ? 'warning' :
          rcv.status === 'discrepancy' ? 'danger' : 'secondary'
        }">
          ${rcv.status.toUpperCase()}
        </span>
      </td>
      <td>${rcv.receivedBy}</td>
      <td>
        <button class="btn btn-sm btn-outline view-receiving" data-id="${rcv.id}" title="View">${Icons.view}</button>
        <button class="btn btn-sm btn-outline edit-receiving" data-id="${rcv.id}" title="Edit">${Icons.edit}</button>
        <button class="btn btn-sm btn-outline delete-receiving" data-id="${rcv.id}" title="Delete">${Icons.delete}</button>
      </td>
    </tr>
  `).join('');
}

function setupReceivingActions(receivings: Receiving[]): void {
  document.getElementById('add-receiving-btn')?.addEventListener('click', () => {
    showReceivingForm('create');
  });

  document.querySelectorAll('.view-receiving').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id;
      const receiving = receivings.find(r => r.id === id);
      if (receiving) showReceivingDetails(receiving);
    });
  });

  document.querySelectorAll('.edit-receiving').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id;
      const receiving = receivings.find(r => r.id === id);
      if (receiving) showReceivingForm('edit', receiving);
    });
  });

  document.querySelectorAll('.delete-receiving').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id;
      const receiving = receivings.find(r => r.id === id);
      if (receiving) {
        modal.delete(
          'Delete Receiving Record',
          `Are you sure you want to delete <strong>${receiving.receivingNumber}</strong>?`,
          async () => {
            console.log('Receiving deleted:', id);
            window.location.reload();
          }
        );
      }
    });
  });
}

function showReceivingDetails(rcv: Receiving): void {
  const itemsHtml = rcv.items.map(item => `
    <tr>
      <td>${item.itemCode}</td>
      <td>${item.itemName}</td>
      <td>${item.orderedQuantity}</td>
      <td class="${item.receivedQuantity !== item.orderedQuantity ? 'text-warning' : ''}">${item.receivedQuantity}</td>
      <td>${item.unit}</td>
      <td>${item.batchNumber || 'N/A'}</td>
      <td>
        <span class="badge badge-${item.condition === 'good' ? 'success' : 'danger'}">
          ${item.condition.toUpperCase()}
        </span>
      </td>
    </tr>
  `).join('');

  const content = `
    <div class="modal-details">
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Receiving Number</label>
          <p><strong>${rcv.receivingNumber}</strong></p>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Status</label>
          <p><span class="badge badge-${
            rcv.status === 'completed' ? 'success' :
            rcv.status === 'partial' ? 'warning' : 'danger'
          }">${rcv.status.toUpperCase()}</span></p>
        </div>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">PO Number</label>
          <p>${rcv.poNumber}</p>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Receiving Date</label>
          <p>${new Date(rcv.receivingDate).toLocaleString()}</p>
        </div>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Supplier</label>
          <p>${rcv.supplierName}</p>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Warehouse</label>
          <p>${rcv.warehouseName}</p>
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
                <th>Ordered</th>
                <th>Received</th>
                <th>Unit</th>
                <th>Batch</th>
                <th>Condition</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
        </div>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Received By</label>
        <p>${rcv.receivedBy}</p>
      </div>
      ${rcv.notes ? `
        <div class="modal-form-group">
          <label class="modal-form-label">Notes</label>
          <p>${rcv.notes}</p>
        </div>
      ` : ''}
    </div>
  `;

  modal.view('Receiving Details', content, 'lg');
}

function showReceivingForm(mode: 'create' | 'edit', rcv?: Receiving): void {
  const content = `
    <form id="receiving-form">
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Receiving Number *</label>
          <input type="text" class="form-input" name="receivingNumber" value="${rcv?.receivingNumber || ''}" required>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Status *</label>
          <select class="form-select" name="status" required>
            <option value="pending" ${rcv?.status === 'pending' ? 'selected' : ''}>Pending</option>
            <option value="partial" ${rcv?.status === 'partial' ? 'selected' : ''}>Partial</option>
            <option value="completed" ${rcv?.status === 'completed' ? 'selected' : ''}>Completed</option>
            <option value="discrepancy" ${rcv?.status === 'discrepancy' ? 'selected' : ''}>Discrepancy</option>
          </select>
        </div>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">PO Number *</label>
          <input type="text" class="form-input" name="poNumber" value="${rcv?.poNumber || ''}" required>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Receiving Date *</label>
          <input type="datetime-local" class="form-input" name="receivingDate" value="${rcv?.receivingDate.split('.')[0] || ''}" required>
        </div>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Supplier *</label>
          <select class="form-select" name="supplierId" required>
            <option value="sup-1">ABC Medical Supplies Co.</option>
            <option value="sup-2">Global Pharma Distributors</option>
            <option value="sup-3">HealthCare Equipment Inc.</option>
          </select>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Warehouse *</label>
          <select class="form-select" name="warehouseId" required>
            <option value="wh-1">Main Warehouse</option>
            <option value="wh-2">Cold Storage Facility</option>
          </select>
        </div>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Received By *</label>
        <input type="text" class="form-input" name="receivedBy" value="${rcv?.receivedBy || ''}" required>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Notes</label>
        <textarea class="form-textarea" name="notes">${rcv?.notes || ''}</textarea>
      </div>
    </form>
  `;

  modal.form(
    mode === 'create' ? 'Create Receiving Record' : 'Edit Receiving Record',
    content,
    async () => {
      const form = document.getElementById('receiving-form') as HTMLFormElement;
      if (form.checkValidity()) {
        const formData = new FormData(form);
        console.log('Receiving saved:', Object.fromEntries(formData.entries()));
        window.location.reload();
      } else {
        form.reportValidity();
      }
    },
    mode
  );
}
