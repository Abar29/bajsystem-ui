import { mockUsers } from '../../mock/data';
import { modal } from '../components/Modal';

export async function renderUsers(container: HTMLElement): Promise<void> {
  const users = mockUsers;
  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Users</h1>
      <p class="page-subtitle">Manage system users</p>
    </div>
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">All Users</h2>
        <button class="btn btn-primary" id="add-btn"><span>➕</span> Add User</button>
      </div>
      <div class="search-box"><input type="text" class="search-input" placeholder="Search users..." id="search" /></div>
      <div class="table-container">
        <table><thead><tr><th>Username</th><th>Full Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody id="tbody">${renderRows(users)}</tbody></table>
      </div>
    </div>
  `;
  setupActions(users);
}

function renderRows(items: any[]): string {
  return items.map(u => `<tr><td><strong>${u.username}</strong></td><td>${u.fullName}</td><td>${u.email}</td><td>${u.role}</td>
  <td><span class="badge badge-${u.isActive ? 'success' : 'secondary'}">${u.isActive ? 'ACTIVE' : 'INACTIVE'}</span></td>
  <td><button class="btn btn-sm btn-outline view-btn" data-id="${u.id}">👁️</button>
  <button class="btn btn-sm btn-outline edit-btn" data-id="${u.id}">✏️</button>
  <button class="btn btn-sm btn-outline delete-btn" data-id="${u.id}">🗑️</button></td></tr>`).join('');
}

function setupActions(items: any[]): void {
  document.getElementById('search')?.addEventListener('input', (e) => {
    const q = (e.target as HTMLInputElement).value.toLowerCase();
    const tbody = document.getElementById('tbody');
    if(tbody) tbody.innerHTML = renderRows(items.filter(u => u.username.toLowerCase().includes(q) || u.fullName.toLowerCase().includes(q)));
    setupActions(items);
  });
  
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
