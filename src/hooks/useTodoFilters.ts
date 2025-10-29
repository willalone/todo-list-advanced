import { useMemo, useState } from 'react';
import { FilterState, SortDir, SortKey, TodoItem } from '../types';
import { DEFAULT_FILTERS } from '../constants/defaults';

export function useTodoFilters(initialFilters: FilterState = DEFAULT_FILTERS) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [sortKey, setSortKey] = useState<SortKey>('updatedAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const handleSortChange = (key: SortKey, dir: SortDir) => {
    setSortKey(key);
    setSortDir(dir);
  };

  return {
    filters,
    sortKey,
    sortDir,
    setFilters,
    handleSortChange,
  };
}

export function useUniqueTags(items: TodoItem[]): string[] {
  return useMemo(() => {
    const tagSet = new Set<string>();
    items.forEach((item) => {
      item.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [items]);
}

