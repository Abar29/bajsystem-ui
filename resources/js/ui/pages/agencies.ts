import type { Agency } from '../../types';
import { mockAgencies } from '../../mock/data';
import { modal } from '../components/Modal';

export async function renderAgencies(container: HTMLElement): Promise<void> {
  container.innerHTML = '<div class="loading">Loading agencies...</div>';

  try {
    const agencies = mockAgencies;

    container.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Agencies</h1>
        <p class="page-subtitle">Manage healthcare agencies and clinics</p>
      </div>

      <div class="card">
        <div class="card-header">
          <h2 class="card-title">All Agencies</h2>
          <button class="btn btn-primary" id="add-agency-btn">
            <span>➕</span>
            Add Agency
          </button>
        </div>

        <div class="search-box">
          <input type="text" class="search-input" placeholder="Search agencies..." id="agency-search" />
        </div>

        <div class="table-container">
          <table id="agencies-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Contact Person</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${renderRows(agencies)}
            </tbody>
          </table>
        </div>
      </div>
    `;

    setupActions(agencies);
  } catch (error) {
    container.innerHTML = '<div class="error">Failed to load agencies</div>';
  }
}

function renderRows(agencies: Agency[]): string {
  return agencies.map(a => `
    <tr data-id="${a.id}">
      <td><strong>${a.code}</strong></td>
      <td>${a.name}</td>
      <td>${a.contactPerson}</td>
      <td>${a.email}</td>
      <td>${a.phone}</td>
      <td><span class="badge badge-${a.status === 'active' ? 'success' : 'secondary'}">${a.status.toUpperCase()}</span></td>
      <td>
        <button class="btn btn-sm btn-outline view-btn" data-id="${a.id}">👁️</button>
        <button class="btn btn-sm btn-outline edit-btn" data-id="${a.id}">✏️</button>
        <button class="btn btn-sm btn-outline delete-btn" data-id="${a.id}">🗑️</button>
      </td>
    </tr>
  `).join('');
}

function setupActions(agencies: Agency[]): void {
  const searchInput = document.getElementById('agency-search') as HTMLInputElement;
  const tableBody = document.querySelector('#agencies-table tbody');

  searchInput?.addEventListener('input', (e) => {
    const query = (e.target as HTMLInputElement).value.toLowerCase();
    const filtered = agencies.filter(a => 
      a.name.toLowerCase().includes(query) || a.code.toLowerCase().includes(query)
    );
    if (tableBody) tableBody.innerHTML = renderRows(filtered);
    setupActions(agencies);
  });

  document.getElementById('add-agency-btn')?.addEventListener('click', () => {
    showForm('create');
  });

  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id;
      const agency = agencies.find(a => a.id === id);
      if (agency) showDetails(agency);
    });
  });

  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id;
      const agency = agencies.find(a => a.id === id);
      if (agency) showForm('edit', agency);
    });
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id;
      const agency = agencies.find(a => a.id === id);
      if (agency) {
        modal.delete('Delete Agency', `Delete <strong>${agency.name}</strong>?`, async () => {
          mockAgencies.splice(mockAgencies.findIndex(a => a.id === id), 1);
          window.location.reload();
        });
      }
    });
  });
}

function showDetails(agency: Agency): void {
  const content = `
    <div class="modal-details">
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Code</label>
          <p>${agency.code}</p>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Status</label>
          <p><span class="badge badge-${agency.status === 'active' ? 'success' : 'secondary'}">${agency.status.toUpperCase()}</span></p>
        </div>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Agency Name</label>
        <p>${agency.name}</p>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Contact Person</label>
          <p>${agency.contactPerson}</p>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Phone</label>
          <p>${agency.phone}</p>
        </div>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Email</label>
        <p>${agency.email}</p>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Address</label>
        <p>${agency.address}</p>
      </div>
    </div>
  `;
  modal.view('Agency Details', content, 'lg');
}

function showForm(mode: 'create' | 'edit', agency?: Agency): void {
  const content = `
    <form id="agency-form">
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Code *</label>
          <input type="text" class="form-input" name="code" value="${agency?.code || ''}" required>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Status *</label>
          <select class="form-select" name="status" required>
            <option value="active" ${agency?.status === 'active' ? 'selected' : ''}>Active</option>
            <option value="inactive" ${agency?.status === 'inactive' ? 'selected' : ''}>Inactive</option>
          </select>
        </div>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Agency Name *</label>
        <input type="text" class="form-input" name="name" value="${agency?.name || ''}" required>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Contact Person *</label>
          <input type="text" class="form-input" name="contactPerson" value="${agency?.contactPerson || ''}" required>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Phone *</label>
          <input type="tel" class="form-input" name="phone" value="${agency?.phone || ''}" required>
        </div>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Email *</label>
        <input type="email" class="form-input" name="email" value="${agency?.email || ''}" required>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Address *</label>
        <textarea class="form-textarea" name="address" required>${agency?.address || ''}</textarea>
      </div>
    </form>
  `;

  modal.form(mode === 'create' ? 'Create Agency' : 'Edit Agency', content, async () => {
    const form = document.getElementById('agency-form') as HTMLFormElement;
    if (form.checkValidity()) {
      // Mock save
      window.location.reload();
    } else {
      form.reportValidity();
    }
  }, mode);
}
