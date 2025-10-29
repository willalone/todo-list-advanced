import { TodoItem } from '../types';
import { TodoItemRow } from './TodoItemRow';

interface TodoListProps {
  items: TodoItem[];
}

export function TodoList({ items }: TodoListProps) {
  if (items.length === 0) {
    return (
      <p className="muted" style={{ marginTop: 16 }}>
        Список пуст. Добавьте первую задачу выше.
      </p>
    );
  }

  return (
    <div className="list" role="list" aria-label="Список задач" style={{ marginTop: 16 }}>
      {items.map((item) => (
        <TodoItemRow key={item.id} id={item.id} />
      ))}
    </div>
  );
}

