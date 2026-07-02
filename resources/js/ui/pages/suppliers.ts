import { supplierService } from '../../api/services/suppliers';
import type { Supplier } from '../../types';
import { modal } from '../components/Modal';
import { FilterPanel, type FilterConfig } from '../components/FilterPanel';
import { Icons } from '../components/Icons';

export async function renderSuppliers(container: HTMLElement): Promise<void> {
  container.innerHTML = '<div class="loading">Loading suppliers...</div>';

  try {
    const suppliers = await supplierService.getAll();
    let filteredSuppliers = [...suppliers];

    // Define filters
    const filterConfigs: FilterConfig[] = [
      {
        id: 'search',
        label: 'Search',
        type: 'search',
        placeholder: 'Search by name, code, or contact...',
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
      filteredSuppliers = suppliers.filter(supplier => {
        // Search filter
        if (values.search) {
          const search = values.search.toLowerCase();
          const matchesSearch = 
            supplier.name.toLowerCase().includes(search) ||
            supplier.code.toLowerCase().includes(search) ||
            supplier.contactPerson.toLowerCase().includes(search) ||
            supplier.email.toLowerCase().includes(search);
          if (!matchesSearch) return false;
        }

        // Status filter
        if (values.status && supplier.status !== values.status) {
          return false;
        }

        return true;
      });
      
      const tableBody = document.querySelector('#suppliers-table tbody');
      if (tableBody) {
        tableBody.innerHTML = renderSupplierRows(filteredSuppliers);
        setupSupplierActions(suppliers);
      }
    });

    container.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Suppliers</h1>
        <p class="page-subtitle">Manage supplier information</p>
      </div>

      <div class="card">
        <div class="card-header">
          <h2 class="card-title">All Suppliers</h2>
          <button class="btn btn-primary" id="add-supplier-btn">
            ${Icons.add}
            <span>Add Supplier</span>
          </button>
        </div>

        ${filterPanel.render()}

        <div class="table-container">
          <table id="suppliers-table">
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
              ${renderSupplierRows(filteredSuppliers)}
            </tbody>
          </table>
        </div>
      </div>
    `;

    filterPanel.setupEventListeners();
    setupSupplierActions(suppliers);
  } catch (error) {
    container.innerHTML = '<div class="error">Failed to load suppliers</div>';
    console.error('Suppliers error:', error);
  }
}

function renderSupplierRows(suppliers: Supplier[]): string {
  return suppliers.map(supplier => `
    <tr data-id="${supplier.id}">
      <td><strong>${supplier.code}</strong></td>
      <td>${supplier.name}</td>
      <td>${supplier.contactPerson}</td>
      <td>${supplier.email}</td>
      <td>${supplier.phone}</td>
      <td>
        <span class="badge badge-${supplier.status === 'active' ? 'success' : 'secondary'}">
          ${supplier.status.toUpperCase()}
        </span>
      </td>
      <td>
        <button class="btn btn-sm btn-outline view-supplier" data-id="${supplier.id}" title="View">
          ${Icons.view}
        </button>
        <button class="btn btn-sm btn-outline edit-supplier" data-id="${supplier.id}" title="Edit">
          ${Icons.edit}
        </button>
        <button class="btn btn-sm btn-outline delete-supplier" data-id="${supplier.id}" title="Delete">
          ${Icons.delete}
        </button>
      </td>
    </tr>
  `).join('');
}

function setupSupplierActions(suppliers: Supplier[]): void {
  // Add Supplier
  document.getElementById('add-supplier-btn')?.addEventListener('click', () => {
    showSupplierForm('create');
  });

  // View Supplier
  document.querySelectorAll('.view-supplier').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id;
      const supplier = suppliers.find(s => s.id === id);
      if (supplier) showSupplierDetails(supplier);
    });
  });

  // Edit Supplier
  document.querySelectorAll('.edit-supplier').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id;
      const supplier = suppliers.find(s => s.id === id);
      if (supplier) showSupplierForm('edit', supplier);
    });
  });

  // Delete Supplier
  document.querySelectorAll('.delete-supplier').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id;
      const supplier = suppliers.find(s => s.id === id);
      if (supplier) {
        modal.delete(
          'Delete Supplier',
          `Are you sure you want to delete <strong>${supplier.name}</strong>? This action cannot be undone.`,
          async () => {
            await supplierService.delete(id!);
            window.location.reload();
          }
        );
      }
    });
  });
}

function showSupplierDetails(supplier: Supplier): void {
  const content = `
    <div class="modal-details">
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Code</label>
          <p>${supplier.code}</p>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Status</label>
          <p><span class="badge badge-${supplier.status === 'active' ? 'success' : 'secondary'}">${supplier.status.toUpperCase()}</span></p>
        </div>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Company Name</label>
        <p>${supplier.name}</p>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Contact Person</label>
          <p>${supplier.contactPerson}</p>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Tax ID</label>
          <p>${supplier.taxId}</p>
        </div>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Email</label>
          <p>${supplier.email}</p>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Phone</label>
          <p>${supplier.phone}</p>
        </div>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Address</label>
        <p>${supplier.address}</p>
      </div>
    </div>
  `;
  
  modal.view('Supplier Details', content, 'lg');
}

function showSupplierForm(mode: 'create' | 'edit', supplier?: Supplier): void {
  const content = `
    <form id="supplier-form">
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Code *</label>
          <input type="text" class="form-input" name="code" value="${supplier?.code || ''}" required>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Status *</label>
          <select class="form-select" name="status" required>
            <option value="active" ${supplier?.status === 'active' ? 'selected' : ''}>Active</option>
            <option value="inactive" ${supplier?.status === 'inactive' ? 'selected' : ''}>Inactive</option>
          </select>
        </div>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Company Name *</label>
        <input type="text" class="form-input" name="name" value="${supplier?.name || ''}" required>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Contact Person *</label>
          <input type="text" class="form-input" name="contactPerson" value="${supplier?.contactPerson || ''}" required>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Tax ID *</label>
          <input type="text" class="form-input" name="taxId" value="${supplier?.taxId || ''}" required>
        </div>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Email *</label>
          <input type="email" class="form-input" name="email" value="${supplier?.email || ''}" required>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Phone *</label>
          <input type="tel" class="form-input" name="phone" value="${supplier?.phone || ''}" required>
        </div>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">Address *</label>
        <textarea class="form-textarea" name="address" required>${supplier?.address || ''}</textarea>
      </div>
    </form>
  `;

  modal.form(
    mode === 'create' ? 'Create Supplier' : 'Edit Supplier',
    content,
    async () => {
      const form = document.getElementById('supplier-form') as HTMLFormElement;
      if (form.checkValidity()) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        if (mode === 'create') {
          await supplierService.create(data as any);
        } else if (supplier) {
          await supplierService.update(supplier.id, data as any);
        }
        window.location.reload();
      } else {
        form.reportValidity();
      }
    },
    mode
  );
}
