import { apiClient } from '../client';
import type { StockItem, StockBatch, Item } from '../../types';
import { mockStockItems, mockStockBatches, mockItems } from '../../mock/data';

export class InventoryService {
  // Get all stock items
  async getStockItems(): Promise<StockItem[]> {
    if (apiClient.isMockMode()) {
      return Promise.resolve(mockStockItems);
    }
    return apiClient.get<StockItem[]>('/inventory/stock');
  }

  // Get stock item by ID
  async getStockItemById(id: string): Promise<StockItem> {
    if (apiClient.isMockMode()) {
      const item = mockStockItems.find(s => s.id === id);
      if (!item) throw new Error('Stock item not found');
      return Promise.resolve(item);
    }
    return apiClient.get<StockItem>(`/inventory/stock/${id}`);
  }

  // Get stock batches
  async getStockBatches(): Promise<StockBatch[]> {
    if (apiClient.isMockMode()) {
      return Promise.resolve(mockStockBatches);
    }
    return apiClient.get<StockBatch[]>('/inventory/batches');
  }

  // Get low stock items
  async getLowStockItems(): Promise<StockItem[]> {
    if (apiClient.isMockMode()) {
      return Promise.resolve(
        mockStockItems.filter(item => {
          const itemMaster = mockItems.find(i => i.id === item.itemId);
          return itemMaster && item.quantityAvailable < itemMaster.reorderPoint;
        })
      );
    }
    return apiClient.get<StockItem[]>('/inventory/stock/low-stock');
  }

  // Get expiring batches
  async getExpiringBatches(days: number = 30): Promise<StockBatch[]> {
    if (apiClient.isMockMode()) {
      const now = new Date();
      const futureDate = new Date();
      futureDate.setDate(now.getDate() + days);
      
      return Promise.resolve(
        mockStockBatches.filter(batch => {
          if (!batch.expiryDate) return false;
          const expiryDate = new Date(batch.expiryDate);
          return expiryDate <= futureDate && expiryDate > now;
        })
      );
    }
    return apiClient.get<StockBatch[]>(`/inventory/batches/expiring?days=${days}`);
  }

  // Get all items (master data)
  async getItems(): Promise<Item[]> {
    if (apiClient.isMockMode()) {
      return Promise.resolve(mockItems);
    }
    return apiClient.get<Item[]>('/inventory/items');
  }
}

export const inventoryService = new InventoryService();
