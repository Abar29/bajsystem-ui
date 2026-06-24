import { apiClient } from '../client';
import type { DeliveryOrder } from '../../types';
import { mockDeliveryOrders } from '../../mock/data';

export class DeliveryService {
  // Get all delivery orders
  async getAll(): Promise<DeliveryOrder[]> {
    if (apiClient.isMockMode()) {
      return Promise.resolve(mockDeliveryOrders);
    }
    return apiClient.get<DeliveryOrder[]>('/deliveries');
  }

  // Get delivery order by ID
  async getById(id: string): Promise<DeliveryOrder> {
    if (apiClient.isMockMode()) {
      const delivery = mockDeliveryOrders.find(d => d.id === id);
      if (!delivery) throw new Error('Delivery order not found');
      return Promise.resolve(delivery);
    }
    return apiClient.get<DeliveryOrder>(`/deliveries/${id}`);
  }

  // Create delivery order
  async create(delivery: Omit<DeliveryOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<DeliveryOrder> {
    if (apiClient.isMockMode()) {
      const newDelivery: DeliveryOrder = {
        ...delivery,
        id: `do-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockDeliveryOrders.push(newDelivery);
      return Promise.resolve(newDelivery);
    }
    return apiClient.post<DeliveryOrder>('/deliveries', delivery);
  }

  // Update delivery order
  async update(id: string, delivery: Partial<DeliveryOrder>): Promise<DeliveryOrder> {
    if (apiClient.isMockMode()) {
      const index = mockDeliveryOrders.findIndex(d => d.id === id);
      if (index === -1) throw new Error('Delivery order not found');
      mockDeliveryOrders[index] = { ...mockDeliveryOrders[index]!, ...delivery, updatedAt: new Date().toISOString() };
      return Promise.resolve(mockDeliveryOrders[index]!);
    }
    return apiClient.put<DeliveryOrder>(`/deliveries/${id}`, delivery);
  }

  // Get pending deliveries
  async getPending(): Promise<DeliveryOrder[]> {
    if (apiClient.isMockMode()) {
      return Promise.resolve(
        mockDeliveryOrders.filter(d => 
          d.status === 'scheduled' || d.status === 'in_transit'
        )
      );
    }
    return apiClient.get<DeliveryOrder[]>('/deliveries?status=pending');
  }
}

export const deliveryService = new DeliveryService();
