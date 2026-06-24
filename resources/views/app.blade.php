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
            <!-- <div class="sidebar-header">
                <h2 class="sidebar-title">BAJ SYSTEM</h2>
            </div>
             -->
            <nav class="sidebar-nav">
                <div class="nav-section">
                    <div class="nav-section-title">Main</div>
                    <a href="#" class="nav-item active" data-page="dashboard">
                        <span class="nav-icon">📊</span>
                        <span>Dashboard</span>
                    </a>
                </div>

                <div class="nav-section">
                    <div class="nav-section-title">Master Data</div>
                    <a href="#" class="nav-item" data-page="suppliers">
                        <span class="nav-icon">🏢</span>
                        <span>Suppliers</span>
                    </a>
                    <a href="#" class="nav-item" data-page="agencies">
                        <span class="nav-icon">🏥</span>
                        <span>Agencies</span>
                    </a>
                    <a href="#" class="nav-item" data-page="items">
                        <span class="nav-icon">📦</span>
                        <span>Items</span>
                    </a>
                    <a href="#" class="nav-item" data-page="warehouses">
                        <span class="nav-icon">🏭</span>
                        <span>Warehouses</span>
                    </a>
                    <a href="#" class="nav-item" data-page="branches">
                        <span class="nav-icon">🏪</span>
                        <span>Branches</span>
                    </a>
                </div>

                <div class="nav-section">
                    <div class="nav-section-title">Purchasing</div>
                    <a href="#" class="nav-item" data-page="purchase-requests">
                        <span class="nav-icon">📝</span>
                        <span>Purchase Requests</span>
                    </a>
                    <a href="#" class="nav-item" data-page="quotations">
                        <span class="nav-icon">💰</span>
                        <span>Quotations</span>
                    </a>
                    <a href="#" class="nav-item" data-page="purchase-orders">
                        <span class="nav-icon">🛒</span>
                        <span>Purchase Orders</span>
                    </a>
                </div>

                <div class="nav-section">
                    <div class="nav-section-title">Inventory</div>
                    <a href="#" class="nav-item" data-page="inventory">
                        <span class="nav-icon">📊</span>
                        <span>Stock List</span>
                    </a>
                    <a href="#" class="nav-item" data-page="stock-batches">
                        <span class="nav-icon">🏷️</span>
                        <span>Stock Batches</span>
                    </a>
                    <a href="#" class="nav-item" data-page="stock-movements">
                        <span class="nav-icon">🔄</span>
                        <span>Stock Movements</span>
                    </a>
                    <a href="#" class="nav-item" data-page="receiving">
                        <span class="nav-icon">📥</span>
                        <span>Receiving</span>
                    </a>
                    <a href="#" class="nav-item" data-page="transfers">
                        <span class="nav-icon">🚚</span>
                        <span>Transfers</span>
                    </a>
                </div>

                <div class="nav-section">
                    <div class="nav-section-title">Delivery</div>
                    <a href="#" class="nav-item" data-page="deliveries">
                        <span class="nav-icon">🚚</span>
                        <span>Delivery Orders</span>
                    </a>
                    <a href="#" class="nav-item" data-page="acknowledgements">
                        <span class="nav-icon">✅</span>
                        <span>Acknowledgements</span>
                    </a>
                    <a href="#" class="nav-item" data-page="boxing">
                        <span class="nav-icon">📦</span>
                        <span>Boxing</span>
                    </a>
                    <a href="#" class="nav-item" data-page="shipments">
                        <span class="nav-icon">✈️</span>
                        <span>Shipments</span>
                    </a>
                    <a href="#" class="nav-item" data-page="returns">
                        <span class="nav-icon">↩️</span>
                        <span>Returns/Recalls</span>
                    </a>
                </div>

                <div class="nav-section">
                    <div class="nav-section-title">Documents</div>
                    <a href="#" class="nav-item" data-page="documents">
                        <span class="nav-icon">📄</span>
                        <span>Documents</span>
                    </a>
                </div>

                <div class="nav-section">
                    <div class="nav-section-title">Administration</div>
                    <a href="#" class="nav-item" data-page="users">
                        <span class="nav-icon">👥</span>
                        <span>Users</span>
                    </a>
                    <a href="#" class="nav-item" data-page="roles">
                        <span class="nav-icon">🔐</span>
                        <span>Roles & Permissions</span>
                    </a>
                    <a href="#" class="nav-item" data-page="audit-log">
                        <span class="nav-icon">📋</span>
                        <span>Audit Log</span>
                    </a>
                </div>
            </nav>
        </aside>

        <!-- Sidebar Overlay for mobile -->
        <div id="sidebar-overlay" class="sidebar-overlay"></div>

        <!-- Main Content Area -->
        <div id="main-content" class="main-content">
            <!-- Header -->
            <header class="app-header">
                <div class="header-left">
                    <button id="burger-menu" class="burger-menu" aria-label="Toggle menu">☰</button>
                    <img src="{{ asset('image/bajlogo2.png') }}" alt="BAJ Logo" class="header-logo">
                    <!-- <h1 class="app-title">BAJ System</h1> -->
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
