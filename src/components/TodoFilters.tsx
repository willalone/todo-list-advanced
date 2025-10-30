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
  const updateFilter = useCallback(
    (key: keyof FilterState, value: unknown) => {
      onFiltersChange({ ...filters, [key]: value });
    },
    [filters, onFiltersChange]
  );

  const handleQueryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => updateFilter('query', e.target.value),
    [updateFilter]
  );

  const handleStatusChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => updateFilter('status', e.target.value),
    [updateFilter]
  );

  const handleTagChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => updateFilter('tag', e.target.value || undefined),
    [updateFilter]
  );

  const handlePriorityChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => updateFilter('priority', e.target.value),
    [updateFilter]
  );

  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const [key, dir] = e.target.value.split(':') as [SortKey, SortDir];
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
        onChange={handleQueryChange}
      />

      <select
        aria-label="Фильтр по статусу"
        value={filters.status}
        onChange={handleStatusChange}
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select aria-label="Фильтр по тегу" value={filters.tag ?? ''} onChange={handleTagChange}>
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
        onChange={handlePriorityChange}
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
        onChange={handleSortChange}
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

