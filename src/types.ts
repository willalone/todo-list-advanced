export type TodoId = string;

export type Priority = 'low' | 'medium' | 'high';

export interface TodoItem {
  id: TodoId;
  title: string;
  completed: boolean;
  createdAt: number; // epoch ms
  updatedAt: number; // epoch ms
  dueDate?: string; // ISO date (YYYY-MM-DD)
  tags: string[];
  priority: Priority;
  notes?: string;
}

export interface TodoDraft {
  title: string;
  dueDate?: string;
  tags?: string[];
  priority?: Priority;
  notes?: string;
}

export type SortKey = 'createdAt' | 'updatedAt' | 'title' | 'dueDate' | 'priority';
export type SortDir = 'asc' | 'desc';

export interface FilterState {
  query: string;
  status: 'all' | 'active' | 'completed';
  tag?: string;
  priority?: Priority | 'all';
}


