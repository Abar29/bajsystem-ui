import type { Warehouse } from '../../types';
import { mockWarehouses } from '../../mock/data';
import { modal } from '../components/Modal';

export async function renderWarehouses(container: HTMLElement): Promise<void> {
  container.innerHTML = '<div class="loading">Loading warehouses...</div>';

  try {
    const warehouses = mockWarehouses;

    container.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Warehouses</h1>
        <p class="page-subtitle">Manage warehouse facilities</p>
      </div>

      <div class="card">
        <div class="card-header">
          <h2 class="card-title">All Warehouses</h2>
          <button class="btn btn-primary" id="add-btn">
            <span>➕</span>
            Add Warehouse
          </button>
        </div>

        <div class="search-box">
          <input type="text" class="search-input" placeholder="Search warehouses..." id="search" />
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Location</th>
                <th>Capacity</th>
                <th>Manager</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="table-body">
              ${renderRows(warehouses)}
            </tbody>
          </table>
        </div>
      </div>
    `;

    setupActions(warehouses);
  } catch (error) {
    container.innerHTML = '<div class="error">Failed to load warehouses</div>';
  }
}

function renderRows(items: Warehouse[]): string {
  return items.map(w => `
    <tr>
      <td><strong>${w.code}</strong></td>
      <td>${w.name}</td>
      <td>${w.location}</td>
      <td>${w.capacity.toLocaleString()}</td>
      <td>${w.manager}</td>
      <td><span class="badge badge-${w.status === 'active' ? 'success' : 'secondary'}">${w.status.toUpperCase()}</span></td>
      <td>
        <button class="btn btn-sm btn-outline view-btn" data-id="${w.id}">👁️</button>
        <button class="btn btn-sm btn-outline edit-btn" data-id="${w.id}">✏️</button>
        <button class="btn btn-sm btn-outline delete-btn" data-id="${w.id}">🗑️</button>
      </td>
    </tr>
  `).join('');
}

function setupActions(items: Warehouse[]): void {
  document.getElementById('search')?.addEventListener('input', (e) => {
    const query = (e.target as HTMLInputElement).value.toLowerCase();
    const filtered = items.filter(w => 
      w.name.toLowerCase().includes(query) || w.code.toLowerCase().includes(query)
    );
    document.getElementById('table-body')!.innerHTML = renderRows(filtered);
    setupActions(items);
  });

  document.getElementById('add-btn')?.addEventListener('click', () => showForm('create'));

  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const item = items.find(w => w.id === (e.currentTarget as HTMLElement).dataset.id);
      if (item) modal.view('Warehouse Details', `
        <div class="modal-details">
          <div class="modal-form-row">
            <div class="modal-form-group"><label class="modal-form-label">Code</label><p>${item.code}</p></div>
            <div class="modal-form-group"><label class="modal-form-label">Status</label><p><span class="badge badge-${item.status === 'active' ? 'success' : 'secondary'}">${item.status.toUpperCase()}</span></p></div>
          </div>
          <div class="modal-form-group"><label class="modal-form-label">Name</label><p>${item.name}</p></div>
          <div class="modal-form-group"><label class="modal-form-label">Location</label><p>${item.location}</p></div>
          <div class="modal-form-row">
            <div class="modal-form-group"><label class="modal-form-label">Capacity</label><p>${item.capacity.toLocaleString()}</p></div>
            <div class="modal-form-group"><label class="modal-form-label">Manager</label><p>${item.manager}</p></div>
          </div>
        </div>
      `, 'lg');
    });
  });

  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const item = items.find(w => w.id === (e.currentTarget as HTMLElement).dataset.id);
      if (item) showForm('edit', item);
    });
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const item = items.find(w => w.id === (e.currentTarget as HTMLElement).dataset.id);
      if (item) {
        modal.delete('Delete Warehouse', `Delete <strong>${item.name}</strong>?`, async () => {
          window.location.reload();
        });
      }
    });
  });
}

function showForm(mode: 'create' | 'edit', item?: Warehouse): void {
  modal.form(mode === 'create' ? 'Create Warehouse' : 'Edit Warehouse', `
    <form id="form">
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Code *</label>
          <input type="text" class="form-input" name="code" value="${item?.code || ''}" required>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Status *</label>
          <select class="form-select" name="status" required>
            <option value="active" ${item?.status === 'active' ? 'selected' : ''}>Active</option>
            <option value="inactive" ${item?.status === 'inactive' ? 'selected' : ''}>Inactive</option>
          </select>
        </div>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Name *</label>
        <input type="text" class="form-input" name="name" value="${item?.name || ''}" required>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Location *</label>
        <input type="text" class="form-input" name="location" value="${item?.location || ''}" required>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Capacity *</label>
          <input type="number" class="form-input" name="capacity" value="${item?.capacity || 0}" required>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Manager *</label>
          <input type="text" class="form-input" name="manager" value="${item?.manager || ''}" required>
        </div>
      </div>
    </form>
  `, async () => {
    const form = document.getElementById('form') as HTMLFormElement;
    if (form.checkValidity()) window.location.reload();
    else form.reportValidity();
  }, mode);
}
