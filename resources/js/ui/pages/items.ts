import type { Item } from '../../types';
import { mockItems } from '../../mock/data';
import { modal } from '../components/Modal';
import { FilterPanel, type FilterConfig } from '../components/FilterPanel';
import { Icons } from '../components/Icons';

export async function renderItems(container: HTMLElement): Promise<void> {
  container.innerHTML = '<div class="loading">Loading items...</div>';

  try {
    const items = mockItems;
    let filtered = [...items];

    const filterConfigs: FilterConfig[] = [
      { id: 'search', label: 'Search', type: 'search', placeholder: 'Search items...' },
      { id: 'status', label: 'Status', type: 'select', options: [
        { value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }
      ]},
    ];

    const filterPanel = new FilterPanel(filterConfigs, (values) => {
      filtered = items.filter(i => {
        if (values.search && !i.name.toLowerCase().includes(values.search.toLowerCase()) && !i.code.toLowerCase().includes(values.search.toLowerCase())) return false;
        if (values.status && i.status !== values.status) return false;
        return true;
      });
      const tableBody = document.querySelector('#items-table tbody');
      if (tableBody) {
        tableBody.innerHTML = renderRows(filtered);
        setupActions(items);
      }
    });

    container.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Items / Products</h1>
        <p class="page-subtitle">Manage product catalog</p>
      </div>

      <div class="card">
        <div class="card-header">
          <h2 class="card-title">All Items</h2>
          <button class="btn btn-primary" id="add-item-btn">
            ${Icons.add}<span>Add Item</span>
          </button>
        </div>

        ${filterPanel.render()}

        <div class="table-container">
          <table id="items-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Category</th>
                <th>Unit</th>
                <th>Min Stock</th>
                <th>Reorder Point</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${renderRows(filtered)}
            </tbody>
          </table>
        </div>
      </div>
    `;

    filterPanel.setupEventListeners();
    setupActions(items);
  } catch (error) {
    container.innerHTML = '<div class="error">Failed to load items</div>';
  }
}

function renderRows(items: Item[]): string {
  return items.map(i => `
    <tr data-id="${i.id}">
      <td><strong>${i.code}</strong></td>
      <td>${i.name}</td>
      <td>${i.category}</td>
      <td>${i.unit}</td>
      <td>${i.minStock}</td>
      <td>${i.reorderPoint}</td>
      <td><span class="badge badge-${i.status === 'active' ? 'success' : 'secondary'}">${i.status.toUpperCase()}</span></td>
      <td>
        <button class="btn btn-sm btn-outline view-btn" data-id="${i.id}">${Icons.view}</button>
        <button class="btn btn-sm btn-outline edit-btn" data-id="${i.id}">${Icons.edit}</button>
        <button class="btn btn-sm btn-outline delete-btn" data-id="${i.id}">${Icons.delete}</button>
      </td>
    </tr>
  `).join('');
}

function setupActions(items: Item[]): void {
  document.getElementById('add-item-btn')?.addEventListener('click', () => showForm('create'));

  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id;
      const item = items.find(i => i.id === id);
      if (item) showDetails(item);
    });
  });

  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id;
      const item = items.find(i => i.id === id);
      if (item) showForm('edit', item);
    });
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id;
      const item = items.find(i => i.id === id);
      if (item) {
        modal.delete('Delete Item', `Delete <strong>${item.name}</strong>?`, async () => {
          window.location.reload();
        });
      }
    });
  });
}

function showDetails(item: Item): void {
  const content = `
    <div class="modal-details">
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Code</label>
          <p>${item.code}</p>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Status</label>
          <p><span class="badge badge-${item.status === 'active' ? 'success' : 'secondary'}">${item.status.toUpperCase()}</span></p>
        </div>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Item Name</label>
        <p>${item.name}</p>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Description</label>
        <p>${item.description}</p>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Category</label>
          <p>${item.category}</p>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Unit</label>
          <p>${item.unit}</p>
        </div>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Min Stock</label>
          <p>${item.minStock}</p>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Max Stock</label>
          <p>${item.maxStock}</p>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Reorder Point</label>
          <p>${item.reorderPoint}</p>
        </div>
      </div>
    </div>
  `;
  modal.view('Item Details', content, 'lg');
}

function showForm(mode: 'create' | 'edit', item?: Item): void {
  const content = `
    <form id="item-form">
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
        <label class="modal-form-label">Item Name *</label>
        <input type="text" class="form-input" name="name" value="${item?.name || ''}" required>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Description</label>
        <textarea class="form-textarea" name="description">${item?.description || ''}</textarea>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Category *</label>
          <input type="text" class="form-input" name="category" value="${item?.category || ''}" required>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Unit *</label>
          <select class="form-select" name="unit" required>
            <option>Box</option>
            <option>Pieces</option>
            <option>Carton</option>
            <option>Bottle</option>
          </select>
        </div>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Min Stock *</label>
          <input type="number" class="form-input" name="minStock" value="${item?.minStock || 0}" required>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Max Stock *</label>
          <input type="number" class="form-input" name="maxStock" value="${item?.maxStock || 0}" required>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Reorder Point *</label>
          <input type="number" class="form-input" name="reorderPoint" value="${item?.reorderPoint || 0}" required>
        </div>
      </div>
    </form>
  `;

  modal.form(mode === 'create' ? 'Create Item' : 'Edit Item', content, async () => {
    const form = document.getElementById('item-form') as HTMLFormElement;
    if (form.checkValidity()) {
      window.location.reload();
    } else {
      form.reportValidity();
    }
  }, mode);
}
