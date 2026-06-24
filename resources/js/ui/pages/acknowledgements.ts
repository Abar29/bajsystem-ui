import { modal } from '../components/Modal';

interface Acknowledgement {
  id: string;
  acknowledgementNumber: string;
  deliveryNumber: string;
  agencyName: string;
  receivedDate: string;
  receivedBy: string;
  status: 'pending' | 'acknowledged' | 'rejected';
  items: Array<{
    itemCode: string;
    itemName: string;
    deliveredQuantity: number;
    receivedQuantity: number;
    unit: string;
    condition: 'good' | 'damaged';
  }>;
  notes?: string;
  signatureUrl?: string;
}

const mockAcknowledgements: Acknowledgement[] = [
  {
    id: 'ack-1',
    acknowledgementNumber: 'ACK-2024-0120',
    deliveryNumber: 'DO-2024-0089',
    agencyName: 'North Regional Health Center',
    receivedDate: '2024-06-22T11:00:00Z',
    receivedBy: 'Dr. Emily Watson',
    status: 'acknowledged',
    items: [
      {
        itemCode: 'MED-001',
        itemName: 'Paracetamol 500mg Tablets',
        deliveredQuantity: 100,
        receivedQuantity: 100,
        unit: 'Box',
        condition: 'good',
      },
    ],
    notes: 'All items received in good condition',
    signatureUrl: '/signatures/ack-2024-0120.png',
  },
  {
    id: 'ack-2',
    acknowledgementNumber: 'ACK-2024-0121',
    deliveryNumber: 'DO-2024-0090',
    agencyName: 'Central Medical Clinic',
    receivedDate: '2024-06-23T14:30:00Z',
    receivedBy: 'Dr. James Wilson',
    status: 'acknowledged',
    items: [
      {
        itemCode: 'SUP-001',
        itemName: 'Surgical Gloves Large',
        deliveredQuantity: 200,
        receivedQuantity: 200,
        unit: 'Box',
        condition: 'good',
      },
    ],
    notes: 'Delivered on time',
    signatureUrl: '/signatures/ack-2024-0121.png',
  },
  {
    id: 'ack-3',
    acknowledgementNumber: 'ACK-2024-0122',
    deliveryNumber: 'DO-2024-0091',
    agencyName: 'South District Hospital',
    receivedDate: '2024-06-24T10:00:00Z',
    receivedBy: 'Dr. Maria Garcia',
    status: 'rejected',
    items: [
      {
        itemCode: 'MED-002',
        itemName: 'Amoxicillin 250mg Capsules',
        deliveredQuantity: 50,
        receivedQuantity: 45,
        unit: 'Box',
        condition: 'damaged',
      },
    ],
    notes: '5 boxes damaged during transport',
  },
];

export async function renderAcknowledgements(container: HTMLElement): Promise<void> {
  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Acknowledgement Receipts</h1>
      <p class="page-subtitle">Track delivery acknowledgements from agencies</p>
    </div>

    <div class="card">
      <div class="card-header">
        <h2 class="card-title">All Acknowledgements</h2>
        <button class="btn btn-primary" id="add-ack-btn">
          <span>➕</span>
          New Acknowledgement
        </button>
      </div>

      <div class="search-box">
        <input 
          type="text" 
          class="search-input" 
          placeholder="Search acknowledgements..."
          id="ack-search"
        />
      </div>

      <div class="table-container">
        <table id="ack-table">
          <thead>
            <tr>
              <th>ACK #</th>
              <th>Delivery #</th>
              <th>Agency</th>
              <th>Received Date</th>
              <th>Received By</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${renderAckRows(mockAcknowledgements)}
          </tbody>
        </table>
      </div>
    </div>
  `;

  setupAckSearch(mockAcknowledgements);
  setupAckActions(mockAcknowledgements);
}

function renderAckRows(acks: Acknowledgement[]): string {
  return acks.map(ack => `
    <tr data-id="${ack.id}">
      <td><strong>${ack.acknowledgementNumber}</strong></td>
      <td>${ack.deliveryNumber}</td>
      <td>${ack.agencyName}</td>
      <td>${new Date(ack.receivedDate).toLocaleString()}</td>
      <td>${ack.receivedBy}</td>
      <td>
        <span class="badge badge-${
          ack.status === 'acknowledged' ? 'success' :
          ack.status === 'rejected' ? 'danger' : 'secondary'
        }">
          ${ack.status.toUpperCase()}
        </span>
      </td>
      <td>
        <button class="btn btn-sm btn-outline view-ack" data-id="${ack.id}" title="View">👁️</button>
        <button class="btn btn-sm btn-outline edit-ack" data-id="${ack.id}" title="Edit">✏️</button>
        <button class="btn btn-sm btn-outline delete-ack" data-id="${ack.id}" title="Delete">🗑️</button>
      </td>
    </tr>
  `).join('');
}

function setupAckSearch(acks: Acknowledgement[]): void {
  const searchInput = document.getElementById('ack-search') as HTMLInputElement;
  const tableBody = document.querySelector('#ack-table tbody');

  if (!searchInput || !tableBody) return;

  searchInput.addEventListener('input', (e) => {
    const query = (e.target as HTMLInputElement).value.toLowerCase();
    const filtered = acks.filter(a => 
      a.acknowledgementNumber.toLowerCase().includes(query) ||
      a.deliveryNumber.toLowerCase().includes(query) ||
      a.agencyName.toLowerCase().includes(query)
    );
    tableBody.innerHTML = renderAckRows(filtered);
    setupAckActions(acks);
  });
}

function setupAckActions(acks: Acknowledgement[]): void {
  document.getElementById('add-ack-btn')?.addEventListener('click', () => {
    showAckForm('create');
  });

  document.querySelectorAll('.view-ack').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id;
      const ack = acks.find(a => a.id === id);
      if (ack) showAckDetails(ack);
    });
  });

  document.querySelectorAll('.edit-ack').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id;
      const ack = acks.find(a => a.id === id);
      if (ack) showAckForm('edit', ack);
    });
  });

  document.querySelectorAll('.delete-ack').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id;
      const ack = acks.find(a => a.id === id);
      if (ack) {
        modal.delete(
          'Delete Acknowledgement',
          `Are you sure you want to delete <strong>${ack.acknowledgementNumber}</strong>?`,
          async () => {
            console.log('Acknowledgement deleted:', id);
            window.location.reload();
          }
        );
      }
    });
  });
}

function showAckDetails(ack: Acknowledgement): void {
  const itemsHtml = ack.items.map(item => `
    <tr>
      <td>${item.itemCode}</td>
      <td>${item.itemName}</td>
      <td>${item.deliveredQuantity}</td>
      <td class="${item.receivedQuantity !== item.deliveredQuantity ? 'text-warning' : ''}">${item.receivedQuantity}</td>
      <td>${item.unit}</td>
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
          <label class="modal-form-label">Acknowledgement Number</label>
          <p><strong>${ack.acknowledgementNumber}</strong></p>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Status</label>
          <p><span class="badge badge-${
            ack.status === 'acknowledged' ? 'success' :
            ack.status === 'rejected' ? 'danger' : 'secondary'
          }">${ack.status.toUpperCase()}</span></p>
        </div>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Delivery Number</label>
          <p>${ack.deliveryNumber}</p>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Received Date</label>
          <p>${new Date(ack.receivedDate).toLocaleString()}</p>
        </div>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Agency</label>
          <p>${ack.agencyName}</p>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Received By</label>
          <p>${ack.receivedBy}</p>
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
                <th>Delivered</th>
                <th>Received</th>
                <th>Unit</th>
                <th>Condition</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
        </div>
      </div>
      ${ack.notes ? `
        <div class="modal-form-group">
          <label class="modal-form-label">Notes</label>
          <p>${ack.notes}</p>
        </div>
      ` : ''}
      ${ack.signatureUrl ? `
        <div class="modal-form-group">
          <label class="modal-form-label">Signature</label>
          <p><em>Signature on file: ${ack.signatureUrl}</em></p>
        </div>
      ` : ''}
    </div>
  `;

  modal.view('Acknowledgement Details', content, 'lg');
}

function showAckForm(mode: 'create' | 'edit', ack?: Acknowledgement): void {
  const content = `
    <form id="ack-form">
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Acknowledgement Number *</label>
          <input type="text" class="form-input" name="acknowledgementNumber" value="${ack?.acknowledgementNumber || ''}" required>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Status *</label>
          <select class="form-select" name="status" required>
            <option value="pending" ${ack?.status === 'pending' ? 'selected' : ''}>Pending</option>
            <option value="acknowledged" ${ack?.status === 'acknowledged' ? 'selected' : ''}>Acknowledged</option>
            <option value="rejected" ${ack?.status === 'rejected' ? 'selected' : ''}>Rejected</option>
          </select>
        </div>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Delivery Number *</label>
          <input type="text" class="form-input" name="deliveryNumber" value="${ack?.deliveryNumber || ''}" required>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Received Date *</label>
          <input type="datetime-local" class="form-input" name="receivedDate" value="${ack?.receivedDate.split('.')[0] || ''}" required>
        </div>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Agency *</label>
          <select class="form-select" name="agencyId" required>
            <option value="ag-1">North Regional Health Center</option>
            <option value="ag-2">Central Medical Clinic</option>
            <option value="ag-3">South District Hospital</option>
          </select>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Received By *</label>
          <input type="text" class="form-input" name="receivedBy" value="${ack?.receivedBy || ''}" required>
        </div>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Notes</label>
        <textarea class="form-textarea" name="notes">${ack?.notes || ''}</textarea>
      </div>
    </form>
  `;

  modal.form(
    mode === 'create' ? 'Create Acknowledgement' : 'Edit Acknowledgement',
    content,
    async () => {
      const form = document.getElementById('ack-form') as HTMLFormElement;
      if (form.checkValidity()) {
        const formData = new FormData(form);
        console.log('Acknowledgement saved:', Object.fromEntries(formData.entries()));
        window.location.reload();
      } else {
        form.reportValidity();
      }
    },
    mode
  );
}
