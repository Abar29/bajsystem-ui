import { modal } from '../components/Modal';
import { Icons } from '../components/Icons';
import { FilterPanel, type FilterConfig } from '../components/FilterPanel';

interface Return {
  id: string;
  returnNumber: string;
  returnDate: string;
  type: 'return' | 'recall';
  deliveryNumber: string;
  agencyName: string;
  reason: string;
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'rejected';
  items: Array<{
    itemCode: string;
    itemName: string;
    quantity: number;
    unit: string;
    batchNumber: string;
    condition: 'damaged' | 'expired' | 'defective' | 'other';
  }>;
  requestedBy: string;
  approvedBy?: string;
  notes?: string;
}

const mockReturns: Return[] = [
  {
    id: 'ret-1',
    returnNumber: 'RET-2024-0042',
    returnDate: '2024-06-22T09:00:00Z',
    type: 'return',
    deliveryNumber: 'DO-2024-0087',
    agencyName: 'North Regional Health Center',
    reason: 'Damaged during transport',
    status: 'completed',
    items: [
      {
        itemCode: 'MED-001',
        itemName: 'Paracetamol 500mg Tablets',
        quantity: 5,
        unit: 'Box',
        batchNumber: 'BATCH-2024-001',
        condition: 'damaged',
      },
    ],
    requestedBy: 'Dr. Emily Watson',
    approvedBy: 'Warehouse Manager',
    notes: 'Replaced with good items from same batch',
  },
  {
    id: 'ret-2',
    returnNumber: 'RCL-2024-0015',
    returnDate: '2024-06-23T10:00:00Z',
    type: 'recall',
    deliveryNumber: 'DO-2024-0075',
    agencyName: 'Central Medical Clinic',
    reason: 'Product recall - quality issue',
    status: 'processing',
    items: [
      {
        itemCode: 'MED-002',
        itemName: 'Amoxicillin 250mg Capsules',
        quantity: 30,
        unit: 'Box',
        batchNumber: 'BATCH-2024-002',
        condition: 'defective',
      },
    ],
    requestedBy: 'Quality Control',
    approvedBy: 'Manager',
    notes: 'Manufacturer recall notice - batch contamination suspected',
  },
  {
    id: 'ret-3',
    returnNumber: 'RET-2024-0043',
    returnDate: '2024-06-24T11:30:00Z',
    type: 'return',
    deliveryNumber: 'DO-2024-0088',
    agencyName: 'South District Hospital',
    reason: 'Near expiry date',
    status: 'pending',
    items: [
      {
        itemCode: 'SUP-001',
        itemName: 'Surgical Gloves Large',
        quantity: 10,
        unit: 'Box',
        batchNumber: 'BATCH-2024-010',
        condition: 'expired',
      },
    ],
    requestedBy: 'Dr. Maria Garcia',
    notes: 'Items approaching expiry - agency unable to use in time',
  },
];

export async function renderReturns(container: HTMLElement): Promise<void> {
  let currentFilters: any = {};
  
  const filterConfigs: FilterConfig[] = [
    { id: 'search', label: 'Search', type: 'search', placeholder: 'Search returns...' },
    { 
      id: 'status', 
      label: 'Status', 
      type: 'select',
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'approved', label: 'Approved' },
        { value: 'processing', label: 'Processing' },
        { value: 'completed', label: 'Completed' },
        { value: 'rejected', label: 'Rejected' }
      ]
    },
    { 
      id: 'type', 
      label: 'Type', 
      type: 'select',
      options: [
        { value: 'return', label: 'Return' },
        { value: 'recall', label: 'Recall' }
      ]
    },
    { id: 'dateRange', label: 'Return Date', type: 'dateRange' }
  ];

  const filterPanel = new FilterPanel(filterConfigs, (filters) => {
    currentFilters = filters;
    applyFilters();
  });

  const applyFilters = () => {
    let filtered = [...mockReturns];
    
    if (currentFilters.search) {
      const query = currentFilters.search.toLowerCase();
      filtered = filtered.filter(r => 
        r.returnNumber.toLowerCase().includes(query) ||
        r.deliveryNumber.toLowerCase().includes(query) ||
        r.agencyName.toLowerCase().includes(query) ||
        r.reason.toLowerCase().includes(query)
      );
    }
    
    if (currentFilters.status) {
      filtered = filtered.filter(r => r.status === currentFilters.status);
    }
    
    if (currentFilters.type) {
      filtered = filtered.filter(r => r.type === currentFilters.type);
    }
    
    if (currentFilters.dateRange?.start || currentFilters.dateRange?.end) {
      filtered = filtered.filter(r => {
        const date = new Date(r.returnDate);
        const start = currentFilters.dateRange.start ? new Date(currentFilters.dateRange.start) : null;
        const end = currentFilters.dateRange.end ? new Date(currentFilters.dateRange.end) : null;
        if (start && date < start) return false;
        if (end && date > end) return false;
        return true;
      });
    }
    
    const tableBody = document.querySelector('#returns-table tbody');
    if (tableBody) {
      tableBody.innerHTML = renderReturnRows(filtered);
      setupReturnActions(mockReturns);
    }
  };

  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Returns & Recalls</h1>
      <p class="page-subtitle">Manage product returns and recalls</p>
    </div>

    <div class="card">
      <div class="card-header">
        <h2 class="card-title">All Returns & Recalls</h2>
        <button class="btn btn-primary" id="add-return-btn">
          ${Icons.add}
          <span>New Return</span>
        </button>
      </div>

      ${filterPanel.render()}

      <div class="table-container">
        <table id="returns-table">
          <thead>
            <tr>
              <th>Return #</th>
              <th>Date</th>
              <th>Type</th>
              <th>Delivery #</th>
              <th>Agency</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${renderReturnRows(mockReturns)}
          </tbody>
        </table>
      </div>
    </div>
  `;

  filterPanel.setupEventListeners();
  setupReturnActions(mockReturns);
}

function renderReturnRows(returns: Return[]): string {
  return returns.map(ret => `
    <tr data-id="${ret.id}">
      <td><strong>${ret.returnNumber}</strong></td>
      <td>${new Date(ret.returnDate).toLocaleDateString()}</td>
      <td>
        <span class="badge badge-${ret.type === 'recall' ? 'danger' : 'warning'}">
          ${ret.type.toUpperCase()}
        </span>
      </td>
      <td>${ret.deliveryNumber}</td>
      <td>${ret.agencyName}</td>
      <td>${ret.reason}</td>
      <td>
        <span class="badge badge-${
          ret.status === 'completed' ? 'success' :
          ret.status === 'approved' || ret.status === 'processing' ? 'info' :
          ret.status === 'rejected' ? 'danger' : 'secondary'
        }">
          ${ret.status.toUpperCase()}
        </span>
      </td>
      <td>
        <button class="btn btn-sm btn-outline view-return" data-id="${ret.id}" title="View">${Icons.view}</button>
        <button class="btn btn-sm btn-outline edit-return" data-id="${ret.id}" title="Edit">${Icons.edit}</button>
        <button class="btn btn-sm btn-outline delete-return" data-id="${ret.id}" title="Delete">${Icons.delete}</button>
      </td>
    </tr>
  `).join('');
}

function setupReturnActions(returns: Return[]): void {
  document.getElementById('add-return-btn')?.addEventListener('click', () => {
    showReturnForm('create');
  });

  document.querySelectorAll('.view-return').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id;
      const ret = returns.find(r => r.id === id);
      if (ret) showReturnDetails(ret);
    });
  });

  document.querySelectorAll('.edit-return').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id;
      const ret = returns.find(r => r.id === id);
      if (ret) showReturnForm('edit', ret);
    });
  });

  document.querySelectorAll('.delete-return').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id;
      const ret = returns.find(r => r.id === id);
      if (ret) {
        modal.delete(
          'Delete Return',
          `Are you sure you want to delete <strong>${ret.returnNumber}</strong>?`,
          async () => {
            console.log('Return deleted:', id);
            window.location.reload();
          }
        );
      }
    });
  });
}

function showReturnDetails(ret: Return): void {
  const itemsHtml = ret.items.map(item => `
    <tr>
      <td>${item.itemCode}</td>
      <td>${item.itemName}</td>
      <td>${item.quantity} ${item.unit}</td>
      <td>${item.batchNumber}</td>
      <td>
        <span class="badge badge-danger">${item.condition.toUpperCase()}</span>
      </td>
    </tr>
  `).join('');

  const content = `
    <div class="modal-details">
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Return Number</label>
          <p><strong>${ret.returnNumber}</strong></p>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Type</label>
          <p><span class="badge badge-${ret.type === 'recall' ? 'danger' : 'warning'}">${ret.type.toUpperCase()}</span></p>
        </div>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Status</label>
          <p><span class="badge badge-${
            ret.status === 'completed' ? 'success' :
            ret.status === 'approved' || ret.status === 'processing' ? 'info' : 'secondary'
          }">${ret.status.toUpperCase()}</span></p>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Return Date</label>
          <p>${new Date(ret.returnDate).toLocaleDateString()}</p>
        </div>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Delivery Number</label>
          <p>${ret.deliveryNumber}</p>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Agency</label>
          <p>${ret.agencyName}</p>
        </div>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Reason</label>
        <p>${ret.reason}</p>
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
                <th>Condition</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
        </div>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Requested By</label>
          <p>${ret.requestedBy}</p>
        </div>
        ${ret.approvedBy ? `
          <div class="modal-form-group">
            <label class="modal-form-label">Approved By</label>
            <p>${ret.approvedBy}</p>
          </div>
        ` : ''}
      </div>
      ${ret.notes ? `
        <div class="modal-form-group">
          <label class="modal-form-label">Notes</label>
          <p>${ret.notes}</p>
        </div>
      ` : ''}
    </div>
  `;

  modal.view('Return/Recall Details', content, 'lg');
}

function showReturnForm(mode: 'create' | 'edit', ret?: Return): void {
  const content = `
    <form id="return-form">
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Return Number *</label>
          <input type="text" class="form-input" name="returnNumber" value="${ret?.returnNumber || ''}" required>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Type *</label>
          <select class="form-select" name="type" required>
            <option value="return" ${ret?.type === 'return' ? 'selected' : ''}>Return</option>
            <option value="recall" ${ret?.type === 'recall' ? 'selected' : ''}>Recall</option>
          </select>
        </div>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Status *</label>
          <select class="form-select" name="status" required>
            <option value="pending" ${ret?.status === 'pending' ? 'selected' : ''}>Pending</option>
            <option value="approved" ${ret?.status === 'approved' ? 'selected' : ''}>Approved</option>
            <option value="processing" ${ret?.status === 'processing' ? 'selected' : ''}>Processing</option>
            <option value="completed" ${ret?.status === 'completed' ? 'selected' : ''}>Completed</option>
            <option value="rejected" ${ret?.status === 'rejected' ? 'selected' : ''}>Rejected</option>
          </select>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Return Date *</label>
          <input type="datetime-local" class="form-input" name="returnDate" value="${ret?.returnDate.split('.')[0] || ''}" required>
        </div>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Delivery Number *</label>
          <input type="text" class="form-input" name="deliveryNumber" value="${ret?.deliveryNumber || ''}" required>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Agency *</label>
          <select class="form-select" name="agencyId" required>
            <option value="ag-1">North Regional Health Center</option>
            <option value="ag-2">Central Medical Clinic</option>
            <option value="ag-3">South District Hospital</option>
          </select>
        </div>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Reason *</label>
        <input type="text" class="form-input" name="reason" value="${ret?.reason || ''}" required>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Requested By *</label>
        <input type="text" class="form-input" name="requestedBy" value="${ret?.requestedBy || ''}" required>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Notes</label>
        <textarea class="form-textarea" name="notes">${ret?.notes || ''}</textarea>
      </div>
    </form>
  `;

  modal.form(
    mode === 'create' ? 'Create Return/Recall' : 'Edit Return/Recall',
    content,
    async () => {
      const form = document.getElementById('return-form') as HTMLFormElement;
      if (form.checkValidity()) {
        const formData = new FormData(form);
        console.log('Return saved:', Object.fromEntries(formData.entries()));
        window.location.reload();
      } else {
        form.reportValidity();
      }
    },
    mode
  );
}
