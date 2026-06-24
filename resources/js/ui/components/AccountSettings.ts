import { modal } from './Modal';

// Current user data (mock)
let currentUser = {
  id: 'user-1',
  username: 'admin',
  email: 'admin@bajsystem.com',
  fullName: 'System Administrator',
  role: 'Administrator',
  phone: '+1-555-0100',
  department: 'IT',
  avatar: 'A',
};

export function initializeAccountMenu(): void {
  // Header Admin Menu
  const headerAdminToggle = document.getElementById('header-admin-toggle');
  const headerAdminDropdown = document.getElementById('header-admin-dropdown');
  const headerAccountSettings = document.getElementById('header-account-settings');
  const headerChangeAccount = document.getElementById('header-change-account');
  const headerLogout = document.getElementById('header-logout');

  // Toggle dropdown in header
  headerAdminToggle?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    headerAdminToggle.classList.toggle('active');
    headerAdminDropdown?.classList.toggle('open');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!headerAdminToggle?.contains(e.target as Node) && !headerAdminDropdown?.contains(e.target as Node)) {
      headerAdminToggle?.classList.remove('active');
      headerAdminDropdown?.classList.remove('open');
    }
  });

  // Account Settings (Header)
  headerAccountSettings?.addEventListener('click', (e) => {
    e.preventDefault();
    showAccountSettings();
    headerAdminToggle?.classList.remove('active');
    headerAdminDropdown?.classList.remove('open');
  });

  // Change Account (Header)
  headerChangeAccount?.addEventListener('click', (e) => {
    e.preventDefault();
    showChangeAccount();
    headerAdminToggle?.classList.remove('active');
    headerAdminDropdown?.classList.remove('open');
  });

  // Logout (Header)
  headerLogout?.addEventListener('click', (e) => {
    e.preventDefault();
    handleLogout();
    headerAdminToggle?.classList.remove('active');
    headerAdminDropdown?.classList.remove('open');
  });

  // Legacy sidebar support (if still exists)
  const adminToggle = document.getElementById('admin-menu-toggle');
  const adminDropdown = document.getElementById('admin-dropdown');
  const accountSettingsBtn = document.getElementById('account-settings');
  const changeAccountBtn = document.getElementById('change-account');
  const logoutBtn = document.getElementById('logout');

  if (adminToggle && adminDropdown) {
    adminToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      adminToggle.classList.toggle('active');
      adminDropdown?.classList.toggle('open');
    });

    accountSettingsBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      showAccountSettings();
      adminToggle?.classList.remove('active');
      adminDropdown?.classList.remove('open');
    });

    changeAccountBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      showChangeAccount();
      adminToggle?.classList.remove('active');
      adminDropdown?.classList.remove('open');
    });

    logoutBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      handleLogout();
      adminToggle?.classList.remove('active');
      adminDropdown?.classList.remove('open');
    });
  }
}

function showAccountSettings(): void {
  const content = `
    <div class="account-settings">
      <div class="profile-header" style="text-align: center; margin-bottom: 2rem;">
        <div class="profile-avatar" style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%); color: white; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 700; margin: 0 auto 1rem;">
          ${currentUser.avatar}
        </div>
        <h3 style="margin: 0 0 0.5rem 0; font-size: 1.5rem; font-weight: 600;">${currentUser.fullName}</h3>
        <p style="margin: 0; color: #64748b;">@${currentUser.username}</p>
      </div>

      <div class="modal-details">
        <div class="modal-form-row">
          <div class="modal-form-group">
            <label class="modal-form-label">Username</label>
            <p>${currentUser.username}</p>
          </div>
          <div class="modal-form-group">
            <label class="modal-form-label">Role</label>
            <p><span class="badge badge-success">${currentUser.role}</span></p>
          </div>
        </div>

        <div class="modal-form-group">
          <label class="modal-form-label">Full Name</label>
          <p>${currentUser.fullName}</p>
        </div>

        <div class="modal-form-row">
          <div class="modal-form-group">
            <label class="modal-form-label">Email</label>
            <p>${currentUser.email}</p>
          </div>
          <div class="modal-form-group">
            <label class="modal-form-label">Phone</label>
            <p>${currentUser.phone}</p>
          </div>
        </div>

        <div class="modal-form-group">
          <label class="modal-form-label">Department</label>
          <p>${currentUser.department}</p>
        </div>
      </div>

      <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 2px solid #f1f5f9; display: flex; gap: 1rem;">
        <button class="btn btn-primary" id="edit-profile-btn" style="flex: 1;">
          <span>✏️</span>
          Edit Profile
        </button>
        <button class="btn btn-outline" id="change-password-btn" style="flex: 1;">
          <span>🔒</span>
          Change Password
        </button>
      </div>
    </div>
  `;

  modal.open({
    title: 'Account Settings',
    content,
    size: 'lg',
    type: 'view',
    showFooter: false,
  });

  // Add event listeners after modal is rendered
  setTimeout(() => {
    document.getElementById('edit-profile-btn')?.addEventListener('click', () => {
      modal.close();
      showEditProfile();
    });

    document.getElementById('change-password-btn')?.addEventListener('click', () => {
      modal.close();
      showChangePassword();
    });
  }, 100);
}

function showEditProfile(): void {
  const content = `
    <form id="edit-profile-form">
      <div class="modal-form-group">
        <label class="modal-form-label">Username</label>
        <input type="text" class="form-input" name="username" value="${currentUser.username}" disabled style="background: #f1f5f9; cursor: not-allowed;">
        <small style="color: #64748b; font-size: 0.875rem;">Username cannot be changed</small>
      </div>

      <div class="modal-form-group">
        <label class="modal-form-label">Full Name *</label>
        <input type="text" class="form-input" name="fullName" value="${currentUser.fullName}" required>
      </div>

      <div class="modal-form-row">
        <div class="modal-form-group">
          <label class="modal-form-label">Email *</label>
          <input type="email" class="form-input" name="email" value="${currentUser.email}" required>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Phone *</label>
          <input type="tel" class="form-input" name="phone" value="${currentUser.phone}" required>
        </div>
      </div>

      <div class="modal-form-group">
        <label class="modal-form-label">Department *</label>
        <input type="text" class="form-input" name="department" value="${currentUser.department}" required>
      </div>
    </form>
  `;

  modal.form('Edit Profile', content, async () => {
    const form = document.getElementById('edit-profile-form') as HTMLFormElement;
    if (form.checkValidity()) {
      const formData = new FormData(form);
      
      // Update current user data
      currentUser = {
        ...currentUser,
        fullName: formData.get('fullName') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        department: formData.get('department') as string,
      };

      // Show success message
      modal.confirm('Success', 'Your profile has been updated successfully!', () => {
        showAccountSettings();
      });
    } else {
      form.reportValidity();
    }
  }, 'edit');
}

function showChangePassword(): void {
  const content = `
    <form id="change-password-form">
      <div class="modal-form-group">
        <label class="modal-form-label">Current Password *</label>
        <input type="password" class="form-input" name="currentPassword" required>
      </div>

      <div class="modal-form-group">
        <label class="modal-form-label">New Password *</label>
        <input type="password" class="form-input" name="newPassword" minlength="8" required>
        <small style="color: #64748b; font-size: 0.875rem;">Minimum 8 characters</small>
      </div>

      <div class="modal-form-group">
        <label class="modal-form-label">Confirm New Password *</label>
        <input type="password" class="form-input" name="confirmPassword" minlength="8" required>
      </div>
    </form>
  `;

  modal.form('Change Password', content, async () => {
    const form = document.getElementById('change-password-form') as HTMLFormElement;
    if (form.checkValidity()) {
      const formData = new FormData(form);
      const newPassword = formData.get('newPassword');
      const confirmPassword = formData.get('confirmPassword');

      if (newPassword !== confirmPassword) {
        alert('Passwords do not match!');
        return;
      }

      // Mock password change
      modal.confirm('Success', 'Your password has been changed successfully!', () => {
        // Close modal
      });
    } else {
      form.reportValidity();
    }
  }, 'edit');
}

function showChangeAccount(): void {
  modal.confirm(
    'Change Account',
    'This will log you out and allow you to sign in with a different account. Continue?',
    () => {
      // Mock account change - would redirect to login
      alert('Redirecting to login page...');
      window.location.reload();
    }
  );
}

function handleLogout(): void {
  modal.confirm(
    'Logout',
    'Are you sure you want to logout?',
    () => {
      // Mock logout - would clear session and redirect
      alert('Logging out...');
      localStorage.clear();
      window.location.reload();
    }
  );
}

export function getCurrentUser() {
  return currentUser;
}

export function updateCurrentUser(updates: Partial<typeof currentUser>) {
  currentUser = { ...currentUser, ...updates };
}
