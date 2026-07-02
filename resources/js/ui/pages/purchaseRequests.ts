import { mockPurchaseRequests } from '../../mock/data';
import { modal } from '../components/Modal';
import { Icons } from '../components/Icons';
import { FilterPanel, type FilterConfig } from '../components/FilterPanel';

export async function renderPurchaseRequests(container: HTMLElement): Promise<void> {
  const requests = mockPurchaseRequests;
  let currentFilters: any = {};
  
  const filterConfigs: FilterConfig[] = [
    { id: 'search', label: 'Search', type: 'search', placeholder: 'Search requests...' },
    { 
      id: 'status', 
      label: 'Status', 
      type: 'select',
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'approved', label: 'Approved' },
        { value: 'rejected', label: 'Rejected' },
        { value: 'completed', label: 'Completed' }
      ]
    },
    { 
      id: 'priority', 
      label: 'Priority', 
      type: 'select',
      options: [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'urgent', label: 'Urgent' }
      ]
    },
    { id: 'dateRange', label: 'Request Date', type: 'dateRange' }
  ];

  const filterPanel = new FilterPanel(filterConfigs, (filters) => {
    currentFilters = filters;
    applyFilters();
  });

  const applyFilters = () => {
    let filtered = [...requests];
    
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
    
    const tbody = document.getElementById('tbody');
    if (tbody) {
      tbody.innerHTML = renderRows(filtered);
      setupActions(requests);
    }
  };

  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Purchase Requests</h1>
      <p class="page-subtitle">Manage purchase requests</p>
    </div>
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">All Purchase Requests</h2>
        <button class="btn btn-primary" id="add-btn">${Icons.add}<span>Create Request</span></button>
      </div>
      ${filterPanel.render()}
      <div class="table-container">
        <table><thead><tr><th>Request #</th><th>Date</th><th>Requester</th><th>Department</th><th>Priority</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody id="tbody">${renderRows(requests)}</tbody></table>
      </div>
    </div>
  `;
  filterPanel.setupEventListeners();
  setupActions(requests);
}

function renderRows(items: any[]): string {
  return items.map(r => `<tr><td><strong>${r.requestNumber}</strong></td><td>${new Date(r.requestDate).toLocaleDateString()}</td>
  <td>${r.requester}</td><td>${r.department}</td><td><span class="badge badge-${r.priority === 'urgent' ? 'danger' : r.priority === 'high' ? 'warning' : 'info'}">${r.priority.toUpperCase()}</span></td>
  <td><span class="badge badge-${r.status === 'approved' ? 'success' : r.status === 'pending' ? 'warning' : r.status === 'rejected' ? 'danger' : 'secondary'}">${r.status.toUpperCase()}</span></td>
  <td><button class="btn btn-sm btn-outline view-btn" data-id="${r.id}">${Icons.view}</button>
  <button class="btn btn-sm btn-outline edit-btn" data-id="${r.id}">${Icons.edit}</button>
  ${r.status === 'pending' ? `<button class="btn btn-sm btn-outline approve-btn" data-id="${r.id}">${Icons.check}</button>` : ''}
  <button class="btn btn-sm btn-outline delete-btn" data-id="${r.id}">${Icons.delete}</button></td></tr>`).join('');
}

function setupActions(items: any[]): void {
  document.getElementById('add-btn')?.addEventListener('click', () => showForm('create'));
  document.querySelectorAll('.view-btn').forEach(b => b.addEventListener('click', (e) => {
    const r = items.find(x => x.id === (e.target as HTMLElement).closest('button')?.dataset.id);
    if(r) modal.view('Purchase Request Details', `
      <div class="modal-details">
        <div class="modal-form-row">
          <div class="modal-form-group"><label class="modal-form-label">Request Number</label><p>${r.requestNumber}</p></div>
          <div class="modal-form-group"><label class="modal-form-label">Date</label><p>${new Date(r.requestDate).toLocaleDateString()}</p></div>
        </div>
        <div class="modal-form-row">
          <div class="modal-form-group"><label class="modal-form-label">Requester</label><p>${r.requester}</p></div>
          <div class="modal-form-group"><label class="modal-form-label">Department</label><p>${r.department}</p></div>
        </div>
        <div class="modal-form-row">
          <div class="modal-form-group"><label class="modal-form-label">Priority</label><p><span class="badge badge-${r.priority === 'urgent' ? 'danger' : 'warning'}">${r.priority.toUpperCase()}</span></p></div>
          <div class="modal-form-group"><label class="modal-form-label">Status</label><p><span class="badge badge-success">${r.status.toUpperCase()}</span></p></div>
        </div>
        <div class="modal-form-group"><label class="modal-form-label">Notes</label><p>${r.notes || 'N/A'}</p></div>
        <div class="modal-form-group"><label class="modal-form-label">Items</label>
        <table><thead><tr><th>Item</th><th>Quantity</th><th>Unit</th></tr></thead>
        <tbody>${r.items.map((i: any) => `<tr><td>${i.itemName}</td><td>${i.quantity}</td><td>${i.unit}</td></tr>`).join('')}</tbody></table>
        </div>
      </div>
    `, 'lg');
  }));
  
  document.querySelectorAll('.edit-btn').forEach(b => b.addEventListener('click', (e) => {
    const r = items.find(x => x.id === (e.target as HTMLElement).closest('button')?.dataset.id);
    if(r) showForm('edit', r);
  }));
  
  document.querySelectorAll('.approve-btn').forEach(b => b.addEventListener('click', (e) => {
    const r = items.find(x => x.id === (e.target as HTMLElement).closest('button')?.dataset.id);
    if(r) modal.confirm('Approve Request', `Approve request <strong>${r.requestNumber}</strong>?`, async () => window.location.reload());
  }));
  
  document.querySelectorAll('.delete-btn').forEach(b => b.addEventListener('click', (e) => {
    const r = items.find(x => x.id === (e.target as HTMLElement).closest('button')?.dataset.id);
    if(r) modal.delete('Delete Request', `Delete request <strong>${r.requestNumber}</strong>?`, async () => window.location.reload());
  }));
}

function showForm(mode: 'create'|'edit', req?: any): void {
  modal.form(mode === 'create' ? 'Create Purchase Request' : 'Edit Purchase Request', `
    <form id="form">
      <div class="modal-form-row">
        <div class="modal-form-group"><label class="modal-form-label">Requester *</label><input type="text" class="form-input" name="requester" value="${req?.requester || ''}" required></div>
        <div class="modal-form-group"><label class="modal-form-label">Department *</label><input type="text" class="form-input" name="department" value="${req?.department || ''}" required></div>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group"><label class="modal-form-label">Priority *</label>
          <select class="form-select" name="priority" required>
            <option value="low">Low</option>
            <option value="medium" ${req?.priority === 'medium' ? 'selected' : ''}>Medium</option>
            <option value="high" ${req?.priority === 'high' ? 'selected' : ''}>High</option>
            <option value="urgent" ${req?.priority === 'urgent' ? 'selected' : ''}>Urgent</option>
          </select>
        </div>
        <div class="modal-form-group"><label class="modal-form-label">Request Date *</label><input type="date" class="form-input" name="requestDate" required></div>
      </div>
      <div class="modal-form-group"><label class="modal-form-label">Notes</label><textarea class="form-textarea" name="notes">${req?.notes || ''}</textarea></div>
    </form>
  `, async () => {
    const form = document.getElementById('form') as HTMLFormElement;
    if(form.checkValidity()) window.location.reload(); else form.reportValidity();
  }, mode);
}
