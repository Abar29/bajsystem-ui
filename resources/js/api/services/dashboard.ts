import { apiClient } from '../client';
import type { DashboardStats, RecentActivity, Alert } from '../../types';
import { mockDashboardStats, mockRecentActivities, mockAlerts } from '../../mock/data';

export class DashboardService {
  // Get dashboard statistics
  async getStats(): Promise<DashboardStats> {
    if (apiClient.isMockMode()) {
      return Promise.resolve(mockDashboardStats);
    }
    return apiClient.get<DashboardStats>('/dashboard/stats');
  }

  // Get recent activities
  async getRecentActivities(limit: number = 10): Promise<RecentActivity[]> {
    if (apiClient.isMockMode()) {
      return Promise.resolve(mockRecentActivities.slice(0, limit));
    }
    return apiClient.get<RecentActivity[]>(`/dashboard/activities?limit=${limit}`);
  }

  // Get alerts
  async getAlerts(unreadOnly: boolean = false): Promise<Alert[]> {
    if (apiClient.isMockMode()) {
      const alerts = unreadOnly 
        ? mockAlerts.filter(a => !a.isRead) 
        : mockAlerts;
      return Promise.resolve(alerts);
    }
    return apiClient.get<Alert[]>(`/dashboard/alerts?unreadOnly=${unreadOnly}`);
  }

  // Mark alert as read
  async markAlertAsRead(alertId: string): Promise<void> {
    if (apiClient.isMockMode()) {
      const alert = mockAlerts.find(a => a.id === alertId);
      if (alert) alert.isRead = true;
      return Promise.resolve();
    }
    return apiClient.patch<void>(`/dashboard/alerts/${alertId}/read`);
  }
}

export const dashboardService = new DashboardService();
