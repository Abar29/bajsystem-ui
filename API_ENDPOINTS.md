# BAJ System - REST API Endpoint Specification

This document defines the expected REST API endpoints that the Spring Boot backend should implement.

## Base URL

```
http://localhost:8080/api/v1
```

## Authentication

All endpoints (except auth) require JWT token in header:
```
Authorization: Bearer {token}
```

---

## 📊 Dashboard Endpoints

### Get Dashboard Statistics
```
GET /dashboard/stats
```
**Response:**
```json
{
  "pendingApprovals": 8,
  "lowStockItems": 15,
  "expiringItems": 5,
  "pendingDeliveries": 12,
  "activeOrders": 23,
  "totalSuppliers": 45,
  "totalItems": 1247,
  "warehouseCapacity": 75
}
```

### Get Recent Activities
```
GET /dashboard/activities?limit=10
```
**Response:** Array of Activity objects

### Get Alerts
```
GET /dashboard/alerts?unreadOnly=true
```
**Response:** Array of Alert objects

### Mark Alert as Read
```
PATCH /dashboard/alerts/{alertId}/read
```

---

## 🏢 Supplier Endpoints

### Get All Suppliers
```
GET /suppliers
```

### Get Supplier by ID
```
GET /suppliers/{id}
```

### Create Supplier
```
POST /suppliers
Content-Type: application/json

{
  "code": "SUP-001",
  "name": "ABC Medical Supplies",
  "contactPerson": "John Doe",
  "email": "john@abc.com",
  "phone": "+1-555-0101",
  "address": "123 Main St",
  "taxId": "TAX-001",
  "status": "active"
}
```

### Update Supplier
```
PUT /suppliers/{id}
Content-Type: application/json

{
  "name": "ABC Medical Supplies Inc.",
  "status": "inactive"
}
```

### Delete Supplier
```
DELETE /suppliers/{id}
```

### Search Suppliers
```
GET /suppliers/search?q={query}
```

---

## 🏥 Agency Endpoints

### Get All Agencies
```
GET /agencies
```

### Get Agency by ID
```
GET /agencies/{id}
```

### Create Agency
```
POST /agencies
```

### Update Agency
```
PUT /agencies/{id}
```

### Delete Agency
```
DELETE /agencies/{id}
```

---

## 📦 Item/Product Endpoints

### Get All Items
```
GET /inventory/items
```

### Get Item by ID
```
GET /inventory/items/{id}
```

### Create Item
```
POST /inventory/items
Content-Type: application/json

{
  "code": "MED-001",
  "name": "Paracetamol 500mg",
  "description": "Pain reliever",
  "category": "Medication",
  "unit": "Box",
  "minStock": 100,
  "maxStock": 1000,
  "reorderPoint": 200,
  "status": "active"
}
```

### Update Item
```
PUT /inventory/items/{id}
```

### Delete Item
```
DELETE /inventory/items/{id}
```

---

## 🏭 Warehouse Endpoints

### Get All Warehouses
```
GET /warehouses
```

### Get Warehouse by ID
```
GET /warehouses/{id}
```

### Create Warehouse
```
POST /warehouses
```

### Update Warehouse
```
PUT /warehouses/{id}
```

---

## 📊 Inventory Stock Endpoints

### Get All Stock Items
```
GET /inventory/stock
```

### Get Stock Item by ID
```
GET /inventory/stock/{id}
```

### Get Low Stock Items
```
GET /inventory/stock/low-stock
```

### Get Stock by Warehouse
```
GET /inventory/stock?warehouseId={id}
```

### Get Stock by Item
```
GET /inventory/stock?itemId={id}
```

---

## 🏷️ Stock Batch Endpoints

### Get All Batches
```
GET /inventory/batches
```

### Get Batch by ID
```
GET /inventory/batches/{id}
```

### Get Expiring Batches
```
GET /inventory/batches/expiring?days=30
```

### Get Batches by Item
```
GET /inventory/batches?itemId={id}
```

---

## 🔄 Stock Movement Endpoints

### Get All Movements
```
GET /inventory/movements
```

### Get Movement by ID
```
GET /inventory/movements/{id}
```

### Create Movement
```
POST /inventory/movements
Content-Type: application/json

{
  "movementDate": "2024-06-22T10:00:00Z",
  "type": "transfer",
  "itemId": "item-1",
  "fromWarehouse": "wh-1",
  "toWarehouse": "wh-2",
  "quantity": 100,
  "referenceNumber": "TRF-001",
  "performedBy": "user-1",
  "notes": "Regular transfer"
}
```

---

## 📝 Purchase Request Endpoints

### Get All Purchase Requests
```
GET /purchase-requests
```

### Get PR by ID
```
GET /purchase-requests/{id}
```

### Create Purchase Request
```
POST /purchase-requests
```

### Update Purchase Request
```
PUT /purchase-requests/{id}
```

### Approve/Reject Purchase Request
```
PATCH /purchase-requests/{id}/status
Content-Type: application/json

{
  "status": "approved",
  "approvedBy": "user-1",
  "notes": "Approved for procurement"
}
```

---

## 💰 Quotation Endpoints

### Get All Quotations
```
GET /quotations
```

### Get Quotation by ID
```
GET /quotations/{id}
```

### Create Quotation
```
POST /quotations
```

### Update Quotation
```
PUT /quotations/{id}
```

### Accept/Reject Quotation
```
PATCH /quotations/{id}/status
Content-Type: application/json

{
  "status": "accepted"
}
```

---

## 🛒 Purchase Order Endpoints

### Get All Purchase Orders
```
GET /purchase-orders
```

### Get PO by ID
```
GET /purchase-orders/{id}
```

### Create Purchase Order
```
POST /purchase-orders
Content-Type: application/json

{
  "poDate": "2024-06-22T00:00:00Z",
  "supplierId": "sup-1",
  "quotationId": "quot-1",
  "deliveryDate": "2024-07-01T00:00:00Z",
  "deliveryAddress": "Main Warehouse",
  "items": [
    {
      "itemId": "item-1",
      "quantity": 500,
      "unitPrice": 25.50
    }
  ],
  "paymentTerms": "Net 30 days",
  "notes": "Urgent delivery"
}
```

### Update Purchase Order
```
PUT /purchase-orders/{id}
```

### Cancel Purchase Order
```
PATCH /purchase-orders/{id}/cancel
```

### Update PO Status
```
PATCH /purchase-orders/{id}/status
Content-Type: application/json

{
  "status": "confirmed"
}
```

---

## 📥 Receiving Endpoints

### Get All Receiving Records
```
GET /inventory/receiving
```

### Get Receiving by ID
```
GET /inventory/receiving/{id}
```

### Create Receiving Record
```
POST /inventory/receiving
Content-Type: application/json

{
  "receiveDate": "2024-06-22T10:00:00Z",
  "poNumber": "PO-2024-0156",
  "supplierId": "sup-1",
  "warehouseId": "wh-1",
  "items": [
    {
      "itemId": "item-1",
      "orderedQuantity": 500,
      "receivedQuantity": 500,
      "batchNumber": "BATCH-2024-001",
      "expiryDate": "2026-06-01T00:00:00Z",
      "condition": "good"
    }
  ],
  "receivedBy": "user-1"
}
```

---

## 🚚 Transfer Endpoints

### Get All Transfers
```
GET /inventory/transfers
```

### Get Transfer by ID
```
GET /inventory/transfers/{id}
```

### Create Transfer
```
POST /inventory/transfers
```

### Update Transfer Status
```
PATCH /inventory/transfers/{id}/status
Content-Type: application/json

{
  "status": "completed"
}
```

---

## 🚚 Delivery Order Endpoints

### Get All Deliveries
```
GET /deliveries
```

### Get Delivery by ID
```
GET /deliveries/{id}
```

### Get Pending Deliveries
```
GET /deliveries?status=pending
```

### Create Delivery Order
```
POST /deliveries
Content-Type: application/json

{
  "deliveryDate": "2024-06-23T00:00:00Z",
  "agencyId": "ag-1",
  "destinationAddress": "100 Health Ave",
  "items": [
    {
      "itemId": "item-1",
      "quantity": 100,
      "batchNumbers": ["BATCH-2024-001"]
    }
  ],
  "driver": "Mike Thompson",
  "vehicle": "TRUCK-001"
}
```

### Update Delivery
```
PUT /deliveries/{id}
```

### Update Delivery Status
```
PATCH /deliveries/{id}/status
Content-Type: application/json

{
  "status": "in_transit"
}
```

---

## ✅ Acknowledgement Endpoints

### Get All Acknowledgements
```
GET /deliveries/acknowledgements
```

### Create Acknowledgement
```
POST /deliveries/acknowledgements
```

### Update Acknowledgement
```
PUT /deliveries/acknowledgements/{id}
```

---

## 📦 Boxing Endpoints

### Get Boxing Records
```
GET /deliveries/boxing
```

### Create Boxing Record
```
POST /deliveries/boxing
```

---

## ✈️ Shipment Endpoints

### Get All Shipments
```
GET /deliveries/shipments
```

### Track Shipment
```
GET /deliveries/shipments/{id}/track
```

### Update Shipment Status
```
PATCH /deliveries/shipments/{id}/status
```

---

## ↩️ Return/Recall Endpoints

### Get All Returns
```
GET /deliveries/returns
```

### Create Return
```
POST /deliveries/returns
```

### Process Return
```
PATCH /deliveries/returns/{id}/process
```

---

## 📄 Document Endpoints

### Get All Documents
```
GET /documents
```

### Get Document by ID
```
GET /documents/{id}
```

### Upload Document
```
POST /documents/upload
Content-Type: multipart/form-data

file: [binary]
title: "Invoice 2024-001"
documentType: "Invoice"
documentGroup: "Purchasing"
relatedEntity: "PurchaseOrder"
relatedEntityId: "po-1"
```

### Update Document Status
```
PATCH /documents/{id}/status
Content-Type: application/json

{
  "status": "approved",
  "reviewedBy": "user-1"
}
```

### Search Documents
```
GET /documents/search?q={query}
```

### Download Document
```
GET /documents/{id}/download
```

---

## 👥 User Management Endpoints

### Get All Users
```
GET /users
```

### Get User by ID
```
GET /users/{id}
```

### Create User
```
POST /users
```

### Update User
```
PUT /users/{id}
```

### Deactivate User
```
PATCH /users/{id}/deactivate
```

---

## 🔐 Role & Permission Endpoints

### Get All Roles
```
GET /roles
```

### Get Role by ID
```
GET /roles/{id}
```

### Create Role
```
POST /roles
```

### Update Role Permissions
```
PUT /roles/{id}/permissions
```

---

## 📋 Audit Log Endpoints

### Get Audit Logs
```
GET /audit-logs?page=1&limit=50
```

### Get Audit Logs by User
```
GET /audit-logs?userId={id}
```

### Get Audit Logs by Entity
```
GET /audit-logs?entity={entityType}&entityId={id}
```

---

## 🔑 Authentication Endpoints

### Login
```
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password"
}
```
**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-1",
    "username": "admin",
    "email": "admin@bajsystem.com",
    "fullName": "Administrator",
    "role": "Administrator"
  }
}
```

### Refresh Token
```
POST /auth/refresh
Authorization: Bearer {oldToken}
```

### Logout
```
POST /auth/logout
Authorization: Bearer {token}
```

---

## 📝 Response Format Standards

### Success Response
```json
{
  "data": { /* resource object */ },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested resource was not found",
    "details": {}
  }
}
```

### Validation Error
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "email": ["Invalid email format"],
      "quantity": ["Must be greater than 0"]
    }
  }
}
```

---

## 🔢 Status Codes

- `200` - OK (GET, PUT, PATCH success)
- `201` - Created (POST success)
- `204` - No Content (DELETE success)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error (server error)

---

## 📅 Date Format

All dates should be in ISO 8601 format:
```
2024-06-22T10:30:00Z
```

---

## 🔄 Pagination

For list endpoints that support pagination:
```
GET /resource?page=1&limit=50&sortBy=createdAt&sortOrder=desc
```

**Response:**
```json
{
  "data": [ /* array of items */ ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 234,
    "totalPages": 5
  }
}
```

---

**This specification matches the TypeScript types defined in:**  
`resources/js/types/index.ts`

**All service implementations are in:**  
`resources/js/api/services/`
