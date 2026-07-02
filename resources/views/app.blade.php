<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'BAJ | Pharmaceuticals') }}</title>
    
    @vite(['resources/css/app.css', 'resources/js/app.ts'])
</head>
<body>
    <div class="app-container">
        <!-- Sidebar -->
        <aside id="sidebar" class="sidebar">
            <!-- Logo at the top of sidebar -->
            <div class="sidebar-header">
                <img src="{{ asset('image/bajlogo2.png') }}" alt="BAJ Logo" class="sidebar-logo sidebar-logo-expanded">
                <img src="{{ asset('image/baj-icon-modern.svg') }}" alt="BAJ Icon" class="sidebar-logo sidebar-logo-collapsed">
            </div>
            
            <nav class="sidebar-nav">
                <div class="nav-section">
                    <div class="nav-section-title">Main</div>
                    <a href="#" class="nav-item active" data-page="dashboard" data-tooltip="Dashboard">
                        <span class="nav-icon">📊</span>
                        <span>Dashboard</span>
                    </a>
                </div>

                <div class="nav-section">
                    <div class="nav-section-title">Master Data</div>
                    <a href="#" class="nav-item" data-page="suppliers" data-tooltip="Suppliers">
                        <span class="nav-icon">🏢</span>
                        <span>Suppliers</span>
                    </a>
                    <a href="#" class="nav-item" data-page="agencies" data-tooltip="Agencies">
                        <span class="nav-icon">🏥</span>
                        <span>Agencies</span>
                    </a>
                    <a href="#" class="nav-item" data-page="items" data-tooltip="Items">
                        <span class="nav-icon">📦</span>
                        <span>Items</span>
                    </a>
                    <a href="#" class="nav-item" data-page="warehouses" data-tooltip="Warehouses">
                        <span class="nav-icon">🏭</span>
                        <span>Warehouses</span>
                    </a>
                    <a href="#" class="nav-item" data-page="branches" data-tooltip="Branches">
                        <span class="nav-icon">🏪</span>
                        <span>Branches</span>
                    </a>
                </div>

                <div class="nav-section">
                    <div class="nav-section-title">Purchasing</div>
                    <a href="#" class="nav-item" data-page="purchase-requests" data-tooltip="Purchase Requests">
                        <span class="nav-icon">📝</span>
                        <span>Purchase Requests</span>
                    </a>
                    <a href="#" class="nav-item" data-page="quotations" data-tooltip="Quotations">
                        <span class="nav-icon">💰</span>
                        <span>Quotations</span>
                    </a>
                    <a href="#" class="nav-item" data-page="purchase-orders" data-tooltip="Purchase Orders">
                        <span class="nav-icon">🛒</span>
                        <span>Purchase Orders</span>
                    </a>
                </div>

                <div class="nav-section">
                    <div class="nav-section-title">Inventory</div>
                    <a href="#" class="nav-item" data-page="inventory" data-tooltip="Stock List">
                        <span class="nav-icon">📊</span>
                        <span>Stock List</span>
                    </a>
                    <a href="#" class="nav-item" data-page="stock-batches" data-tooltip="Stock Batches">
                        <span class="nav-icon">🏷️</span>
                        <span>Stock Batches</span>
                    </a>
                    <a href="#" class="nav-item" data-page="stock-movements" data-tooltip="Stock Movements">
                        <span class="nav-icon">🔄</span>
                        <span>Stock Movements</span>
                    </a>
                    <a href="#" class="nav-item" data-page="receiving" data-tooltip="Receiving">
                        <span class="nav-icon">📥</span>
                        <span>Receiving</span>
                    </a>
                    <a href="#" class="nav-item" data-page="transfers" data-tooltip="Transfers">
                        <span class="nav-icon">🚚</span>
                        <span>Transfers</span>
                    </a>
                </div>

                <div class="nav-section">
                    <div class="nav-section-title">Delivery</div>
                    <a href="#" class="nav-item" data-page="deliveries" data-tooltip="Delivery Orders">
                        <span class="nav-icon">🚚</span>
                        <span>Delivery Orders</span>
                    </a>
                    <a href="#" class="nav-item" data-page="acknowledgements" data-tooltip="Acknowledgements">
                        <span class="nav-icon">✅</span>
                        <span>Acknowledgements</span>
                    </a>
                    <a href="#" class="nav-item" data-page="boxing" data-tooltip="Boxing">
                        <span class="nav-icon">📦</span>
                        <span>Boxing</span>
                    </a>
                    <a href="#" class="nav-item" data-page="shipments" data-tooltip="Shipments">
                        <span class="nav-icon">✈️</span>
                        <span>Shipments</span>
                    </a>
                    <a href="#" class="nav-item" data-page="returns" data-tooltip="Returns/Recalls">
                        <span class="nav-icon">↩️</span>
                        <span>Returns/Recalls</span>
                    </a>
                </div>

                <div class="nav-section">
                    <div class="nav-section-title">Documents</div>
                    <a href="#" class="nav-item" data-page="documents" data-tooltip="Documents">
                        <span class="nav-icon">📄</span>
                        <span>Documents</span>
                    </a>
                </div>

                <div class="nav-section">
                    <div class="nav-section-title">Administration</div>
                    <a href="#" class="nav-item" data-page="users" data-tooltip="Users">
                        <span class="nav-icon">👥</span>
                        <span>Users</span>
                    </a>
                    <a href="#" class="nav-item" data-page="roles" data-tooltip="Roles & Permissions">
                        <span class="nav-icon">🔐</span>
                        <span>Roles & Permissions</span>
                    </a>
                    <a href="#" class="nav-item" data-page="audit-log" data-tooltip="Audit Log">
                        <span class="nav-icon">📋</span>
                        <span>Audit Log</span>
                    </a>
                </div>
            </nav>
            
            <!-- Fixed Footer -->
            <div class="sidebar-footer">
                <div class="sidebar-footer-content">
                    <div class="footer-text">
                        <span>© 2026 BAJ | Pharmaceuticals</span>
                        <span class="footer-version">v1.0.0</span>
                    </div>
                </div>
            </div>
        </aside>

        <!-- Sidebar Overlay for mobile -->
        <div id="sidebar-overlay" class="sidebar-overlay"></div>

        <!-- Main Content Area -->
        <div id="main-content" class="main-content">
            <!-- Header -->
            <header class="app-header">
                <div class="header-left">
                    <button id="burger-menu" class="burger-menu" aria-label="Toggle menu">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <path d="M3 12h18M3 6h18M3 18h18"></path>
                        </svg>
                    </button>
                    <h1 class="app-title">BAJ System</h1>
                </div>
                <div class="header-right">
                    <button id="dark-mode-toggle" class="dark-mode-toggle" aria-label="Toggle dark mode" title="Toggle dark mode">🌙</button>
                    
                    <!-- Admin Dropdown Menu -->
                    <div class="header-admin-menu">
                        <button class="header-admin-toggle" id="header-admin-toggle">
                            <div class="user-avatar">A</div>
                            <span class="admin-name">Admin</span>
                            <span class="admin-arrow">▼</span>
                        </button>
                        <div class="header-admin-dropdown" id="header-admin-dropdown">
                            <a href="#" class="header-dropdown-item" id="header-account-settings">
                                <span class="dropdown-icon">⚙️</span>
                                <span>Account Settings</span>
                            </a>
                            <a href="#" class="header-dropdown-item" id="header-change-account">
                                <span class="dropdown-icon">🔄</span>
                                <span>Change Account</span>
                            </a>
                            <div class="dropdown-divider"></div>
                            <a href="#" class="header-dropdown-item logout-item" id="header-logout" data-action="logout">
                                <span class="dropdown-icon">🚪</span>
                                <span>Logout</span>
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Content Wrapper -->
            <div id="content-wrapper" class="content-wrapper">
                <!-- Dynamic content will be loaded here -->
            </div>
        </div>
    </div>
</body>
</html>
