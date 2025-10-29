import { FilterState, Priority, SortDir, SortKey, TodoDraft, TodoItem } from '../types';

export function generateId(): string {
  const rnd = Math.random().toString(36).slice(2, 10);
  const ts = Date.now().toString(36);
  return `${ts}_${rnd}`;
}

export function createTodo(draft: TodoDraft): TodoItem {
  const now = Date.now();
  return {
    id: generateId(),
    title: draft.title.trim(),
    completed: false,
    createdAt: now,
    updatedAt: now,
    dueDate: draft.dueDate,
    tags: (draft.tags ?? []).map((t) => sanitizeTag(t)).filter(Boolean),
    priority: draft.priority ?? 'medium',
    notes: draft.notes?.trim() || undefined,
  };
}

export function sanitizeTag(tag: string): string {
  return tag.trim().toLowerCase().replace(/\s+/g, '-');
}

export function normalizeTags(input: string): string[] {
  return input
    .split(',')
    .map((t) => sanitizeTag(t))
    .filter((t) => t.length);
}

export function updateTodo(todo: TodoItem, update: Partial<Omit<TodoItem, 'id' | 'createdAt'>>): TodoItem {
  return { ...todo, ...update, updatedAt: Date.now() };
}

export function applyFilters(todos: TodoItem[], filters: FilterState): TodoItem[] {
  const query = filters.query.trim().toLowerCase();
  const matchesQuery = (t: TodoItem) =>
    !query ||
    t.title.toLowerCase().includes(query) ||
    (t.notes ? t.notes.toLowerCase().includes(query) : false) ||
    t.tags.some((tg) => tg.includes(query));

  return todos.filter((t) => {
    if (!matchesQuery(t)) return false;
    if (filters.status === 'active' && t.completed) return false;
    if (filters.status === 'completed' && !t.completed) return false;
    if (filters.tag && !t.tags.includes(filters.tag)) return false;
    if (filters.priority && filters.priority !== 'all' && t.priority !== filters.priority) return false;
    return true;
  });
}

const priorityOrder: Record<Priority, number> = { low: 0, medium: 1, high: 2 };

export function sortTodos(todos: TodoItem[], key: SortKey, dir: SortDir): TodoItem[] {
  const factor = dir === 'asc' ? 1 : -1;
  const sorted = [...todos].sort((a, b) => {
    switch (key) {
      case 'title':
        return a.title.localeCompare(b.title) * factor;
      case 'createdAt':
        return (a.createdAt - b.createdAt) * factor;
      case 'updatedAt':
        return (a.updatedAt - b.updatedAt) * factor;
      case 'dueDate': {
        const ad = a.dueDate ? Date.parse(a.dueDate) : Number.POSITIVE_INFINITY;
        const bd = b.dueDate ? Date.parse(b.dueDate) : Number.POSITIVE_INFINITY;
        return (ad - bd) * factor;
      }
      case 'priority':
        return (priorityOrder[a.priority] - priorityOrder[b.priority]) * factor;
      default:
        return 0;
    }
  });
  return sorted;
}


