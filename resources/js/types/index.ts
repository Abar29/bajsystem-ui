// Common Types
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// User & Auth
export interface User extends BaseEntity {
  username: string;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
}

export interface Role {
  id: string;
  name: string;
  permissions: string[];
}

// Master Data
export interface Supplier extends BaseEntity {
  code: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  status: 'active' | 'inactive';
}

export interface Agency extends BaseEntity {
  code: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
}

export interface Item extends BaseEntity {
  code: string;
  name: string;
  description: string;
  category: string;
  unit: string;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  status: 'active' | 'inactive';
}

export interface Warehouse extends BaseEntity {
  code: string;
  name: string;
  location: string;
  capacity: number;
  manager: string;
  status: 'active' | 'inactive';
}

export interface Branch extends BaseEntity {
  code: string;
  name: string;
  address: string;
  phone: string;
  manager: string;
  status: 'active' | 'inactive';
}

export interface Unit {
  id: string;
  code: string;
  name: string;
  description: string;
}

// Purchasing
export interface PurchaseRequest extends BaseEntity {
  requestNumber: string;
  requestDate: string;
  requester: string;
  department: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'completed';
  items: PurchaseRequestItem[];
  notes?: string;
}

export interface PurchaseRequestItem {
  itemId: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  unit: string;
  requestedDate: string;
  purpose: string;
}

export interface QuotationRequest extends BaseEntity {
  requestNumber: string;
  requestDate: string;
  dueDate: string;
  purchaseRequestId: string;
  suppliers: string[];
  status: 'draft' | 'sent' | 'received' | 'completed';
  items: QuotationRequestItem[];
}

export interface QuotationRequestItem {
  itemId: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  unit: string;
  specifications: string;
}

export interface Quotation extends BaseEntity {
  quotationNumber: string;
  quotationDate: string;
  validUntil: string;
  supplierId: string;
  supplierName: string;
  quotationRequestId: string;
  status: 'draft' | 'submitted' | 'accepted' | 'rejected';
  items: QuotationItem[];
  totalAmount: number;
  notes?: string;
}

export interface QuotationItem {
  itemId: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  deliveryTime: string;
}

export interface PurchaseOrder extends BaseEntity {
  poNumber: string;
  poDate: string;
  supplierId: string;
  supplierName: string;
  quotationId: string;
  deliveryDate: string;
  deliveryAddress: string;
  status: 'draft' | 'sent' | 'confirmed' | 'partially_received' | 'received' | 'cancelled';
  items: PurchaseOrderItem[];
  subtotal: number;
  tax: number;
  totalAmount: number;
  paymentTerms: string;
  notes?: string;
}

export interface PurchaseOrderItem {
  itemId: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  receivedQuantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
}

// Inventory
export interface StockItem extends BaseEntity {
  itemId: string;
  itemCode: string;
  itemName: string;
  warehouseId: string;
  warehouseName: string;
  quantityOnHand: number;
  quantityReserved: number;
  quantityAvailable: number;
  unit: string;
  lastMovementDate: string;
}

export interface StockBatch extends BaseEntity {
  batchNumber: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  warehouseId: string;
  quantity: number;
  unit: string;
  receivedDate: string;
  expiryDate?: string;
  poNumber: string;
  status: 'active' | 'expired' | 'depleted';
}

export interface StockMovement extends BaseEntity {
  movementNumber: string;
  movementDate: string;
  type: 'receive' | 'issue' | 'transfer' | 'adjustment' | 'return';
  itemId: string;
  itemCode: string;
  itemName: string;
  fromWarehouse?: string;
  toWarehouse?: string;
  quantity: number;
  unit: string;
  referenceNumber: string;
  performedBy: string;
  notes?: string;
}

export interface StockReceiving extends BaseEntity {
  receiveNumber: string;
  receiveDate: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  warehouseId: string;
  warehouseName: string;
  status: 'draft' | 'completed' | 'cancelled';
  items: ReceivingItem[];
  receivedBy: string;
  notes?: string;
}

export interface ReceivingItem {
  itemId: string;
  itemCode: string;
  itemName: string;
  orderedQuantity: number;
  receivedQuantity: number;
  unit: string;
  batchNumber?: string;
  expiryDate?: string;
  condition: 'good' | 'damaged' | 'expired';
}

export interface StockTransfer extends BaseEntity {
  transferNumber: string;
  transferDate: string;
  fromWarehouseId: string;
  fromWarehouseName: string;
  toWarehouseId: string;
  toWarehouseName: string;
  status: 'draft' | 'in_transit' | 'completed' | 'cancelled';
  items: TransferItem[];
  requestedBy: string;
  notes?: string;
}

export interface TransferItem {
  itemId: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  unit: string;
}

// Delivery
export interface DeliveryOrder extends BaseEntity {
  deliveryNumber: string;
  deliveryDate: string;
  agencyId: string;
  agencyName: string;
  destinationAddress: string;
  status: 'draft' | 'scheduled' | 'in_transit' | 'delivered' | 'cancelled';
  items: DeliveryOrderItem[];
  driver: string;
  vehicle: string;
  notes?: string;
}

export interface DeliveryOrderItem {
  itemId: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  deliveredQuantity: number;
  unit: string;
  batchNumbers: string[];
}

export interface AcknowledgementReceipt extends BaseEntity {
  receiptNumber: string;
  receiptDate: string;
  deliveryOrderId: string;
  deliveryNumber: string;
  agencyId: string;
  agencyName: string;
  receivedBy: string;
  receivedDate: string;
  status: 'pending' | 'acknowledged' | 'disputed';
  items: AcknowledgementItem[];
  signature?: string;
  notes?: string;
}

export interface AcknowledgementItem {
  itemId: string;
  itemCode: string;
  itemName: string;
  deliveredQuantity: number;
  receivedQuantity: number;
  unit: string;
  condition: 'good' | 'damaged' | 'shortage';
  remarks?: string;
}

export interface BoxingRecord extends BaseEntity {
  boxingNumber: string;
  boxingDate: string;
  deliveryOrderId: string;
  warehouseId: string;
  status: 'in_progress' | 'completed';
  boxes: Box[];
  packedBy: string;
}

export interface Box {
  boxNumber: string;
  items: BoxItem[];
  weight: number;
  dimensions: string;
}

export interface BoxItem {
  itemId: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  batchNumber: string;
}

export interface Shipment extends BaseEntity {
  shipmentNumber: string;
  shipmentDate: string;
  deliveryOrderId: string;
  carrier: string;
  trackingNumber: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'returned';
  estimatedDelivery: string;
  actualDelivery?: string;
}

export interface ReturnRecord extends BaseEntity {
  returnNumber: string;
  returnDate: string;
  type: 'return' | 'recall';
  deliveryOrderId?: string;
  agencyId: string;
  agencyName: string;
  reason: string;
  status: 'pending' | 'in_transit' | 'received' | 'completed';
  items: ReturnItem[];
  requestedBy: string;
  notes?: string;
}

export interface ReturnItem {
  itemId: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  batchNumber: string;
  condition: 'good' | 'damaged' | 'expired';
  action: 'restock' | 'dispose' | 'investigate';
}

// Documents
export interface Document extends BaseEntity {
  documentNumber: string;
  title: string;
  documentType: string;
  documentGroup: string;
  uploadDate: string;
  uploadedBy: string;
  fileSize: number;
  fileName: string;
  fileUrl: string;
  status: 'draft' | 'under_review' | 'approved' | 'rejected' | 'archived';
  reviewedBy?: string;
  reviewDate?: string;
  version: string;
  tags: string[];
  relatedEntity?: string;
  relatedEntityId?: string;
  notes?: string;
}

export interface DocumentGroup {
  id: string;
  code: string;
  name: string;
  description: string;
}

export interface DocumentType {
  id: string;
  code: string;
  name: string;
  groupId: string;
  requiresApproval: boolean;
}

// Administration
export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  username: string;
  action: string;
  entity: string;
  entityId: string;
  changes: Record<string, unknown>;
  ipAddress: string;
}

// Dashboard
export interface DashboardStats {
  pendingApprovals: number;
  lowStockItems: number;
  expiringItems: number;
  pendingDeliveries: number;
  activeOrders: number;
  totalSuppliers: number;
  totalItems: number;
  warehouseCapacity: number;
}

export interface RecentActivity {
  id: string;
  timestamp: string;
  type: string;
  title: string;
  description: string;
  user: string;
  status?: string;
}

export interface Alert {
  id: string;
  type: 'stock' | 'expiry' | 'delivery' | 'approval';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}
