import { useMemo } from 'react';
import { useTodos } from '../state/TodoContext';
import { useTodoFilters, useUniqueTags } from '../hooks/useTodoFilters';
import { TodoStats } from './TodoStats';
import { TodoCreateForm } from './TodoCreateForm';
import { TodoFilters } from './TodoFilters';
import { TodoList } from './TodoList';

export function TodoApp() {
  const { filteredSorted } = useTodos();
  const { filters, sortKey, sortDir, setFilters, handleSortChange } = useTodoFilters();
  
  const todos = useMemo(
    () => filteredSorted(filters, sortKey, sortDir),
    [filteredSorted, filters, sortKey, sortDir]
  );

  const uniqueTags = useUniqueTags(todos);

  return (
    <div className="container">
      <div className="card" role="application" aria-label="To-Do List">
        <div className="header">
          <h1 className="title">To‑Do List</h1>
          <TodoStats />
        </div>

        <div className="grid">
          <div className="section">
            <TodoCreateForm />
            
            <TodoFilters
              filters={filters}
              onFiltersChange={setFilters}
              sortKey={sortKey}
              sortDir={sortDir}
              onSortChange={handleSortChange}
              availableTags={uniqueTags}
            />

            <TodoList items={todos} />
          </div>
        </div>
      </div>
    </div>
  );
}
