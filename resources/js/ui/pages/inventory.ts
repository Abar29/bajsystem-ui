import { inventoryService } from '../../api/services/inventory';
import type { StockItem } from '../../types';

export async function renderInventory(container: HTMLElement): Promise<void> {
  container.innerHTML = '<div class="loading">Loading inventory...</div>';

  try {
    const [stockItems, lowStock, expiringBatches] = await Promise.all([
      inventoryService.getStockItems(),
      inventoryService.getLowStockItems(),
      inventoryService.getExpiringBatches(30),
    ]);

    container.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Inventory Management</h1>
        <p class="page-subtitle">Stock levels and warehouse management</p>
      </div>

      <div class="dashboard-grid" style="grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); margin-bottom: 2rem;">
        <div class="stat-card">
          <div class="stat-label">Total Stock Items</div>
          <div class="stat-value">${stockItems.length}</div>
        </div>
        <div class="stat-card danger">
          <div class="stat-label">Low Stock Alert</div>
          <div class="stat-value">${lowStock.length}</div>
          <div class="stat-change">Below reorder point</div>
        </div>
        <div class="stat-card warning">
          <div class="stat-label">Expiring Soon</div>
          <div class="stat-value">${expiringBatches.length}</div>
          <div class="stat-change">Within 30 days</div>
        </div>
      </div>

      ${lowStock.length > 0 ? renderLowStockAlert(lowStock) : ''}

      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Stock List</h2>
          <button class="btn btn-primary">
            <span>📦</span>
            Receive Stock
          </button>
        </div>

        <div class="search-box">
          <input 
            type="text" 
            class="search-input" 
            placeholder="Search items by code or name..."
            id="stock-search"
          />
        </div>

        <div class="table-container">
          <table id="stock-table">
            <thead>
              <tr>
                <th>Item Code</th>
                <th>Item Name</th>
                <th>Warehouse</th>
                <th>On Hand</th>
                <th>Reserved</th>
                <th>Available</th>
                <th>Unit</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${renderStockRows(stockItems)}
            </tbody>
          </table>
        </div>
      </div>
    `;

    setupStockSearch(stockItems);
  } catch (error) {
    container.innerHTML = '<div class="error">Failed to load inventory data</div>';
    console.error('Inventory error:', error);
  }
}

function renderLowStockAlert(lowStock: StockItem[]): string {
  return `
    <div class="card mb-3" style="border-left: 4px solid #dc3545;">
      <div class="card-header">
        <h2 class="card-title" style="color: #dc3545;">⚠️ Low Stock Alert</h2>
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Item Code</th>
              <th>Item Name</th>
              <th>Warehouse</th>
              <th>Available Qty</th>
            </tr>
          </thead>
          <tbody>
            ${lowStock.map(item => `
              <tr>
                <td><strong>${item.itemCode}</strong></td>
                <td>${item.itemName}</td>
                <td>${item.warehouseName}</td>
                <td><span class="text-danger">${item.quantityAvailable} ${item.unit}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderStockRows(items: StockItem[]): string {
  return items.map(item => {
    const isLow = item.quantityAvailable < 100; // Simplified check
    const statusClass = isLow ? 'badge-danger' : 'badge-success';
    const statusText = isLow ? 'LOW' : 'GOOD';

    return `
      <tr>
        <td><strong>${item.itemCode}</strong></td>
        <td>${item.itemName}</td>
        <td>${item.warehouseName}</td>
        <td>${item.quantityOnHand}</td>
        <td>${item.quantityReserved}</td>
        <td><strong>${item.quantityAvailable}</strong></td>
        <td>${item.unit}</td>
        <td><span class="badge ${statusClass}">${statusText}</span></td>
      </tr>
    `;
  }).join('');
}

function setupStockSearch(items: StockItem[]): void {
  const searchInput = document.getElementById('stock-search') as HTMLInputElement;
  const tableBody = document.querySelector('#stock-table tbody');

  if (!searchInput || !tableBody) return;

  searchInput.addEventListener('input', (e) => {
    const query = (e.target as HTMLInputElement).value.toLowerCase();
    const filtered = items.filter(item => 
      item.itemCode.toLowerCase().includes(query) ||
      item.itemName.toLowerCase().includes(query) ||
      item.warehouseName.toLowerCase().includes(query)
    );
    tableBody.innerHTML = renderStockRows(filtered);
  });
}
