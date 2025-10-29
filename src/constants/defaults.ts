import { FilterState, Priority } from '../types';

export const DEFAULT_PRIORITY: Priority = 'medium';

export const DEFAULT_FILTERS: FilterState = {
  query: '',
  status: 'all',
  tag: undefined,
  priority: 'all',
} as const;

export const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Низкий' },
  { value: 'medium', label: 'Средний' },
  { value: 'high', label: 'Высокий' },
] as const;

export const STATUS_OPTIONS = [
  { value: 'all', label: 'Все' },
  { value: 'active', label: 'Активные' },
  { value: 'completed', label: 'Завершённые' },
] as const;

export const SORT_OPTIONS = [
  { value: 'updatedAt:desc', label: 'Недавно изменённые' },
  { value: 'createdAt:desc', label: 'Недавно добавленные' },
  { value: 'title:asc', label: 'По названию (А→Я)' },
  { value: 'dueDate:asc', label: 'По сроку (ближайшие)' },
  { value: 'priority:desc', label: 'По приоритету (высокий→низкий)' },
] as const;

