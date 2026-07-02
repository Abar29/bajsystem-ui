import { modal } from '../components/Modal';
import { Icons } from '../components/Icons';
import { FilterPanel, type FilterConfig } from '../components/FilterPanel';

interface QuotationRequest {
  id: string;
  requestNumber: string;
  requestDate: string;
  requester: string;
  department: string;
  suppliers: string[];
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'draft' | 'sent' | 'received' | 'closed';
  items: Array<{
    itemCode: string;
    itemName: string;
    quantity: number;
    unit: string;
    specifications: string;
  }>;
  notes?: string;
}

const mockQuotationRequests: QuotationRequest[] = [
  {
    id: 'qr-1',
    requestNumber: 'QR-2024-0010',
    requestDate: '2024-06-15T00:00:00Z',
    requester: 'John Doe',
    department: 'Purchasing',
    suppliers: ['ABC Medical Supplies Co.', 'Global Pharma Distributors'],
    dueDate: '2024-06-25T00:00:00Z',
    priority: 'high',
    status: 'received',
    items: [
      {
        itemCode: 'MED-001',
        itemName: 'Paracetamol 500mg Tablets',
        quantity: 500,
        unit: 'Box',
        specifications: 'Standard pharmaceutical grade',
      },
    ],
    notes: 'Urgent - stock running low',
  },
  {
    id: 'qr-2',
    requestNumber: 'QR-2024-0011',
    requestDate: '2024-06-18T00:00:00Z',
    requester: 'Jane Smith',
    department: 'Operations',
    suppliers: ['HealthCare Equipment Inc.'],
    dueDate: '2024-06-28T00:00:00Z',
    priority: 'medium',
    status: 'sent',
    items: [
      {
        itemCode: 'SUP-001',
        itemName: 'Surgical Gloves Large',
        quantity: 1000,
        unit: 'Box',
        specifications: 'Latex-free, powder-free',
      },
    ],
  },
  {
    id: 'qr-3',
    requestNumber: 'QR-2024-0012',
    requestDate: '2024-06-20T00:00:00Z',
    requester: 'Mike Johnson',
    department: 'Purchasing',
    suppliers: ['ABC Medical Supplies Co.'],
    dueDate: '2024-07-01T00:00:00Z',
    priority: 'low',
    status: 'draft',
    items: [
      {
        itemCode: 'MED-002',
        itemName: 'Amoxicillin 250mg Capsules',
        quantity: 300,
        unit: 'Box',
        specifications: 'WHO certified',
      },
    ],
  },
];

export async function renderQuotationRequests(container: HTMLElement): Promise<void> {
  let currentFilters: any = {};
  
  const filterConfigs: FilterConfig[] = [
    { id: 'search', label: 'Search', type: 'search', placeholder: 'Search requests...' },
    { 
      id: 'status', 
      label: 'Status', 
      type: 'select',
      options: [
        { value: 'draft', label: 'Draft' },
        { value: 'sent', label: 'Sent' },
        { value: 'received', label: 'Received' },
        { value: 'closed', label: 'Closed' }
      ]
    },
    { 
      id: 'priority', 
      label: 'Priority', 
      type: 'select',
      options: [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' }
      ]
    },
    { id: 'dateRange', label: 'Request Date', type: 'dateRange' }
  ];

  const filterPanel = new FilterPanel(filterConfigs, (filters) => {
    currentFilters = filters;
    applyFilters();
  });

  const applyFilters = () => {
    let filtered = [...mockQuotationRequests];
    
    if (currentFilters.search) {
      const query = currentFilters.search.toLowerCase();
      filtered = filtered.filter(r => 
        r.requestNumber.toLowerCase().includes(query) ||
        r.requester.toLowerCase().includes(query)
      );
    }
    
    if (currentFilters.status) {
      filtered = filtered.filter(r => r.status === currentFilters.status);
    }
    
    if (currentFilters.priority) {
      filtered = filtered.filter(r => r.priority === currentFilters.priority);
    }
    
    if (currentFilters.dateRange?.start || currentFilters.dateRange?.end) {
      filtered = filtered.filter(r => {
        const date = new Date(r.requestDate);
        const start = currentFilters.dateRange.start ? new Date(currentFilters.dateRange.start) : null;
        const end = currentFilters.dateRange.end ? new Date(currentFilters.dateRange.end) : null;
        if (start && date < start) return false;
        if (end && date > end) return false;
        return true;
      });
    }
    
    const tableBody = document.querySelector('#qr-table tbody');
    if (tableBody) {
      tableBody.innerHTML = renderQRRows(filtered);
      setupQRActions(mockQuotationRequests);
    }
  };

  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Quotation Requests</h1>
      <p class="page-subtitle">Request quotations from suppliers</p>
    </div>

    <div class="card">
      <div class="card-header">
        <h2 class="card-title">All Quotation Requests</h2>
        <button class="btn btn-primary" id="add-qr-btn">
          ${Icons.add}
          <span>Create Request</span>
        </button>
      </div>

      ${filterPanel.render()}

      <div class="table-container">
        <table id="qr-table">
          <thead>
            <tr>
              <th>Request #</th>
              <th>Date</th>
              <th>Requester</th>
              <th>Due Date</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${renderQRRows(mockQuotationRequests)}
          </tbody>
        </table>
      </div>
    </div>
  `;

  filterPanel.setupEventListeners();
  setupQRActions(mockQuotationRequests);
}

function renderQRRows(requests: QuotationRequest[]): string {
  return requests.map(qr => `
    <tr data-id="${qr.id}">
      <td><strong>${qr.requestNumber}</strong></td>
      <td>${new Date(qr.requestDate).toLocaleDateString()}</td>
      <td>${qr.requester}</td>
      <td>${new Date(qr.dueDate).toLocaleDateString()}</td>
      <td>
        <span class="badge badge-${
          qr.priority === 'high' ? 'danger' : 
          qr.priority === 'medium' ? 'warning' : 'secondary'
        }">
          ${qr.priority.toUpperCase()}
        </span>
      </td>
      <td>
        <span class="badge badge-${
          qr.status === 'received' ? 'success' : 
          qr.status === 'sent' ? 'info' :
          qr.status === 'draft' ? 'secondary' : 'dark'
        }">
          ${qr.status.toUpperCase()}
        </span>
      </td>
      <td>
        <button class="btn btn-sm btn-outline view-qr" data-id="${qr.id}" title="View">${Icons.view}</button>
        <button class="btn btn-sm btn-outline edit-qr" data-id="${qr.id}" title="Edit">${Icons.edit}</button>
        <button class="btn btn-sm btn-outline delete-qr" data-id="${qr.id}" title="Delete">${Icons.delete}</button>
      </td>
    </tr>
  `).join('');
}

function setupQRActions(requests: QuotationRequest[]): void {
  document.getElementById('add-qr-btn')?.addEventListener('click', () => {
    showQRForm('create');
  });

  document.querySelectorAll('.view-qr').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id;
      const qr = requests.find(r => r.id === id);
      if (qr) showQRDetails(qr);
    });
  });

  document.querySelectorAll('.edit-qr').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id;
      const qr = requests.find(r => r.id === id);
      if (qr) showQRForm('edit', qr);
    });
  });

  document.querySelectorAll('.delete-qr').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id;
      const qr = requests.find(r => r.id === id);
      if (qr) {
        modal.delete(
          'Delete Request',
          `Are you sure you want to delete <strong>${qr.requestNumber}</strong>?`,
          async () => {
            console.log('Request deleted:', id);
            window.location.reload();
          }
        );
      }
    });
  });
}

function showQRDetails(qr: QuotationRequest): void {
  const itemsHtml = qr.items.map(item => `
    <tr>
      <td>${item.itemCode}</td>
      <td>${item.itemName}</td>
      <td>${item.quantity} ${item.unit}</td>
      <td>${item.specifications}</td>
    </tr>
  `).join('');

  const content = `
    <div class="modal-details">
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Request Number</label>
          <p><strong>${qr.requestNumber}</strong></p>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Status</label>
          <p><span class="badge badge-${
            qr.status === 'received' ? 'success' : 
            qr.status === 'sent' ? 'info' : 'secondary'
          }">${qr.status.toUpperCase()}</span></p>
        </div>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Requester</label>
          <p>${qr.requester}</p>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Department</label>
          <p>${qr.department}</p>
        </div>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Request Date</label>
          <p>${new Date(qr.requestDate).toLocaleDateString()}</p>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Due Date</label>
          <p>${new Date(qr.dueDate).toLocaleDateString()}</p>
        </div>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Suppliers</label>
        <p>${qr.suppliers.join(', ')}</p>
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
                <th>Specifications</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
        </div>
      </div>
      ${qr.notes ? `
        <div class="modal-form-group">
          <label class="modal-form-label">Notes</label>
          <p>${qr.notes}</p>
        </div>
      ` : ''}
    </div>
  `;

  modal.view('Quotation Request Details', content, 'lg');
}

function showQRForm(mode: 'create' | 'edit', qr?: QuotationRequest): void {
  const content = `
    <form id="qr-form">
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Request Number *</label>
          <input type="text" class="form-input" name="requestNumber" value="${qr?.requestNumber || ''}" required>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Status *</label>
          <select class="form-select" name="status" required>
            <option value="draft" ${qr?.status === 'draft' ? 'selected' : ''}>Draft</option>
            <option value="sent" ${qr?.status === 'sent' ? 'selected' : ''}>Sent</option>
            <option value="received" ${qr?.status === 'received' ? 'selected' : ''}>Received</option>
            <option value="closed" ${qr?.status === 'closed' ? 'selected' : ''}>Closed</option>
          </select>
        </div>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Requester *</label>
          <input type="text" class="form-input" name="requester" value="${qr?.requester || ''}" required>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Department *</label>
          <input type="text" class="form-input" name="department" value="${qr?.department || ''}" required>
        </div>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Request Date *</label>
          <input type="date" class="form-input" name="requestDate" value="${qr?.requestDate.split('T')[0] || ''}" required>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Due Date *</label>
          <input type="date" class="form-input" name="dueDate" value="${qr?.dueDate.split('T')[0] || ''}" required>
        </div>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Priority *</label>
        <select class="form-select" name="priority" required>
          <option value="low" ${qr?.priority === 'low' ? 'selected' : ''}>Low</option>
          <option value="medium" ${qr?.priority === 'medium' ? 'selected' : ''}>Medium</option>
          <option value="high" ${qr?.priority === 'high' ? 'selected' : ''}>High</option>
        </select>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Notes</label>
        <textarea class="form-textarea" name="notes">${qr?.notes || ''}</textarea>
      </div>
    </form>
  `;

  modal.form(
    mode === 'create' ? 'Create Quotation Request' : 'Edit Quotation Request',
    content,
    async () => {
      const form = document.getElementById('qr-form') as HTMLFormElement;
      if (form.checkValidity()) {
        const formData = new FormData(form);
        console.log('Quotation Request saved:', Object.fromEntries(formData.entries()));
        window.location.reload();
      } else {
        form.reportValidity();
      }
    },
    mode
  );
}
