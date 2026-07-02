import { mockUnits } from '../../mock/data';
import { modal } from '../components/Modal';
import { Icons } from '../components/Icons';

export async function renderUnits(container: HTMLElement): Promise<void> {
  const units = mockUnits;
  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Units of Measurement</h1>
      <p class="page-subtitle">Manage measurement units</p>
    </div>
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">All Units</h2>
        <button class="btn btn-primary" id="add-btn">${Icons.add}<span>Add Unit</span></button>
      </div>
      <div class="table-container">
        <table><thead><tr><th>Code</th><th>Name</th><th>Description</th><th>Actions</th></tr></thead>
        <tbody id="tbody">${units.map(u => `<tr><td><strong>${u.code}</strong></td><td>${u.name}</td><td>${u.description}</td>
        <td><button class="btn btn-sm btn-outline view-btn" data-id="${u.id}">${Icons.view}</button>
        <button class="btn btn-sm btn-outline edit-btn" data-id="${u.id}">${Icons.edit}</button>
        <button class="btn btn-sm btn-outline delete-btn" data-id="${u.id}">${Icons.delete}</button></td></tr>`).join('')}</tbody></table>
      </div>
    </div>
  `;
  
  document.getElementById('add-btn')?.addEventListener('click', () => showForm('create'));
  document.querySelectorAll('.view-btn').forEach(b => b.addEventListener('click', (e) => {
    const u = units.find(x => x.id === (e.target as HTMLElement).closest('button')?.dataset.id);
    if(u) modal.view('Unit Details', `<div class="modal-details"><div class="modal-form-group"><label class="modal-form-label">Code</label><p>${u.code}</p></div><div class="modal-form-group"><label class="modal-form-label">Name</label><p>${u.name}</p></div><div class="modal-form-group"><label class="modal-form-label">Description</label><p>${u.description}</p></div></div>`, 'md');
  }));
  document.querySelectorAll('.edit-btn').forEach(b => b.addEventListener('click', (e) => {
    const u = units.find(x => x.id === (e.target as HTMLElement).closest('button')?.dataset.id);
    if(u) showForm('edit', u);
  }));
  document.querySelectorAll('.delete-btn').forEach(b => b.addEventListener('click', (e) => {
    const u = units.find(x => x.id === (e.target as HTMLElement).closest('button')?.dataset.id);
    if(u) modal.delete('Delete Unit', `Delete unit <strong>${u.name}</strong>?`, async () => window.location.reload());
  }));
}

function showForm(mode: 'create'|'edit', unit?: any): void {
  modal.form(mode === 'create' ? 'Create Unit' : 'Edit Unit', `
    <form id="form">
      <div class="modal-form-group"><label class="modal-form-label">Code *</label><input type="text" class="form-input" name="code" value="${unit?.code || ''}" required></div>
      <div class="modal-form-group"><label class="modal-form-label">Name *</label><input type="text" class="form-input" name="name" value="${unit?.name || ''}" required></div>
      <div class="modal-form-group"><label class="modal-form-label">Description</label><textarea class="form-textarea" name="description">${unit?.description || ''}</textarea></div>
    </form>
  `, async () => {
    const form = document.getElementById('form') as HTMLFormElement;
    if(form.checkValidity()) window.location.reload(); else form.reportValidity();
  }, mode);
}
