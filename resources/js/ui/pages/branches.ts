import type { Branch } from '../../types';
import { mockBranches } from '../../mock/data';
import { modal } from '../components/Modal';
import { FilterPanel, type FilterConfig } from '../components/FilterPanel';
import { Icons } from '../components/Icons';

export async function renderBranches(container: HTMLElement): Promise<void> {
  container.innerHTML = '<div class="loading">Loading branches...</div>';

  try {
    const branches = mockBranches;
    let filtered = [...branches];

    const filterConfigs: FilterConfig[] = [
      { id: 'search', label: 'Search', type: 'search', placeholder: 'Search branches...' },
      { id: 'status', label: 'Status', type: 'select', options: [
        { value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }
      ]},
    ];

    const filterPanel = new FilterPanel(filterConfigs, (values) => {
      filtered = branches.filter(b => {
        if (values.search && !b.name.toLowerCase().includes(values.search.toLowerCase()) && !b.code.toLowerCase().includes(values.search.toLowerCase())) return false;
        if (values.status && b.status !== values.status) return false;
        return true;
      });
      document.getElementById('table-body')!.innerHTML = renderRows(filtered);
      setupActions(branches);
    });

    container.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Branches</h1>
        <p class="page-subtitle">Manage branch locations</p>
      </div>

      <div class="card">
        <div class="card-header">
          <h2 class="card-title">All Branches</h2>
          <button class="btn btn-primary" id="add-btn">
            ${Icons.add}<span>Add Branch</span>
          </button>
        </div>

        ${filterPanel.render()}

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Manager</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="table-body">
              ${renderRows(filtered)}
            </tbody>
          </table>
        </div>
      </div>
    `;

    filterPanel.setupEventListeners();
    setupActions(branches);
  } catch (error) {
    container.innerHTML = '<div class="error">Failed to load branches</div>';
  }
}

function renderRows(items: Branch[]): string {
  return items.map(b => `
    <tr>
      <td><strong>${b.code}</strong></td>
      <td>${b.name}</td>
      <td>${b.address}</td>
      <td>${b.phone}</td>
      <td>${b.manager}</td>
      <td><span class="badge badge-${b.status === 'active' ? 'success' : 'secondary'}">${b.status.toUpperCase()}</span></td>
      <td>
        <button class="btn btn-sm btn-outline view-btn" data-id="${b.id}">${Icons.view}</button>
        <button class="btn btn-sm btn-outline edit-btn" data-id="${b.id}">${Icons.edit}</button>
        <button class="btn btn-sm btn-outline delete-btn" data-id="${b.id}">${Icons.delete}</button>
      </td>
    </tr>
  `).join('');
}

function setupActions(items: Branch[]): void {
  document.getElementById('add-btn')?.addEventListener('click', () => showForm('create'));

  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const item = items.find(b => b.id === (e.currentTarget as HTMLElement).dataset.id);
      if (item) modal.view('Branch Details', `
        <div class="modal-details">
          <div class="modal-form-row">
            <div class="modal-form-group"><label class="modal-form-label">Code</label><p>${item.code}</p></div>
            <div class="modal-form-group"><label class="modal-form-label">Status</label><p><span class="badge badge-${item.status === 'active' ? 'success' : 'secondary'}">${item.status.toUpperCase()}</span></p></div>
          </div>
          <div class="modal-form-group"><label class="modal-form-label">Name</label><p>${item.name}</p></div>
          <div class="modal-form-group"><label class="modal-form-label">Address</label><p>${item.address}</p></div>
          <div class="modal-form-row">
            <div class="modal-form-group"><label class="modal-form-label">Phone</label><p>${item.phone}</p></div>
            <div class="modal-form-group"><label class="modal-form-label">Manager</label><p>${item.manager}</p></div>
          </div>
        </div>
      `, 'lg');
    });
  });

  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const item = items.find(b => b.id === (e.currentTarget as HTMLElement).dataset.id);
      if (item) showForm('edit', item);
    });
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const item = items.find(b => b.id === (e.currentTarget as HTMLElement).dataset.id);
      if (item) modal.delete('Delete Branch', `Delete <strong>${item.name}</strong>?`, async () => { window.location.reload(); });
    });
  });
}

function showForm(mode: 'create' | 'edit', item?: Branch): void {
  modal.form(mode === 'create' ? 'Create Branch' : 'Edit Branch', `
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
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Name *</label>
        <input type="text" class="form-input" name="name" value="${item?.name || ''}" required>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Address *</label>
        <textarea class="form-textarea" name="address" required>${item?.address || ''}</textarea>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Phone *</label>
          <input type="tel" class="form-input" name="phone" value="${item?.phone || ''}" required>
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
