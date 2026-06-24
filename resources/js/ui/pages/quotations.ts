import type { Quotation } from '../../types';
import { modal } from '../components/Modal';

// Mock quotations data
const mockQuotations: Quotation[] = [
  {
    id: 'quot-1',
    quotationNumber: 'QUOT-2024-0045',
    quotationDate: '2024-06-18T00:00:00Z',
    validUntil: '2024-07-18T00:00:00Z',
    supplierId: 'sup-1',
    supplierName: 'ABC Medical Supplies Co.',
    quotationRequestId: 'qr-1',
    status: 'accepted',
    items: [
      {
        itemId: 'item-1',
        itemCode: 'MED-001',
        itemName: 'Paracetamol 500mg Tablets',
        quantity: 500,
        unit: 'Box',
        unitPrice: 25.50,
        totalPrice: 12750.00,
        deliveryTime: '10 days',
      },
    ],
    totalAmount: 12750.00,
    createdAt: '2024-06-18T00:00:00Z',
    updatedAt: '2024-06-19T00:00:00Z',
  },
  {
    id: 'quot-2',
    quotationNumber: 'QUOT-2024-0046',
    quotationDate: '2024-06-19T00:00:00Z',
    validUntil: '2024-07-19T00:00:00Z',
    supplierId: 'sup-2',
    supplierName: 'Global Pharma Distributors',
    quotationRequestId: 'qr-2',
    status: 'pending',
    items: [
      {
        itemId: 'item-2',
        itemCode: 'MED-002',
        itemName: 'Amoxicillin 250mg Capsules',
        quantity: 300,
        unit: 'Box',
        unitPrice: 45.00,
        totalPrice: 13500.00,
        deliveryTime: '15 days',
      },
    ],
    totalAmount: 13500.00,
    createdAt: '2024-06-19T00:00:00Z',
    updatedAt: '2024-06-19T00:00:00Z',
  },
  {
    id: 'quot-3',
    quotationNumber: 'QUOT-2024-0047',
    quotationDate: '2024-06-20T00:00:00Z',
    validUntil: '2024-07-20T00:00:00Z',
    supplierId: 'sup-3',
    supplierName: 'HealthCare Equipment Inc.',
    quotationRequestId: 'qr-3',
    status: 'rejected',
    items: [
      {
        itemId: 'item-3',
        itemCode: 'SUP-001',
        itemName: 'Surgical Gloves Large',
        quantity: 1000,
        unit: 'Box',
        unitPrice: 18.50,
        totalPrice: 18500.00,
        deliveryTime: '7 days',
      },
    ],
    totalAmount: 18500.00,
    createdAt: '2024-06-20T00:00:00Z',
    updatedAt: '2024-06-21T00:00:00Z',
  },
];

export async function renderQuotations(container: HTMLElement): Promise<void> {
  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Quotations</h1>
      <p class="page-subtitle">Manage supplier quotations</p>
    </div>

    <div class="card">
      <div class="card-header">
        <h2 class="card-title">All Quotations</h2>
        <button class="btn btn-primary" id="add-quotation-btn">
          <span>➕</span>
          Add Quotation
        </button>
      </div>

      <div class="search-box">
        <input 
          type="text" 
          class="search-input" 
          placeholder="Search quotations by number or supplier..."
          id="quotation-search"
        />
      </div>

      <div class="table-container">
        <table id="quotations-table">
          <thead>
            <tr>
              <th>Quotation #</th>
              <th>Date</th>
              <th>Supplier</th>
              <th>Valid Until</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${renderQuotationRows(mockQuotations)}
          </tbody>
        </table>
      </div>
    </div>
  `;

  setupQuotationSearch(mockQuotations);
  setupQuotationActions(mockQuotations);
}

function renderQuotationRows(quotations: Quotation[]): string {
  return quotations.map(quot => `
    <tr data-id="${quot.id}">
      <td><strong>${quot.quotationNumber}</strong></td>
      <td>${new Date(quot.quotationDate).toLocaleDateString()}</td>
      <td>${quot.supplierName}</td>
      <td>${new Date(quot.validUntil).toLocaleDateString()}</td>
      <td>$${quot.totalAmount.toFixed(2)}</td>
      <td>
        <span class="badge badge-${
          quot.status === 'accepted' ? 'success' : 
          quot.status === 'pending' ? 'warning' : 'secondary'
        }">
          ${quot.status.toUpperCase()}
        </span>
      </td>
      <td>
        <button class="btn btn-sm btn-outline view-quotation" data-id="${quot.id}" title="View">👁️</button>
        <button class="btn btn-sm btn-outline edit-quotation" data-id="${quot.id}" title="Edit">✏️</button>
        <button class="btn btn-sm btn-outline delete-quotation" data-id="${quot.id}" title="Delete">🗑️</button>
      </td>
    </tr>
  `).join('');
}

function setupQuotationSearch(quotations: Quotation[]): void {
  const searchInput = document.getElementById('quotation-search') as HTMLInputElement;
  const tableBody = document.querySelector('#quotations-table tbody');

  if (!searchInput || !tableBody) return;

  searchInput.addEventListener('input', (e) => {
    const query = (e.target as HTMLInputElement).value.toLowerCase();
    const filtered = quotations.filter(q => 
      q.quotationNumber.toLowerCase().includes(query) ||
      q.supplierName.toLowerCase().includes(query)
    );
    tableBody.innerHTML = renderQuotationRows(filtered);
    setupQuotationActions(quotations);
  });
}

function setupQuotationActions(quotations: Quotation[]): void {
  document.getElementById('add-quotation-btn')?.addEventListener('click', () => {
    showQuotationForm('create');
  });

  document.querySelectorAll('.view-quotation').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id;
      const quotation = quotations.find(q => q.id === id);
      if (quotation) showQuotationDetails(quotation);
    });
  });

  document.querySelectorAll('.edit-quotation').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id;
      const quotation = quotations.find(q => q.id === id);
      if (quotation) showQuotationForm('edit', quotation);
    });
  });

  document.querySelectorAll('.delete-quotation').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id;
      const quotation = quotations.find(q => q.id === id);
      if (quotation) {
        modal.delete(
          'Delete Quotation',
          `Are you sure you want to delete <strong>${quotation.quotationNumber}</strong>?`,
          async () => {
            console.log('Quotation deleted:', id);
            window.location.reload();
          }
        );
      }
    });
  });
}

function showQuotationDetails(quotation: Quotation): void {
  const itemsHtml = quotation.items.map(item => `
    <tr>
      <td>${item.itemCode}</td>
      <td>${item.itemName}</td>
      <td>${item.quantity} ${item.unit}</td>
      <td>$${item.unitPrice.toFixed(2)}</td>
      <td>$${item.totalPrice.toFixed(2)}</td>
      <td>${item.deliveryTime || 'N/A'}</td>
    </tr>
  `).join('');

  const content = `
    <div class="modal-details">
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Quotation Number</label>
          <p><strong>${quotation.quotationNumber}</strong></p>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Status</label>
          <p><span class="badge badge-${
            quotation.status === 'accepted' ? 'success' : 
            quotation.status === 'pending' ? 'warning' : 'secondary'
          }">${quotation.status.toUpperCase()}</span></p>
        </div>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Quotation Date</label>
          <p>${new Date(quotation.quotationDate).toLocaleDateString()}</p>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Valid Until</label>
          <p>${new Date(quotation.validUntil).toLocaleDateString()}</p>
        </div>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Supplier</label>
        <p>${quotation.supplierName}</p>
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
                <th>Unit Price</th>
                <th>Total</th>
                <th>Delivery Time</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
        </div>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Total Amount</label>
        <p><strong>$${quotation.totalAmount.toFixed(2)}</strong></p>
      </div>
    </div>
  `;

  modal.view('Quotation Details', content, 'lg');
}

function showQuotationForm(mode: 'create' | 'edit', quotation?: Quotation): void {
  const content = `
    <form id="quotation-form">
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Quotation Number *</label>
          <input type="text" class="form-input" name="quotationNumber" value="${quotation?.quotationNumber || ''}" required>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Status *</label>
          <select class="form-select" name="status" required>
            <option value="pending" ${quotation?.status === 'pending' ? 'selected' : ''}>Pending</option>
            <option value="accepted" ${quotation?.status === 'accepted' ? 'selected' : ''}>Accepted</option>
            <option value="rejected" ${quotation?.status === 'rejected' ? 'selected' : ''}>Rejected</option>
          </select>
        </div>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Quotation Date *</label>
          <input type="date" class="form-input" name="quotationDate" value="${quotation?.quotationDate.split('T')[0] || ''}" required>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Valid Until *</label>
          <input type="date" class="form-input" name="validUntil" value="${quotation?.validUntil.split('T')[0] || ''}" required>
        </div>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Supplier *</label>
        <select class="form-select" name="supplierId" required>
          <option value="sup-1" ${quotation?.supplierId === 'sup-1' ? 'selected' : ''}>ABC Medical Supplies Co.</option>
          <option value="sup-2" ${quotation?.supplierId === 'sup-2' ? 'selected' : ''}>Global Pharma Distributors</option>
          <option value="sup-3" ${quotation?.supplierId === 'sup-3' ? 'selected' : ''}>HealthCare Equipment Inc.</option>
        </select>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Total Amount *</label>
        <input type="number" class="form-input" name="totalAmount" value="${quotation?.totalAmount || ''}" step="0.01" required>
      </div>
    </form>
  `;

  modal.form(
    mode === 'create' ? 'Create Quotation' : 'Edit Quotation',
    content,
    async () => {
      const form = document.getElementById('quotation-form') as HTMLFormElement;
      if (form.checkValidity()) {
        const formData = new FormData(form);
        console.log('Quotation saved:', Object.fromEntries(formData.entries()));
        window.location.reload();
      } else {
        form.reportValidity();
      }
    },
    mode
  );
}
