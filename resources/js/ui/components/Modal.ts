// Modal Component System
import { Icons } from './Icons';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';
export type ModalType = 'view' | 'create' | 'edit' | 'confirm' | 'delete';

export interface ModalOptions {
  title: string;
  content: string;
  size?: ModalSize;
  type?: ModalType;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  showFooter?: boolean;
}

class ModalManager {
  private modalContainer: HTMLElement | null = null;

  constructor() {
    this.createModalContainer();
  }

  private createModalContainer(): void {
    if (!this.modalContainer) {
      this.modalContainer = document.createElement('div');
      this.modalContainer.id = 'modal-root';
      document.body.appendChild(this.modalContainer);
    }
  }

  private getSizeClass(size: ModalSize): string {
    const sizes = {
      sm: 'max-w-md',
      md: 'max-w-2xl',
      lg: 'max-w-4xl',
      xl: 'max-w-6xl',
    };
    return sizes[size] || sizes.md;
  }

  private getTypeIcon(type: ModalType): string {
    const icons = {
      view: Icons.view,
      create: Icons.add,
      edit: Icons.edit,
      confirm: Icons.info,
      delete: Icons.delete,
    };
    return icons[type] || '';
  }

  open(options: ModalOptions): void {
    const {
      title,
      content,
      size = 'md',
      type = 'view',
      confirmText = 'Confirm',
      cancelText = 'Cancel',
      onConfirm,
      onCancel,
      showFooter = true,
    } = options;

    const icon = this.getTypeIcon(type);
    const sizeClass = this.getSizeClass(size);
    const isDangerous = type === 'delete';

    const modalHTML = `
      <div class="modal-overlay" id="modal-overlay">
        <div class="modal-container ${sizeClass}">
          <div class="modal-header">
            <h2 class="modal-title">
              ${icon ? `<span class="modal-icon">${icon}</span>` : ''}
              ${title}
            </h2>
            <button class="modal-close" id="modal-close" aria-label="Close">${Icons.close}</button>
          </div>
          <div class="modal-body">
            ${content}
          </div>
          ${showFooter ? `
            <div class="modal-footer">
              <button class="btn btn-secondary" id="modal-cancel">${cancelText}</button>
              ${onConfirm ? `<button class="btn ${isDangerous ? 'btn-danger' : 'btn-primary'}" id="modal-confirm">${confirmText}</button>` : ''}
            </div>
          ` : ''}
        </div>
      </div>
    `;

    if (this.modalContainer) {
      this.modalContainer.innerHTML = modalHTML;
      document.body.style.overflow = 'hidden';

      // Event listeners
      const overlay = document.getElementById('modal-overlay');
      const closeBtn = document.getElementById('modal-close');
      const cancelBtn = document.getElementById('modal-cancel');
      const confirmBtn = document.getElementById('modal-confirm');

      const closeModal = () => {
        this.close();
        if (onCancel) onCancel();
      };

      const handleConfirm = async () => {
        if (onConfirm) {
          const result = onConfirm();
          if (result instanceof Promise) {
            confirmBtn?.setAttribute('disabled', 'true');
            confirmBtn!.textContent = 'Processing...';
            await result;
          }
        }
        this.close();
      };

      overlay?.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
      });
      closeBtn?.addEventListener('click', closeModal);
      cancelBtn?.addEventListener('click', closeModal);
      confirmBtn?.addEventListener('click', handleConfirm);

      // ESC key to close
      const escHandler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeModal();
          document.removeEventListener('keydown', escHandler);
        }
      };
      document.addEventListener('keydown', escHandler);
    }
  }

  close(): void {
    if (this.modalContainer) {
      this.modalContainer.innerHTML = '';
      document.body.style.overflow = '';
    }
  }

  // Helper methods for common modal types
  view(title: string, content: string, size: ModalSize = 'lg'): void {
    this.open({
      title,
      content,
      size,
      type: 'view',
      showFooter: false,
    });
  }

  confirm(title: string, message: string, onConfirm: () => void | Promise<void>): void {
    this.open({
      title,
      content: `<p class="modal-message">${message}</p>`,
      size: 'sm',
      type: 'confirm',
      confirmText: 'Confirm',
      onConfirm,
    });
  }

  delete(title: string, message: string, onConfirm: () => void | Promise<void>): void {
    this.open({
      title,
      content: `<p class="modal-message modal-message-danger">${message}</p>`,
      size: 'sm',
      type: 'delete',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm,
    });
  }

  form(title: string, formContent: string, onSubmit: () => void | Promise<void>, type: 'create' | 'edit' = 'create'): void {
    this.open({
      title,
      content: formContent,
      size: 'lg',
      type,
      confirmText: type === 'create' ? 'Create' : 'Save',
      onConfirm: onSubmit,
    });
  }
}

export const modal = new ModalManager();
