import { useCallback } from 'react';
import { FilterState, SortDir, SortKey } from '../types';
import { PRIORITY_OPTIONS, STATUS_OPTIONS, SORT_OPTIONS } from '../constants/defaults';

interface TodoFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  sortKey: SortKey;
  sortDir: SortDir;
  onSortChange: (key: SortKey, dir: SortDir) => void;
  availableTags: string[];
}

export function TodoFilters({
  filters,
  onFiltersChange,
  sortKey,
  sortDir,
  onSortChange,
  availableTags,
}: TodoFiltersProps) {
  const handleQueryChange = useCallback(
    (value: string) => {
      onFiltersChange({ ...filters, query: value });
    },
    [filters, onFiltersChange]
  );

  const handleStatusChange = useCallback(
    (value: string) => {
      onFiltersChange({ ...filters, status: value as FilterState['status'] });
    },
    [filters, onFiltersChange]
  );

  const handleTagChange = useCallback(
    (value: string) => {
      onFiltersChange({ ...filters, tag: value || undefined });
    },
    [filters, onFiltersChange]
  );

  const handlePriorityChange = useCallback(
    (value: string) => {
      onFiltersChange({ ...filters, priority: value as FilterState['priority'] });
    },
    [filters, onFiltersChange]
  );

  const handleSortChange = useCallback(
    (value: string) => {
      const [key, dir] = value.split(':') as [SortKey, SortDir];
      onSortChange(key, dir);
    },
    [onSortChange]
  );

  return (
    <div className="toolbar" style={{ marginTop: 16 }}>
      <input
        type="search"
        aria-label="Поиск"
        placeholder="Поиск по названию, заметкам и тегам"
        value={filters.query}
        onChange={(e) => handleQueryChange(e.target.value)}
      />

      <select
        aria-label="Фильтр по статусу"
        value={filters.status}
        onChange={(e) => handleStatusChange(e.target.value)}
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        aria-label="Фильтр по тегу"
        value={filters.tag ?? ''}
        onChange={(e) => handleTagChange(e.target.value)}
      >
        <option value="">Все теги</option>
        {availableTags.map((tag) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </select>

      <select
        aria-label="Фильтр по приоритету"
        value={filters.priority ?? 'all'}
        onChange={(e) => handlePriorityChange(e.target.value)}
      >
        <option value="all">Любой приоритет</option>
        {PRIORITY_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        aria-label="Сортировка"
        value={`${sortKey}:${sortDir}`}
        onChange={(e) => handleSortChange(e.target.value)}
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

