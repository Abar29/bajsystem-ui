import { apiClient } from '../client';
import type { Document } from '../../types';
import { mockDocuments } from '../../mock/data';

export class DocumentService {
  // Get all documents
  async getAll(): Promise<Document[]> {
    if (apiClient.isMockMode()) {
      return Promise.resolve(mockDocuments);
    }
    return apiClient.get<Document[]>('/documents');
  }

  // Get document by ID
  async getById(id: string): Promise<Document> {
    if (apiClient.isMockMode()) {
      const doc = mockDocuments.find(d => d.id === id);
      if (!doc) throw new Error('Document not found');
      return Promise.resolve(doc);
    }
    return apiClient.get<Document>(`/documents/${id}`);
  }

  // Upload document (placeholder - actual file upload would be different)
  async upload(document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>): Promise<Document> {
    if (apiClient.isMockMode()) {
      const newDoc: Document = {
        ...document,
        id: `doc-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockDocuments.push(newDoc);
      return Promise.resolve(newDoc);
    }
    return apiClient.post<Document>('/documents/upload', document);
  }

  // Update document status
  async updateStatus(id: string, status: Document['status']): Promise<Document> {
    if (apiClient.isMockMode()) {
      const index = mockDocuments.findIndex(d => d.id === id);
      if (index === -1) throw new Error('Document not found');
      mockDocuments[index] = { 
        ...mockDocuments[index]!, 
        status, 
        updatedAt: new Date().toISOString() 
      };
      return Promise.resolve(mockDocuments[index]!);
    }
    return apiClient.patch<Document>(`/documents/${id}/status`, { status });
  }

  // Search documents
  async search(query: string): Promise<Document[]> {
    if (apiClient.isMockMode()) {
      const lowerQuery = query.toLowerCase();
      return Promise.resolve(
        mockDocuments.filter(d => 
          d.title.toLowerCase().includes(lowerQuery) ||
          d.documentNumber.toLowerCase().includes(lowerQuery)
        )
      );
    }
    return apiClient.get<Document[]>(`/documents/search?q=${encodeURIComponent(query)}`);
  }
}

export const documentService = new DocumentService();
