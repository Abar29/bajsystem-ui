import type { Agency } from '../../types';
import { mockAgencies } from '../../mock/data';
import { modal } from '../components/Modal';
import { FilterPanel, type FilterConfig } from '../components/FilterPanel';
import { Icons } from '../components/Icons';

export async function renderAgencies(container: HTMLElement): Promise<void> {
  container.innerHTML = '<div class="loading">Loading agencies...</div>';

  try {
    const agencies = mockAgencies;
    let filteredAgencies = [...agencies];

    // Define filters
    const filterConfigs: FilterConfig[] = [
      {
        id: 'search',
        label: 'Search',
        type: 'search',
        placeholder: 'Search agencies by name or code...',
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
      filteredAgencies = agencies.filter(agency => {
        // Search filter
        if (values.search) {
          const search = values.search.toLowerCase();
          const matchesSearch = 
            agency.name.toLowerCase().includes(search) ||
            agency.code.toLowerCase().includes(search) ||
            agency.contactPerson.toLowerCase().includes(search);
          if (!matchesSearch) return false;
        }

        // Status filter
        if (values.status && agency.status !== values.status) {
          return false;
        }

        return true;
      });
      
      const tableBody = document.querySelector('#agencies-table tbody');
      if (tableBody) {
        tableBody.innerHTML = renderRows(filteredAgencies);
        setupActions(agencies);
      }
    });

    container.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Agencies</h1>
        <p class="page-subtitle">Manage healthcare agencies and clinics</p>
      </div>

      <div class="card">
        <div class="card-header">
          <h2 class="card-title">All Agencies</h2>
          <button class="btn btn-primary" id="add-agency-btn">
            ${Icons.add}
            <span>Add Agency</span>
          </button>
        </div>

        ${filterPanel.render()}

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
              ${renderRows(filteredAgencies)}
            </tbody>
          </table>
        </div>
      </div>
    `;

    filterPanel.setupEventListeners();
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
        <button class="btn btn-sm btn-outline view-btn" data-id="${a.id}">${Icons.view}</button>
        <button class="btn btn-sm btn-outline edit-btn" data-id="${a.id}">${Icons.edit}</button>
        <button class="btn btn-sm btn-outline delete-btn" data-id="${a.id}">${Icons.delete}</button>
      </td>
    </tr>
  `).join('');
}

function setupActions(agencies: Agency[]): void {

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
