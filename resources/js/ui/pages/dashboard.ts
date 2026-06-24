import { dashboardService } from '../../api/services/dashboard';
import type { DashboardStats, RecentActivity, Alert } from '../../types';

export async function renderDashboard(container: HTMLElement): Promise<void> {
  container.innerHTML = '<div class="loading">Loading dashboard...</div>';

  try {
    const [stats, activities, alerts] = await Promise.all([
      dashboardService.getStats(),
      dashboardService.getRecentActivities(5),
      dashboardService.getAlerts(true),
    ]);

    container.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">Overview of BAJ System operations</p>
      </div>

      ${renderStats(stats)}
      ${renderAlerts(alerts)}
      
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Recent Activities</h2>
        </div>
        ${renderActivities(activities)}
      </div>
    `;
  } catch (error) {
    container.innerHTML = '<div class="error">Failed to load dashboard data</div>';
    console.error('Dashboard error:', error);
  }
}

function renderStats(stats: DashboardStats): string {
  return `
    <div class="dashboard-grid">
      <div class="stat-card warning">
        <div class="stat-label">Pending Approvals</div>
        <div class="stat-value">${stats.pendingApprovals}</div>
        <div class="stat-change">Requires attention</div>
      </div>
      
      <div class="stat-card danger">
        <div class="stat-label">Low Stock Items</div>
        <div class="stat-value">${stats.lowStockItems}</div>
        <div class="stat-change">Below reorder point</div>
      </div>
      
      <div class="stat-card danger">
        <div class="stat-label">Expiring Soon</div>
        <div class="stat-value">${stats.expiringItems}</div>
        <div class="stat-change">Within 7 days</div>
      </div>
      
      <div class="stat-card info">
        <div class="stat-label">Pending Deliveries</div>
        <div class="stat-value">${stats.pendingDeliveries}</div>
        <div class="stat-change">In queue</div>
      </div>
      
      <div class="stat-card">
        <div class="stat-label">Active Orders</div>
        <div class="stat-value">${stats.activeOrders}</div>
        <div class="stat-change positive">+5 this week</div>
      </div>
      
      <div class="stat-card">
        <div class="stat-label">Total Suppliers</div>
        <div class="stat-value">${stats.totalSuppliers}</div>
        <div class="stat-change">Active partners</div>
      </div>
      
      <div class="stat-card">
        <div class="stat-label">Total Items</div>
        <div class="stat-value">${stats.totalItems}</div>
        <div class="stat-change">In catalog</div>
      </div>
      
      <div class="stat-card">
        <div class="stat-label">Warehouse Capacity</div>
        <div class="stat-value">${stats.warehouseCapacity}%</div>
        <div class="stat-change">Utilization</div>
      </div>
    </div>
  `;
}

function renderAlerts(alerts: Alert[]): string {
  if (alerts.length === 0) return '';

  return `
    <div class="card mb-3">
      <div class="card-header">
        <h2 class="card-title">⚠️ Alerts</h2>
      </div>
      <div>
        ${alerts.map(alert => `
          <div class="alert-item" style="padding: 1rem; border-left: 4px solid ${getAlertColor(alert.severity)}; margin-bottom: 0.5rem; background-color: #f8f9fa;">
            <div style="display: flex; justify-content: space-between; align-items: start;">
              <div>
                <div style="font-weight: 600; margin-bottom: 0.25rem;">${alert.title}</div>
                <div style="color: #6c757d; font-size: 0.875rem;">${alert.message}</div>
              </div>
              <span class="badge badge-${alert.severity === 'critical' ? 'danger' : alert.severity === 'high' ? 'warning' : 'info'}">
                ${alert.severity.toUpperCase()}
              </span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function getAlertColor(severity: string): string {
  switch (severity) {
    case 'critical': return '#dc3545';
    case 'high': return '#ffc107';
    case 'medium': return '#17a2b8';
    default: return '#6c757d';
  }
}

function renderActivities(activities: RecentActivity[]): string {
  return `
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Activity</th>
            <th>Description</th>
            <th>User</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${activities.map(activity => `
            <tr>
              <td>${formatTime(activity.timestamp)}</td>
              <td>${activity.title}</td>
              <td>${activity.description}</td>
              <td>${activity.user}</td>
              <td>${activity.status ? `<span class="badge badge-${getStatusBadgeClass(activity.status)}">${activity.status}</span>` : '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  
  if (hours < 1) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
}

function getStatusBadgeClass(status: string): string {
  if (status.includes('completed') || status.includes('approved')) return 'success';
  if (status.includes('pending') || status.includes('pending_review')) return 'warning';
  if (status.includes('rejected') || status.includes('failed')) return 'danger';
  return 'secondary';
}
