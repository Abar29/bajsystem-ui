import { documentService } from '../../api/services/documents';
import type { Document } from '../../types';

export async function renderDocuments(container: HTMLElement): Promise<void> {
  container.innerHTML = '<div class="loading">Loading documents...</div>';

  try {
    const documents = await documentService.getAll();

    const statusCounts = {
      draft: documents.filter(d => d.status === 'draft').length,
      under_review: documents.filter(d => d.status === 'under_review').length,
      approved: documents.filter(d => d.status === 'approved').length,
    };

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
            <span>📤</span>
            Upload Document
          </button>
        </div>

        <div class="search-box">
          <input 
            type="text" 
            class="search-input" 
            placeholder="Search documents by title or number..."
            id="document-search"
          />
        </div>

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
              ${renderDocumentRows(documents)}
            </tbody>
          </table>
        </div>
      </div>
    `;

    setupDocumentSearch(documents);
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
        <button class="btn btn-sm btn-outline" title="View">👁️</button>
        <button class="btn btn-sm btn-outline" title="Download">⬇️</button>
        <button class="btn btn-sm btn-outline" title="Review">✓</button>
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
