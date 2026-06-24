import { apiClient } from '../client';
import type { Supplier } from '../../types';
import { mockSuppliers } from '../../mock/data';

export class SupplierService {
  // Get all suppliers
  async getAll(): Promise<Supplier[]> {
    if (apiClient.isMockMode()) {
      return Promise.resolve(mockSuppliers);
    }
    return apiClient.get<Supplier[]>('/suppliers');
  }

  // Get supplier by ID
  async getById(id: string): Promise<Supplier> {
    if (apiClient.isMockMode()) {
      const supplier = mockSuppliers.find(s => s.id === id);
      if (!supplier) throw new Error('Supplier not found');
      return Promise.resolve(supplier);
    }
    return apiClient.get<Supplier>(`/suppliers/${id}`);
  }

  // Create new supplier
  async create(supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>): Promise<Supplier> {
    if (apiClient.isMockMode()) {
      const newSupplier: Supplier = {
        ...supplier,
        id: `sup-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockSuppliers.push(newSupplier);
      return Promise.resolve(newSupplier);
    }
    return apiClient.post<Supplier>('/suppliers', supplier);
  }

  // Update supplier
  async update(id: string, supplier: Partial<Supplier>): Promise<Supplier> {
    if (apiClient.isMockMode()) {
      const index = mockSuppliers.findIndex(s => s.id === id);
      if (index === -1) throw new Error('Supplier not found');
      mockSuppliers[index] = { ...mockSuppliers[index]!, ...supplier, updatedAt: new Date().toISOString() };
      return Promise.resolve(mockSuppliers[index]!);
    }
    return apiClient.put<Supplier>(`/suppliers/${id}`, supplier);
  }

  // Delete supplier
  async delete(id: string): Promise<void> {
    if (apiClient.isMockMode()) {
      const index = mockSuppliers.findIndex(s => s.id === id);
      if (index !== -1) mockSuppliers.splice(index, 1);
      return Promise.resolve();
    }
    return apiClient.delete<void>(`/suppliers/${id}`);
  }

  // Search suppliers
  async search(query: string): Promise<Supplier[]> {
    if (apiClient.isMockMode()) {
      const lowerQuery = query.toLowerCase();
      return Promise.resolve(
        mockSuppliers.filter(s => 
          s.name.toLowerCase().includes(lowerQuery) ||
          s.code.toLowerCase().includes(lowerQuery)
        )
      );
    }
    return apiClient.get<Supplier[]>(`/suppliers/search?q=${encodeURIComponent(query)}`);
  }
}

export const supplierService = new SupplierService();
