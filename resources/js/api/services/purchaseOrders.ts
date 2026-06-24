import { apiClient } from '../client';
import type { PurchaseOrder, PurchaseRequest, Quotation } from '../../types';
import { mockPurchaseOrders, mockPurchaseRequests, mockQuotations } from '../../mock/data';

export class PurchaseOrderService {
  // Get all purchase orders
  async getAll(): Promise<PurchaseOrder[]> {
    if (apiClient.isMockMode()) {
      return Promise.resolve(mockPurchaseOrders);
    }
    return apiClient.get<PurchaseOrder[]>('/purchase-orders');
  }

  // Get purchase order by ID
  async getById(id: string): Promise<PurchaseOrder> {
    if (apiClient.isMockMode()) {
      const po = mockPurchaseOrders.find(p => p.id === id);
      if (!po) throw new Error('Purchase order not found');
      return Promise.resolve(po);
    }
    return apiClient.get<PurchaseOrder>(`/purchase-orders/${id}`);
  }

  // Create purchase order
  async create(po: Omit<PurchaseOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<PurchaseOrder> {
    if (apiClient.isMockMode()) {
      const newPO: PurchaseOrder = {
        ...po,
        id: `po-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockPurchaseOrders.push(newPO);
      return Promise.resolve(newPO);
    }
    return apiClient.post<PurchaseOrder>('/purchase-orders', po);
  }

  // Update purchase order
  async update(id: string, po: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
    if (apiClient.isMockMode()) {
      const index = mockPurchaseOrders.findIndex(p => p.id === id);
      if (index === -1) throw new Error('Purchase order not found');
      mockPurchaseOrders[index] = { ...mockPurchaseOrders[index]!, ...po, updatedAt: new Date().toISOString() };
      return Promise.resolve(mockPurchaseOrders[index]!);
    }
    return apiClient.put<PurchaseOrder>(`/purchase-orders/${id}`, po);
  }

  // Get purchase requests
  async getRequests(): Promise<PurchaseRequest[]> {
    if (apiClient.isMockMode()) {
      return Promise.resolve(mockPurchaseRequests);
    }
    return apiClient.get<PurchaseRequest[]>('/purchase-requests');
  }

  // Get quotations
  async getQuotations(): Promise<Quotation[]> {
    if (apiClient.isMockMode()) {
      return Promise.resolve(mockQuotations);
    }
    return apiClient.get<Quotation[]>('/quotations');
  }
}

export const purchaseOrderService = new PurchaseOrderService();
