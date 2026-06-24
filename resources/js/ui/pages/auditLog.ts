import { modal } from '../components/Modal';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  entity: string;
  entityId: string;
  changes?: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
  ipAddress: string;
  userAgent: string;
}

const mockAuditLogs: AuditLogEntry[] = [
  {
    id: 'audit-1',
    timestamp: '2024-06-22T14:30:25Z',
    user: 'admin',
    action: 'CREATE',
    module: 'Purchase Orders',
    entity: 'PurchaseOrder',
    entityId: 'PO-2024-0156',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  },
  {
    id: 'audit-2',
    timestamp: '2024-06-22T13:15:10Z',
    user: 'warehouse.manager',
    action: 'UPDATE',
    module: 'Inventory',
    entity: 'StockItem',
    entityId: 'stock-1',
    changes: [
      {
        field: 'quantityOnHand',
        oldValue: '300',
        newValue: '250',
      },
      {
        field: 'quantityAvailable',
        oldValue: '250',
        newValue: '200',
      },
    ],
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  },
  {
    id: 'audit-3',
    timestamp: '2024-06-22T11:45:33Z',
    user: 'purchaser1',
    action: 'DELETE',
    module: 'Suppliers',
    entity: 'Supplier',
    entityId: 'SUP-099',
    ipAddress: '192.168.1.110',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  },
  {
    id: 'audit-4',
    timestamp: '2024-06-22T10:20:15Z',
    user: 'admin',
    action: 'UPDATE',
    module: 'Users',
    entity: 'User',
    entityId: 'user-5',
    changes: [
      {
        field: 'role',
        oldValue: 'Viewer',
        newValue: 'Purchaser',
      },
      {
        field: 'isActive',
        oldValue: 'false',
        newValue: 'true',
      },
    ],
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  },
  {
    id: 'audit-5',
    timestamp: '2024-06-22T09:30:45Z',
    user: 'delivery.person',
    action: 'CREATE',
    module: 'Deliveries',
    entity: 'DeliveryOrder',
    entityId: 'DO-2024-0089',
    ipAddress: '192.168.1.120',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  },
  {
    id: 'audit-6',
    timestamp: '2024-06-21T16:45:00Z',
    user: 'warehouse.manager',
    action: 'UPDATE',
    module: 'Inventory',
    entity: 'StockBatch',
    entityId: 'BATCH-2024-002',
    changes: [
      {
        field: 'status',
        oldValue: 'active',
        newValue: 'depleted',
      },
    ],
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  },
  {
    id: 'audit-7',
    timestamp: '2024-06-21T15:20:30Z',
    user: 'admin',
    action: 'CREATE',
    module: 'Roles',
    entity: 'Role',
    entityId: 'role-6',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  },
  {
    id: 'audit-8',
    timestamp: '2024-06-21T14:10:15Z',
    user: 'purchaser1',
    action: 'UPDATE',
    module: 'Purchase Requests',
    entity: 'PurchaseRequest',
    entityId: 'PR-2024-0234',
    changes: [
      {
        field: 'status',
        oldValue: 'pending',
        newValue: 'approved',
      },
    ],
    ipAddress: '192.168.1.110',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  },
];

export async function renderAuditLog(container: HTMLElement): Promise<void> {
  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Audit Log</h1>
      <p class="page-subtitle">System activity audit trail</p>
    </div>

    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Activity Log</h2>
        <div style="display: flex; gap: 10px;">
          <select class="form-select" id="filter-module" style="width: 200px;">
            <option value="">All Modules</option>
            <option value="Purchase Orders">Purchase Orders</option>
            <option value="Inventory">Inventory</option>
            <option value="Suppliers">Suppliers</option>
            <option value="Deliveries">Deliveries</option>
            <option value="Users">Users</option>
            <option value="Roles">Roles</option>
          </select>
          <select class="form-select" id="filter-action" style="width: 150px;">
            <option value="">All Actions</option>
            <option value="CREATE">Create</option>
            <option value="UPDATE">Update</option>
            <option value="DELETE">Delete</option>
          </select>
        </div>
      </div>

      <div class="search-box">
        <input 
          type="text" 
          class="search-input" 
          placeholder="Search by user, entity, or ID..."
          id="audit-search"
        />
      </div>

      <div class="table-container">
        <table id="audit-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Action</th>
              <th>Module</th>
              <th>Entity</th>
              <th>Entity ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${renderAuditRows(mockAuditLogs)}
          </tbody>
        </table>
      </div>
    </div>
  `;

  setupAuditSearch(mockAuditLogs);
  setupAuditActions(mockAuditLogs);
}

function renderAuditRows(logs: AuditLogEntry[]): string {
  return logs.map(log => `
    <tr data-id="${log.id}">
      <td>${new Date(log.timestamp).toLocaleString()}</td>
      <td>${log.user}</td>
      <td>
        <span class="badge badge-${
          log.action === 'CREATE' ? 'success' :
          log.action === 'UPDATE' ? 'info' : 'danger'
        }">
          ${log.action}
        </span>
      </td>
      <td>${log.module}</td>
      <td>${log.entity}</td>
      <td><code>${log.entityId}</code></td>
      <td>
        <button class="btn btn-sm btn-outline view-audit" data-id="${log.id}" title="View Details">👁️</button>
      </td>
    </tr>
  `).join('');
}

function setupAuditSearch(logs: AuditLogEntry[]): void {
  const searchInput = document.getElementById('audit-search') as HTMLInputElement;
  const filterModule = document.getElementById('filter-module') as HTMLSelectElement;
  const filterAction = document.getElementById('filter-action') as HTMLSelectElement;
  const tableBody = document.querySelector('#audit-table tbody');

  if (!searchInput || !tableBody) return;

  const applyFilters = () => {
    const query = searchInput.value.toLowerCase();
    const module = filterModule.value;
    const action = filterAction.value;

    const filtered = logs.filter(log => {
      const matchesQuery = !query || 
        log.user.toLowerCase().includes(query) ||
        log.entity.toLowerCase().includes(query) ||
        log.entityId.toLowerCase().includes(query);
      
      const matchesModule = !module || log.module === module;
      const matchesAction = !action || log.action === action;

      return matchesQuery && matchesModule && matchesAction;
    });

    tableBody.innerHTML = renderAuditRows(filtered);
    setupAuditActions(logs);
  };

  searchInput.addEventListener('input', applyFilters);
  filterModule?.addEventListener('change', applyFilters);
  filterAction?.addEventListener('change', applyFilters);
}

function setupAuditActions(logs: AuditLogEntry[]): void {
  document.querySelectorAll('.view-audit').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id;
      const log = logs.find(l => l.id === id);
      if (log) showAuditDetails(log);
    });
  });
}

function showAuditDetails(log: AuditLogEntry): void {
  const changesHtml = log.changes ? `
    <div class="modal-form-group">
      <label class="modal-form-label">Changes</label>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Field</th>
              <th>Old Value</th>
              <th>New Value</th>
            </tr>
          </thead>
          <tbody>
            ${log.changes.map(change => `
              <tr>
                <td><strong>${change.field}</strong></td>
                <td><code>${change.oldValue}</code></td>
                <td><code>${change.newValue}</code></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  ` : '<p><em>No changes recorded</em></p>';

  const content = `
    <div class="modal-details">
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Timestamp</label>
          <p>${new Date(log.timestamp).toLocaleString()}</p>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Action</label>
          <p><span class="badge badge-${
            log.action === 'CREATE' ? 'success' :
            log.action === 'UPDATE' ? 'info' : 'danger'
          }">${log.action}</span></p>
        </div>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">User</label>
          <p>${log.user}</p>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Module</label>
          <p>${log.module}</p>
        </div>
      </div>
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Entity Type</label>
          <p>${log.entity}</p>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Entity ID</label>
          <p><code>${log.entityId}</code></p>
        </div>
      </div>
      ${changesHtml}
      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">IP Address</label>
          <p><code>${log.ipAddress}</code></p>
        </div>
      </div>
      <div class="modal-form-group">
        <label class="modal-form-label">User Agent</label>
        <p style="font-size: 0.85em; word-break: break-all;"><code>${log.userAgent}</code></p>
      </div>
    </div>
  `;

  modal.view('Audit Log Entry', content, 'lg');
}
