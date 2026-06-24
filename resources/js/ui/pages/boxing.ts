import { modal } from '../components/Modal';

interface Boxing {
  id: string;
  boxingNumber: string;
  boxingDate: string;
  deliveryNumber: string;
  totalBoxes: number;
  status: 'in_progress' | 'completed' | 'shipped';
  boxes: Array<{
    boxNumber: string;
    items: Array<{
      itemCode: string;
      itemName: string;
      quantity: number;
      unit: string;
    }>;
    weight: number;
    dimensions: string;
  }>;
  packedBy: string;
  notes?: string;
}

const mockBoxings: Boxing[] = [
  {
    id: 'box-1',
    boxingNumber: 'BOX-2024-0078',
    boxingDate: '2024-06-21T14:00:00Z',
    deliveryNumber: 'DO-2024-0089',
    totalBoxes: 2,
    status: 'shipped',
    boxes: [
      {
        boxNumber: 'BOX-1',
        items: [
          {
            itemCode: 'MED-001',
            itemName: 'Paracetamol 500mg Tablets',
            quantity: 50,
            unit: 'Box',
          },
        ],
        weight: 25.5,
        dimensions: '60x40x30 cm',
      },
      {
        boxNumber: 'BOX-2',
        items: [
          {
            itemCode: 'MED-001',
            itemName: 'Paracetamol 500mg Tablets',
            quantity: 50,
            unit: 'Box',
          },
        ],
        weight: 25.5,
        dimensions: '60x40x30 cm',
      },
    ],
    packedBy: 'Warehouse Team',
    notes: 'Packed securely for transport',
  },
  {
    id: 'box-2',
    boxingNumber: 'BOX-2024-0079',
    boxingDate: '2024-06-22T10:00:00Z',
    deliveryNumber: 'DO-2024-0090',
    totalBoxes: 3,
    status: 'completed',
    boxes: [
      {
        boxNumber: 'BOX-1',
        items: [
          {
            itemCode: 'SUP-001',
            itemName: 'Surgical Gloves Large',
            quantity: 70,
            unit: 'Box',
          },
        ],
        weight: 15.0,
        dimensions: '50x40x30 cm',
      },
      {
        boxNumber: 'BOX-2',
        items: [
          {
            itemCode: 'SUP-001',
            itemName: 'Surgical Gloves Large',
            quantity: 70,
            unit: 'Box',
          },
        ],
        weight: 15.0,
        dimensions: '50x40x30 cm',
      },
      {
        boxNumber: 'BOX-3',
        items: [
          {
            itemCode: 'SUP-001',
            itemName: 'Surgical Gloves Large',
            quantity: 60,
            unit: 'Box',
          },
        ],
        weight: 13.0,
        dimensions: '50x40x30 cm',
      },
    ],
    packedBy: 'Warehouse Team',
  },
  {
    id: 'box-3',
    boxingNumber: 'BOX-2024-0080',
    boxingDate: '2024-06-23T09:00:00Z',
    deliveryNumber: 'DO-2024-0091',
    totalBoxes: 1,
    status: 'in_progress',
    boxes: [
      {
        boxNumber: 'BOX-1',
        items: [
          {
            itemCode: 'MED-002',
            itemName: 'Amoxicillin 250mg Capsules',
            quantity: 50,
            unit: 'Box',
          },
        ],
        weight: 20.0,
        dimensions: '50x35x25 cm',
      },
    ],
    packedBy: 'Warehouse Team',
  },
];

export async function renderBoxing(container: HTMLElement): Promise<void> {
  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Boxing</h1>
      <p class="page-subtitle">Manage delivery packaging and boxing</p>
    </div>

    <div class="card">
      <div class="card-header">
        <h2 class="card-title">All Boxing Records</h2>
        <button class="btn btn-primary" id="add-boxing-btn">
          <span>➕</span>
          New Boxing
        </button>
      </div>

      <div class="search-box">
        <input 
          type="text" 
          class="search-input" 
          placeholder="Search boxing records..."
          id="boxing-search"
        />
      </div>

      <div class="table-container">
        <table id="boxing-table">
          <thead>
            <tr>
              <th>Boxing #</th>
              <th>Date</th>
              <th>Delivery #</th>
              <th>Total Boxes</th>
              <th>Status</th>
              <th>Packed By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${renderBoxingRows(mockBoxings)}
          </tbody>
        </table>
      </div>
    </div>
  `;

  setupBoxingSearch(mockBoxings);
  setupBoxingActions(mockBoxings);
}

function renderBoxingRows(boxings: Boxing[]): string {
  return boxings.map(box => `
    <tr data-id="${box.id}">
      <td><strong>${box.boxingNumber}</strong></td>
      <td>${new Date(box.boxingDate).toLocaleString()}</td>
      <td>${box.deliveryNumber}</td>
      <td>${box.totalBoxes} box(es)</td>
      <td>
        <span class="badge badge-${
          box.status === 'shipped' ? 'success' :
          box.status === 'completed' ? 'info' : 'secondary'
        }">
          ${box.status.toUpperCase().replace('_', ' ')}
        </span>
      </td>
      <td>${box.packedBy}</td>
      <td>
        <button class="btn btn-sm btn-outline view-boxing" data-id="${box.id}" title="View">👁️</button>
        <button class="btn btn-sm btn-outline edit-boxing" data-id="${box.id}" title="Edit">✏️</button>
        <button class="btn btn-sm btn-outline delete-boxing" data-id="${box.id}" title="Delete">🗑️</button>
      </td>
    </tr>
  `).join('');
}

function setupBoxingSearch(boxings: Boxing[]): void {
  const searchInput = document.getElementById('boxing-search') as HTMLInputElement;
  const tableBody = document.querySelector('#boxing-table tbody');

  if (!searchInput || !tableBody) return;

  searchInput.addEventListener('input', (e) => {
    const query = (e.target as HTMLInputElement).value.toLowerCase();
    const filtered = boxings.filter(b => 
      b.boxingNumber.toLowerCase().includes(query) ||
      b.deliveryNumber.toLowerCase().includes(query)
    );
    tableBody.innerHTML = renderBoxingRows(filtered);
    setupBoxingActions(boxings);
  });
}

function setupBoxingActions(boxings: Boxing[]): void {
  document.getElementById('add-boxing-btn')?.addEventListener('click', () => {
    showBoxingForm('create');
  });

  document.querySelectorAll('.view-boxing').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id;
      const boxing = boxings.find(b => b.id === id);
      if (boxing) showBoxingDetails(boxing);
    });
  });

  document.querySelectorAll('.edit-boxing').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id;
      const boxing = boxings.find(b => b.id === id);
      if (boxing) showBoxingForm('edit', boxing);
    });
  });

  document.querySelectorAll('.delete-boxing').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id;
      const boxing = boxings.find(b => b.id === id);
      if (boxing) {
        modal.delete(
          'Delete Boxing Record',
          `Are you sure you want to delete <strong>${boxing.boxingNumber}</strong>?`,
          async () => {
            console.log('Boxing deleted:', id);
            window.location.reload();
          }
        );
      }
    });
  });
}

function showBoxingDetails(box: Boxing): void {
  const boxesHtml = box.boxes.map((b, index) => `
    <div style="margin-bottom: 15px; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
      <h4 style="margin: 0 0 10px 0;">${b.boxNumber}</h4>
      <table style="width: 100%; font-size: 0.9em;">
        <thead>
          <tr>
            <th>Item Code</th>
            <th>Item Name</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          ${b.items.map(item => `
            <tr>
              <td>${item.itemCode}</td>
              <td>${item.itemName}</td>
              <td>${item.quantity} ${item.unit}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <p style="margin: 5px 0 0 0; font-size: 0.9em;">
        <strong>Weight:</strong> ${b.weight} kg | <strong>Dimensions:</strong> ${b.dimensions}
      </p>
    </div>
  `).join('');

  const content = `
    <div class="modal-details">
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Boxing Number</label>
          <p><strong>${box.boxingNumber}</strong></p>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Status</label>
          <p><span class="badge badge-${
            box.status === 'shipped' ? 'success' :
            box.status === 'completed' ? 'info' : 'secondary'
          }">${box.status.toUpperCase().replace('_', ' ')}</span></p>
        </div>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Boxing Date</label>
          <p>${new Date(box.boxingDate).toLocaleString()}</p>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Delivery Number</label>
          <p>${box.deliveryNumber}</p>
        </div>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Total Boxes</label>
          <p>${box.totalBoxes}</p>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Packed By</label>
          <p>${box.packedBy}</p>
        </div>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Box Details</label>
        ${boxesHtml}
      </div>
      ${box.notes ? `
        <div class="modal-form-group">
          <label class="modal-form-label">Notes</label>
          <p>${box.notes}</p>
        </div>
      ` : ''}
    </div>
  `;

  modal.view('Boxing Details', content, 'lg');
}

function showBoxingForm(mode: 'create' | 'edit', box?: Boxing): void {
  const content = `
    <form id="boxing-form">
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Boxing Number *</label>
          <input type="text" class="form-input" name="boxingNumber" value="${box?.boxingNumber || ''}" required>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Status *</label>
          <select class="form-select" name="status" required>
            <option value="in_progress" ${box?.status === 'in_progress' ? 'selected' : ''}>In Progress</option>
            <option value="completed" ${box?.status === 'completed' ? 'selected' : ''}>Completed</option>
            <option value="shipped" ${box?.status === 'shipped' ? 'selected' : ''}>Shipped</option>
          </select>
        </div>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Delivery Number *</label>
          <input type="text" class="form-input" name="deliveryNumber" value="${box?.deliveryNumber || ''}" required>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Boxing Date *</label>
          <input type="datetime-local" class="form-input" name="boxingDate" value="${box?.boxingDate.split('.')[0] || ''}" required>
        </div>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Total Boxes *</label>
          <input type="number" class="form-input" name="totalBoxes" value="${box?.totalBoxes || ''}" min="1" required>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Packed By *</label>
          <input type="text" class="form-input" name="packedBy" value="${box?.packedBy || ''}" required>
        </div>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Notes</label>
        <textarea class="form-textarea" name="notes">${box?.notes || ''}</textarea>
      </div>
    </form>
  `;

  modal.form(
    mode === 'create' ? 'Create Boxing Record' : 'Edit Boxing Record',
    content,
    async () => {
      const form = document.getElementById('boxing-form') as HTMLFormElement;
      if (form.checkValidity()) {
        const formData = new FormData(form);
        console.log('Boxing saved:', Object.fromEntries(formData.entries()));
        window.location.reload();
      } else {
        form.reportValidity();
      }
    },
    mode
  );
}
