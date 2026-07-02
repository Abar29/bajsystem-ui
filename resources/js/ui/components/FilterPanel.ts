// Modern Filtering Component System
export interface FilterConfig {
  id: string;
  label: string;
  type: 'search' | 'select' | 'dateRange' | 'multiSelect' | 'range';
  placeholder?: string;
  options?: { value: string; label: string }[];
  defaultValue?: any;
}

export interface FilterValues {
  [key: string]: any;
}

export class FilterPanel {
  private filters: FilterConfig[];
  private onFilterChange: (values: FilterValues) => void;
  private currentValues: FilterValues = {};

  constructor(filters: FilterConfig[], onFilterChange: (values: FilterValues) => void) {
    this.filters = filters;
    this.onFilterChange = onFilterChange;
    this.initializeValues();
  }

  private initializeValues(): void {
    this.filters.forEach(filter => {
      if (filter.defaultValue !== undefined) {
        this.currentValues[filter.id] = filter.defaultValue;
      }
    });
  }

  render(): string {
    return `
      <div class="filter-panel">
        <div class="filter-header">
          <div class="filter-title">
            <svg class="filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 4h18M3 4v2l7 7v7l4 2v-9l7-7V4"></path>
            </svg>
            <span>Filters</span>
          </div>
          <button class="filter-clear" id="clear-filters">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            Clear
          </button>
        </div>
        <div class="filter-content">
          ${this.filters.map(filter => this.renderFilter(filter)).join('')}
        </div>
      </div>
    `;
  }

  private renderFilter(filter: FilterConfig): string {
    switch (filter.type) {
      case 'search':
        return this.renderSearchFilter(filter);
      case 'select':
        return this.renderSelectFilter(filter);
      case 'dateRange':
        return this.renderDateRangeFilter(filter);
      case 'multiSelect':
        return this.renderMultiSelectFilter(filter);
      case 'range':
        return this.renderRangeFilter(filter);
      default:
        return '';
    }
  }

  private renderSearchFilter(filter: FilterConfig): string {
    return `
      <div class="filter-group">
        <label class="filter-label">${filter.label}</label>
        <div class="filter-input-wrapper">
          <svg class="filter-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="M21 21l-4.35-4.35"></path>
          </svg>
          <input 
            type="text" 
            class="filter-input" 
            id="filter-${filter.id}"
            placeholder="${filter.placeholder || 'Search...'}"
            value="${this.currentValues[filter.id] || ''}"
          />
        </div>
      </div>
    `;
  }

  private renderSelectFilter(filter: FilterConfig): string {
    return `
      <div class="filter-group">
        <label class="filter-label">${filter.label}</label>
        <select class="filter-select" id="filter-${filter.id}">
          <option value="">All ${filter.label}</option>
          ${filter.options?.map(opt => `
            <option value="${opt.value}" ${this.currentValues[filter.id] === opt.value ? 'selected' : ''}>
              ${opt.label}
            </option>
          `).join('') || ''}
        </select>
      </div>
    `;
  }

  private renderDateRangeFilter(filter: FilterConfig): string {
    const values = this.currentValues[filter.id] || {};
    return `
      <div class="filter-group">
        <label class="filter-label">${filter.label}</label>
        <div class="filter-date-range">
          <input 
            type="date" 
            class="filter-input filter-date" 
            id="filter-${filter.id}-start"
            placeholder="Start date"
            value="${values.start || ''}"
          />
          <span class="filter-date-separator">to</span>
          <input 
            type="date" 
            class="filter-input filter-date" 
            id="filter-${filter.id}-end"
            placeholder="End date"
            value="${values.end || ''}"
          />
        </div>
      </div>
    `;
  }

  private renderMultiSelectFilter(filter: FilterConfig): string {
    const selectedValues = this.currentValues[filter.id] || [];
    return `
      <div class="filter-group">
        <label class="filter-label">${filter.label}</label>
        <div class="filter-multiselect" id="filter-${filter.id}">
          ${filter.options?.map(opt => `
            <label class="filter-checkbox">
              <input 
                type="checkbox" 
                value="${opt.value}"
                ${selectedValues.includes(opt.value) ? 'checked' : ''}
              />
              <span class="filter-checkbox-label">${opt.label}</span>
            </label>
          `).join('') || ''}
        </div>
      </div>
    `;
  }

  private renderRangeFilter(filter: FilterConfig): string {
    const values = this.currentValues[filter.id] || {};
    return `
      <div class="filter-group">
        <label class="filter-label">${filter.label}</label>
        <div class="filter-range">
          <input 
            type="number" 
            class="filter-input filter-range-input" 
            id="filter-${filter.id}-min"
            placeholder="Min"
            value="${values.min || ''}"
          />
          <span class="filter-range-separator">-</span>
          <input 
            type="number" 
            class="filter-input filter-range-input" 
            id="filter-${filter.id}-max"
            placeholder="Max"
            value="${values.max || ''}"
          />
        </div>
      </div>
    `;
  }

  setupEventListeners(): void {
    // Clear filters button
    document.getElementById('clear-filters')?.addEventListener('click', () => {
      this.clearFilters();
    });

    // Setup listeners for each filter type
    this.filters.forEach(filter => {
      switch (filter.type) {
        case 'search':
          this.setupSearchListener(filter);
          break;
        case 'select':
          this.setupSelectListener(filter);
          break;
        case 'dateRange':
          this.setupDateRangeListener(filter);
          break;
        case 'multiSelect':
          this.setupMultiSelectListener(filter);
          break;
        case 'range':
          this.setupRangeListener(filter);
          break;
      }
    });
  }

  private setupSearchListener(filter: FilterConfig): void {
    const input = document.getElementById(`filter-${filter.id}`) as HTMLInputElement;
    if (!input) return;

    let debounceTimer: number;
    input.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        this.currentValues[filter.id] = (e.target as HTMLInputElement).value;
        this.onFilterChange({ ...this.currentValues });
      }, 300);
    });
  }

  private setupSelectListener(filter: FilterConfig): void {
    const select = document.getElementById(`filter-${filter.id}`) as HTMLSelectElement;
    if (!select) return;

    select.addEventListener('change', (e) => {
      this.currentValues[filter.id] = (e.target as HTMLSelectElement).value;
      this.onFilterChange({ ...this.currentValues });
    });
  }

  private setupDateRangeListener(filter: FilterConfig): void {
    const startInput = document.getElementById(`filter-${filter.id}-start`) as HTMLInputElement;
    const endInput = document.getElementById(`filter-${filter.id}-end`) as HTMLInputElement;
    
    if (!startInput || !endInput) return;

    const updateDateRange = () => {
      this.currentValues[filter.id] = {
        start: startInput.value,
        end: endInput.value,
      };
      this.onFilterChange({ ...this.currentValues });
    };

    startInput.addEventListener('change', updateDateRange);
    endInput.addEventListener('change', updateDateRange);
  }

  private setupMultiSelectListener(filter: FilterConfig): void {
    const container = document.getElementById(`filter-${filter.id}`);
    if (!container) return;

    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        const selected: string[] = [];
        checkboxes.forEach(cb => {
          if ((cb as HTMLInputElement).checked) {
            selected.push((cb as HTMLInputElement).value);
          }
        });
        this.currentValues[filter.id] = selected;
        this.onFilterChange({ ...this.currentValues });
      });
    });
  }

  private setupRangeListener(filter: FilterConfig): void {
    const minInput = document.getElementById(`filter-${filter.id}-min`) as HTMLInputElement;
    const maxInput = document.getElementById(`filter-${filter.id}-max`) as HTMLInputElement;
    
    if (!minInput || !maxInput) return;

    let debounceTimer: number;
    const updateRange = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        this.currentValues[filter.id] = {
          min: minInput.value ? parseFloat(minInput.value) : undefined,
          max: maxInput.value ? parseFloat(maxInput.value) : undefined,
        };
        this.onFilterChange({ ...this.currentValues });
      }, 300);
    };

    minInput.addEventListener('input', updateRange);
    maxInput.addEventListener('input', updateRange);
  }

  private clearFilters(): void {
    this.currentValues = {};
    this.filters.forEach(filter => {
      const element = document.getElementById(`filter-${filter.id}`);
      if (element) {
        if (element instanceof HTMLInputElement) {
          element.value = '';
        } else if (element instanceof HTMLSelectElement) {
          element.selectedIndex = 0;
        }
      }

      // Clear date ranges
      const startElement = document.getElementById(`filter-${filter.id}-start`) as HTMLInputElement;
      const endElement = document.getElementById(`filter-${filter.id}-end`) as HTMLInputElement;
      if (startElement) startElement.value = '';
      if (endElement) endElement.value = '';

      // Clear ranges
      const minElement = document.getElementById(`filter-${filter.id}-min`) as HTMLInputElement;
      const maxElement = document.getElementById(`filter-${filter.id}-max`) as HTMLInputElement;
      if (minElement) minElement.value = '';
      if (maxElement) maxElement.value = '';

      // Clear multi-select checkboxes
      const container = document.getElementById(`filter-${filter.id}`);
      if (container) {
        container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
          (cb as HTMLInputElement).checked = false;
        });
      }
    });

    this.onFilterChange({});
  }

  getValues(): FilterValues {
    return { ...this.currentValues };
  }
}
