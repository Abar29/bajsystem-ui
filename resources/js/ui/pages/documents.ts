import { documentService } from '../../api/services/documents';
import type { Document } from '../../types';
import { FilterPanel, type FilterConfig } from '../components/FilterPanel';
import { Icons } from '../components/Icons';

export async function renderDocuments(container: HTMLElement): Promise<void> {
  container.innerHTML = '<div class="loading">Loading documents...</div>';

  try {
    const documents = await documentService.getAll();
    let filteredDocuments = [...documents];

    const statusCounts = {
      draft: documents.filter(d => d.status === 'draft').length,
      under_review: documents.filter(d => d.status === 'under_review').length,
      approved: documents.filter(d => d.status === 'approved').length,
    };

    // Define filters
    const filterConfigs: FilterConfig[] = [
      {
        id: 'search',
        label: 'Search',
        type: 'search',
        placeholder: 'Search by title or number...',
      },
      {
        id: 'status',
        label: 'Status',
        type: 'select',
        options: [
          { value: 'draft', label: 'Draft' },
          { value: 'under_review', label: 'Under Review' },
          { value: 'approved', label: 'Approved' },
          { value: 'rejected', label: 'Rejected' },
          { value: 'archived', label: 'Archived' },
        ],
      },
      {
        id: 'type',
        label: 'Document Type',
        type: 'select',
        options: [
          { value: 'contract', label: 'Contract' },
          { value: 'invoice', label: 'Invoice' },
          { value: 'report', label: 'Report' },
          { value: 'specification', label: 'Specification' },
          { value: 'other', label: 'Other' },
        ],
      },
      {
        id: 'dateRange',
        label: 'Upload Date',
        type: 'dateRange',
      },
    ];

    const filterPanel = new FilterPanel(filterConfigs, (values) => {
      filteredDocuments = documents.filter(doc => {
        // Search filter
        if (values.search) {
          const search = values.search.toLowerCase();
          const matchesSearch = 
            doc.title.toLowerCase().includes(search) ||
            doc.documentNumber.toLowerCase().includes(search);
          if (!matchesSearch) return false;
        }

        // Status filter
        if (values.status && doc.status !== values.status) {
          return false;
        }

        // Type filter
        if (values.type && doc.documentType !== values.type) {
          return false;
        }

        // Date range filter
        if (values.dateRange?.start || values.dateRange?.end) {
          const uploadDate = new Date(doc.uploadDate);
          if (values.dateRange.start) {
            const startDate = new Date(values.dateRange.start);
            if (uploadDate < startDate) return false;
          }
          if (values.dateRange.end) {
            const endDate = new Date(values.dateRange.end);
            if (uploadDate > endDate) return false;
          }
        }

        return true;
      });
      
      const tableBody = document.querySelector('#document-table tbody');
      if (tableBody) {
        tableBody.innerHTML = renderDocumentRows(filteredDocuments);
      }
    });

    container.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Document Management</h1>
        <p class="page-subtitle">Manage and review system documents</p>
      </div>

      <div class="dashboard-grid" style="grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); margin-bottom: 2rem;">
        <div class="stat-card">
          <div class="stat-label">Total Documents</div>
          <div class="stat-value">${documents.length}</div>
        </div>
        <div class="stat-card warning">
          <div class="stat-label">Under Review</div>
          <div class="stat-value">${statusCounts.under_review}</div>
        </div>
        <div class="stat-card success">
          <div class="stat-label">Approved</div>
          <div class="stat-value">${statusCounts.approved}</div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Documents</h2>
          <button class="btn btn-primary">
            ${Icons.upload}
            <span>Upload Document</span>
          </button>
        </div>

        ${filterPanel.render()}

        <div class="table-container">
          <table id="document-table">
            <thead>
              <tr>
                <th>Document Number</th>
                <th>Title</th>
                <th>Type</th>
                <th>Group</th>
                <th>Upload Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${renderDocumentRows(filteredDocuments)}
            </tbody>
          </table>
        </div>
      </div>
    `;

    filterPanel.setupEventListeners();
  } catch (error) {
    container.innerHTML = '<div class="error">Failed to load documents</div>';
    console.error('Documents error:', error);
  }
}

function renderDocumentRows(documents: Document[]): string {
  return documents.map(doc => `
    <tr>
      <td><strong>${doc.documentNumber}</strong></td>
      <td>${doc.title}</td>
      <td>${doc.documentType}</td>
      <td>${doc.documentGroup}</td>
      <td>${formatDate(doc.uploadDate)}</td>
      <td><span class="badge badge-${getStatusBadgeClass(doc.status)}">${doc.status.replace('_', ' ').toUpperCase()}</span></td>
      <td>
        <button class="btn btn-sm btn-outline" title="View">${Icons.view}</button>
        <button class="btn btn-sm btn-outline" title="Download">${Icons.download}</button>
        <button class="btn btn-sm btn-outline" title="Review">${Icons.check}</button>
      </td>
    </tr>
  `).join('');
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'draft': return 'secondary';
    case 'under_review': return 'warning';
    case 'approved': return 'success';
    case 'rejected': return 'danger';
    case 'archived': return 'secondary';
    default: return 'secondary';
  }
}

function setupDocumentSearch(documents: Document[]): void {
  const searchInput = document.getElementById('document-search') as HTMLInputElement;
  const tableBody = document.querySelector('#document-table tbody');

  if (!searchInput || !tableBody) return;

  searchInput.addEventListener('input', (e) => {
    const query = (e.target as HTMLInputElement).value.toLowerCase();
    const filtered = documents.filter(doc => 
      doc.title.toLowerCase().includes(query) ||
      doc.documentNumber.toLowerCase().includes(query) ||
      doc.documentType.toLowerCase().includes(query)
    );
    tableBody.innerHTML = renderDocumentRows(filtered);
  });
}
