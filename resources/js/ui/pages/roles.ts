import { modal } from '../components/Modal';

interface Role {
  id: string;
  code: string;
  name: string;
  description: string;
  permissions: string[];
  isActive: boolean;
  usersCount: number;
  createdAt: string;
  updatedAt: string;
}

const mockRoles: Role[] = [
  {
    id: 'role-1',
    code: 'ADMIN',
    name: 'Administrator',
    description: 'Full system access',
    permissions: ['all'],
    isActive: true,
    usersCount: 2,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'role-2',
    code: 'WH_MGR',
    name: 'Warehouse Manager',
    description: 'Manage warehouse operations',
    permissions: ['inventory.read', 'inventory.write', 'receiving.read', 'receiving.write', 'transfers.read', 'transfers.write'],
    isActive: true,
    usersCount: 5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'role-3',
    code: 'PURCHASER',
    name: 'Purchaser',
    description: 'Handle purchasing operations',
    permissions: ['purchase_requests.read', 'purchase_requests.write', 'purchase_orders.read', 'purchase_orders.write', 'quotations.read', 'quotations.write'],
    isActive: true,
    usersCount: 3,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'role-4',
    code: 'DELIVERY',
    name: 'Delivery Personnel',
    description: 'Manage deliveries and shipments',
    permissions: ['deliveries.read', 'deliveries.write', 'shipments.read', 'shipments.write', 'acknowledgements.read'],
    isActive: true,
    usersCount: 8,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'role-5',
    code: 'VIEWER',
    name: 'Viewer',
    description: 'Read-only access',
    permissions: ['*.read'],
    isActive: true,
    usersCount: 12,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

export async function renderRoles(container: HTMLElement): Promise<void> {
  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Roles</h1>
      <p class="page-subtitle">Manage user roles and permissions</p>
    </div>

    <div class="card">
      <div class="card-header">
        <h2 class="card-title">All Roles</h2>
        <button class="btn btn-primary" id="add-role-btn">
          <span>➕</span>
          Add Role
        </button>
      </div>

      <div class="search-box">
        <input 
          type="text" 
          class="search-input" 
          placeholder="Search roles..."
          id="role-search"
        />
      </div>

      <div class="table-container">
        <table id="roles-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Description</th>
              <th>Users</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${renderRoleRows(mockRoles)}
          </tbody>
        </table>
      </div>
    </div>
  `;

  setupRoleSearch(mockRoles);
  setupRoleActions(mockRoles);
}

function renderRoleRows(roles: Role[]): string {
  return roles.map(role => `
    <tr data-id="${role.id}">
      <td><strong>${role.code}</strong></td>
      <td>${role.name}</td>
      <td>${role.description}</td>
      <td>${role.usersCount} user(s)</td>
      <td>
        <span class="badge badge-${role.isActive ? 'success' : 'secondary'}">
          ${role.isActive ? 'ACTIVE' : 'INACTIVE'}
        </span>
      </td>
      <td>
        <button class="btn btn-sm btn-outline view-role" data-id="${role.id}" title="View">👁️</button>
        <button class="btn btn-sm btn-outline edit-role" data-id="${role.id}" title="Edit">✏️</button>
        <button class="btn btn-sm btn-outline delete-role" data-id="${role.id}" title="Delete">🗑️</button>
      </td>
    </tr>
  `).join('');
}

function setupRoleSearch(roles: Role[]): void {
  const searchInput = document.getElementById('role-search') as HTMLInputElement;
  const tableBody = document.querySelector('#roles-table tbody');

  if (!searchInput || !tableBody) return;

  searchInput.addEventListener('input', (e) => {
    const query = (e.target as HTMLInputElement).value.toLowerCase();
    const filtered = roles.filter(r => 
      r.code.toLowerCase().includes(query) ||
      r.name.toLowerCase().includes(query) ||
      r.description.toLowerCase().includes(query)
    );
    tableBody.innerHTML = renderRoleRows(filtered);
    setupRoleActions(roles);
  });
}

function setupRoleActions(roles: Role[]): void {
  document.getElementById('add-role-btn')?.addEventListener('click', () => {
    showRoleForm('create');
  });

  document.querySelectorAll('.view-role').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id;
      const role = roles.find(r => r.id === id);
      if (role) showRoleDetails(role);
    });
  });

  document.querySelectorAll('.edit-role').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id;
      const role = roles.find(r => r.id === id);
      if (role) showRoleForm('edit', role);
    });
  });

  document.querySelectorAll('.delete-role').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id;
      const role = roles.find(r => r.id === id);
      if (role) {
        modal.delete(
          'Delete Role',
          `Are you sure you want to delete <strong>${role.name}</strong>? This will affect ${role.usersCount} user(s).`,
          async () => {
            console.log('Role deleted:', id);
            window.location.reload();
          }
        );
      }
    });
  });
}

function showRoleDetails(role: Role): void {
  const permissionsHtml = role.permissions.map(perm => `
    <li style="padding: 5px 0;">${perm}</li>
  `).join('');

  const content = `
    <div class="modal-details">
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Code</label>
          <p><strong>${role.code}</strong></p>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Status</label>
          <p><span class="badge badge-${role.isActive ? 'success' : 'secondary'}">${role.isActive ? 'ACTIVE' : 'INACTIVE'}</span></p>
        </div>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Name</label>
        <p>${role.name}</p>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Description</label>
        <p>${role.description}</p>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Users with this Role</label>
        <p>${role.usersCount} user(s)</p>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Permissions</label>
        <ul style="list-style: none; padding: 0; margin: 10px 0;">
          ${permissionsHtml}
        </ul>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Created</label>
          <p>${new Date(role.createdAt).toLocaleString()}</p>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Updated</label>
          <p>${new Date(role.updatedAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  `;

  modal.view('Role Details', content, 'lg');
}

function showRoleForm(mode: 'create' | 'edit', role?: Role): void {
  const content = `
    <form id="role-form">
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Code *</label>
          <input type="text" class="form-input" name="code" value="${role?.code || ''}" required>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Status *</label>
          <select class="form-select" name="isActive" required>
            <option value="true" ${role?.isActive ? 'selected' : ''}>Active</option>
            <option value="false" ${!role?.isActive ? 'selected' : ''}>Inactive</option>
          </select>
        </div>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Name *</label>
        <input type="text" class="form-input" name="name" value="${role?.name || ''}" required>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Description *</label>
        <textarea class="form-textarea" name="description" required>${role?.description || ''}</textarea>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Permissions</label>
        <div style="max-height: 200px; overflow-y: auto; border: 1px solid #ddd; padding: 10px; border-radius: 4px;">
          <label style="display: block; margin-bottom: 5px;">
            <input type="checkbox" name="permissions" value="all" ${role?.permissions.includes('all') ? 'checked' : ''}> All Permissions
          </label>
          <label style="display: block; margin-bottom: 5px;">
            <input type="checkbox" name="permissions" value="*.read" ${role?.permissions.includes('*.read') ? 'checked' : ''}> All Read Access
          </label>
          <hr style="margin: 10px 0;">
          <label style="display: block; margin-bottom: 5px;">
            <input type="checkbox" name="permissions" value="inventory.read" ${role?.permissions.includes('inventory.read') ? 'checked' : ''}> Inventory - Read
          </label>
          <label style="display: block; margin-bottom: 5px;">
            <input type="checkbox" name="permissions" value="inventory.write" ${role?.permissions.includes('inventory.write') ? 'checked' : ''}> Inventory - Write
          </label>
          <label style="display: block; margin-bottom: 5px;">
            <input type="checkbox" name="permissions" value="purchase_orders.read" ${role?.permissions.includes('purchase_orders.read') ? 'checked' : ''}> Purchase Orders - Read
          </label>
          <label style="display: block; margin-bottom: 5px;">
            <input type="checkbox" name="permissions" value="purchase_orders.write" ${role?.permissions.includes('purchase_orders.write') ? 'checked' : ''}> Purchase Orders - Write
          </label>
          <label style="display: block; margin-bottom: 5px;">
            <input type="checkbox" name="permissions" value="deliveries.read" ${role?.permissions.includes('deliveries.read') ? 'checked' : ''}> Deliveries - Read
          </label>
          <label style="display: block; margin-bottom: 5px;">
            <input type="checkbox" name="permissions" value="deliveries.write" ${role?.permissions.includes('deliveries.write') ? 'checked' : ''}> Deliveries - Write
          </label>
        </div>
      </div>
    </form>
  `;

  modal.form(
    mode === 'create' ? 'Create Role' : 'Edit Role',
    content,
    async () => {
      const form = document.getElementById('role-form') as HTMLFormElement;
      if (form.checkValidity()) {
        const formData = new FormData(form);
        console.log('Role saved:', Object.fromEntries(formData.entries()));
        window.location.reload();
      } else {
        form.reportValidity();
      }
    },
    mode
  );
}
