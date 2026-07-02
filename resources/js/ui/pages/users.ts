import { mockUsers } from '../../mock/data';
import { modal } from '../components/Modal';
import { FilterPanel, type FilterConfig } from '../components/FilterPanel';
import { Icons } from '../components/Icons';

export async function renderUsers(container: HTMLElement): Promise<void> {
  const users = mockUsers;
  let filteredUsers = [...users];

  // Define filters
  const filterConfigs: FilterConfig[] = [
    {
      id: 'search',
      label: 'Search',
      type: 'search',
      placeholder: 'Search by username or full name...',
    },
    {
      id: 'role',
      label: 'Role',
      type: 'select',
      options: [
        { value: 'Administrator', label: 'Administrator' },
        { value: 'Manager', label: 'Manager' },
        { value: 'User', label: 'User' },
        { value: 'Warehouse Manager', label: 'Warehouse Manager' },
      ],
    },
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
      ],
    },
  ];

  const filterPanel = new FilterPanel(filterConfigs, (values) => {
    filteredUsers = users.filter(user => {
      // Search filter
      if (values.search) {
        const search = values.search.toLowerCase();
        const matchesSearch = 
          user.username.toLowerCase().includes(search) ||
          user.fullName.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search);
        if (!matchesSearch) return false;
      }

      // Role filter
      if (values.role && user.role !== values.role) {
        return false;
      }

      // Status filter
      if (values.status) {
        const isActive = values.status === 'active';
        if (user.isActive !== isActive) return false;
      }

      return true;
    });
    
    const tbody = document.getElementById('tbody');
    if (tbody) {
      tbody.innerHTML = renderRows(filteredUsers);
      setupActions(users);
    }
  });

  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Users</h1>
      <p class="page-subtitle">Manage system users</p>
    </div>
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">All Users</h2>
        <button class="btn btn-primary" id="add-btn">
          ${Icons.add}
          <span>Add User</span>
        </button>
      </div>
      
      ${filterPanel.render()}
      
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="tbody">${renderRows(filteredUsers)}</tbody>
        </table>
      </div>
    </div>
  `;
  
  filterPanel.setupEventListeners();
  setupActions(users);
}

function renderRows(items: any[]): string {
  return items.map(u => `
    <tr>
      <td><strong>${u.username}</strong></td>
      <td>${u.fullName}</td>
      <td>${u.email}</td>
      <td>${u.role}</td>
      <td><span class="badge badge-${u.isActive ? 'success' : 'secondary'}">${u.isActive ? 'ACTIVE' : 'INACTIVE'}</span></td>
      <td>
        <button class="btn btn-sm btn-outline view-btn" data-id="${u.id}">${Icons.view}</button>
        <button class="btn btn-sm btn-outline edit-btn" data-id="${u.id}">${Icons.edit}</button>
        <button class="btn btn-sm btn-outline delete-btn" data-id="${u.id}">${Icons.delete}</button>
      </td>
    </tr>
  `).join('');
}

function setupActions(items: any[]): void {
  
  document.getElementById('add-btn')?.addEventListener('click', () => showForm('create'));
  document.querySelectorAll('.view-btn').forEach(b => b.addEventListener('click', (e) => {
    const u = items.find(x => x.id === (e.target as HTMLElement).closest('button')?.dataset.id);
    if(u) modal.view('User Details', `
      <div class="modal-details">
        <div class="modal-form-row">
          <div class="modal-form-group"><label class="modal-form-label">Username</label><p>${u.username}</p></div>
          <div class="modal-form-group"><label class="modal-form-label">Status</label><p><span class="badge badge-${u.isActive ? 'success' : 'secondary'}">${u.isActive ? 'ACTIVE' : 'INACTIVE'}</span></p></div>
        </div>
        <div class="modal-form-group"><label class="modal-form-label">Full Name</label><p>${u.fullName}</p></div>
        <div class="modal-form-row">
          <div class="modal-form-group"><label class="modal-form-label">Email</label><p>${u.email}</p></div>
          <div class="modal-form-group"><label class="modal-form-label">Role</label><p>${u.role}</p></div>
        </div>
      </div>
    `, 'lg');
  }));
  
  document.querySelectorAll('.edit-btn').forEach(b => b.addEventListener('click', (e) => {
    const u = items.find(x => x.id === (e.target as HTMLElement).closest('button')?.dataset.id);
    if(u) showForm('edit', u);
  }));
  
  document.querySelectorAll('.delete-btn').forEach(b => b.addEventListener('click', (e) => {
    const u = items.find(x => x.id === (e.target as HTMLElement).closest('button')?.dataset.id);
    if(u) modal.delete('Delete User', `Delete user <strong>${u.username}</strong>?`, async () => window.location.reload());
  }));
}

function showForm(mode: 'create'|'edit', user?: any): void {
  modal.form(mode === 'create' ? 'Create User' : 'Edit User', `
    <form id="form">
      <div class="modal-form-row">
        <div class="modal-form-group"><label class="modal-form-label">Username *</label><input type="text" class="form-input" name="username" value="${user?.username || ''}" required></div>
        <div class="modal-form-group"><label class="modal-form-label">Status *</label>
          <select class="form-select" name="isActive" required>
            <option value="true" ${user?.isActive ? 'selected' : ''}>Active</option>
            <option value="false" ${!user?.isActive ? 'selected' : ''}>Inactive</option>
          </select>
        </div>
      </div>
      <div class="modal-form-group"><label class="modal-form-label">Full Name *</label><input type="text" class="form-input" name="fullName" value="${user?.fullName || ''}" required></div>
      <div class="modal-form-row">
        <div class="modal-form-group"><label class="modal-form-label">Email *</label><input type="email" class="form-input" name="email" value="${user?.email || ''}" required></div>
        <div class="modal-form-group"><label class="modal-form-label">Role *</label>
          <select class="form-select" name="role" required>
            <option value="Administrator" ${user?.role === 'Administrator' ? 'selected' : ''}>Administrator</option>
            <option value="Manager">Manager</option>
            <option value="User">User</option>
            <option value="Warehouse Manager">Warehouse Manager</option>
          </select>
        </div>
      </div>
      ${mode === 'create' ? '<div class="modal-form-group"><label class="modal-form-label">Password *</label><input type="password" class="form-input" name="password" required></div>' : ''}
    </form>
  `, async () => {
    const form = document.getElementById('form') as HTMLFormElement;
    if(form.checkValidity()) window.location.reload(); else form.reportValidity();
  }, mode);
}
