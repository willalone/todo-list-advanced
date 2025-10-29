import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { FilterState, SortDir, SortKey, TodoDraft, TodoItem } from '../types';
import { applyFilters, createTodo, sortTodos, updateTodo } from '../utils/todoUtils';

type Action =
  | { type: 'add'; draft: TodoDraft }
  | { type: 'toggle'; id: string }
  | { type: 'remove'; id: string }
  | { type: 'edit'; id: string; update: Partial<Omit<TodoItem, 'id' | 'createdAt'>> }
  | { type: 'hydrate'; items: TodoItem[] };

interface State {
  items: TodoItem[];
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'hydrate':
      return { items: action.items };
    case 'add':
      return { items: [createTodo(action.draft), ...state.items] };
    case 'toggle':
      return {
        items: state.items.map((t) => (t.id === action.id ? updateTodo(t, { completed: !t.completed }) : t)),
      };
    case 'remove':
      return { items: state.items.filter((t) => t.id !== action.id) };
    case 'edit':
      return {
        items: state.items.map((t) => (t.id === action.id ? updateTodo(t, action.update) : t)),
      };
    default:
      return state;
  }
}

interface TodoContextValue {
  state: State;
  add: (draft: TodoDraft) => void;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  edit: (id: string, update: Partial<Omit<TodoItem, 'id' | 'createdAt'>>) => void;
  filteredSorted: (filters: FilterState, sortKey: SortKey, sortDir: SortDir) => TodoItem[];
}

const TodoContext = createContext<TodoContextValue | null>(null);

const STORAGE_KEY = 'advanced_todos_v1';

export function TodoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as TodoItem[];
        dispatch({ type: 'hydrate', items: parsed });
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // ignore
    }
  }, [state.items]);

  const value: TodoContextValue = useMemo(() => ({
    state,
    add: (draft) => dispatch({ type: 'add', draft }),
    toggle: (id) => dispatch({ type: 'toggle', id }),
    remove: (id) => dispatch({ type: 'remove', id }),
    edit: (id, update) => dispatch({ type: 'edit', id, update }),
    filteredSorted: (filters, sortKey, sortDir) => {
      const filtered = applyFilters(state.items, filters);
      return sortTodos(filtered, sortKey, sortDir);
    },
  }), [state]);

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

export function useTodos() {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error('useTodos must be used within TodoProvider');
  return ctx;
}


