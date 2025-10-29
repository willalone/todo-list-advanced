import { useCallback, useEffect, useState } from 'react';
import { Priority } from '../types';
import { useTodos } from '../state/TodoContext';
import { normalizeTags, getPriorityLabel } from '../utils/todoUtils';
import { DEFAULT_PRIORITY, PRIORITY_OPTIONS } from '../constants/defaults';

interface TodoItemRowProps {
  id: string;
}

export function TodoItemRow({ id }: TodoItemRowProps) {
  const { state, toggle, remove, edit } = useTodos();
  const todo = state.items.find((t) => t.id === id);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo?.title || '');
  const [dueDate, setDueDate] = useState<string>('');
  const [tagsInput, setTagsInput] = useState('');
  const [priority, setPriority] = useState<Priority>(todo?.priority || DEFAULT_PRIORITY);

  // Sync form state when todo or editing state changes
  useEffect(() => {
    if (!todo) return;
    if (isEditing) {
      setTitle(todo.title);
      setDueDate(todo.dueDate || '');
      setTagsInput(todo.tags.join(', '));
      setPriority(todo.priority);
    }
  }, [todo, isEditing]);

  const handleSave = useCallback(() => {
    if (!todo) return;

    const trimmedTitle = title.trim() || todo.title;
    const draft = {
      title: trimmedTitle,
      dueDate: dueDate || undefined,
      tags: normalizeTags(tagsInput),
      priority,
    };

    edit(id, draft);
    setIsEditing(false);
  }, [id, edit, title, todo, dueDate, tagsInput, priority]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSave();
      } else if (e.key === 'Escape') {
        handleCancel();
      }
    },
    [handleSave, handleCancel]
  );

  const handleToggle = useCallback(() => {
    toggle(id);
  }, [id, toggle]);

  const handleRemove = useCallback(() => {
    remove(id);
  }, [id, remove]);

  if (!todo) return null;

  return (
    <div className="todoItem" role="listitem">
      <input
        type="checkbox"
        aria-label={`Отметить задачу "${todo.title}" как выполненную`}
        checked={todo.completed}
        onChange={handleToggle}
      />

      <div style={{ flex: 1 }}>
        {!isEditing ? (
          <div className="todoItemContent">
            <span
              className="todoTitle"
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none',
                opacity: todo.completed ? 0.7 : 1,
                cursor: 'pointer',
              }}
              onDoubleClick={() => setIsEditing(true)}
              title="Двойной клик для редактирования"
            >
              {todo.title}
            </span>

            {todo.dueDate && <span className="pill">до {todo.dueDate}</span>}
            
            <span className="pill">приоритет: {getPriorityLabel(todo.priority)}</span>

            {todo.tags.map((tag) => (
              <span key={tag} className="tag">
                #{tag}
              </span>
            ))}

            <span className="muted">
              обновлено {new Date(todo.updatedAt).toLocaleString()}
            </span>
          </div>
        ) : (
          <div className="inputRow">
            <input
              type="text"
              aria-label="Название задачи"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />

            <input
              type="date"
              aria-label="Срок выполнения"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <input
              type="text"
              aria-label="Теги"
              placeholder="теги, через, запятую"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
            />

            <select
              aria-label="Приоритет"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
            >
              {PRIORITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <button
              className="primary"
              onClick={handleSave}
              aria-label="Сохранить изменения"
            >
              Сохранить
            </button>
          </div>
        )}
      </div>

      <div className="todoItemActions">
        {!isEditing ? (
          <>
            <button onClick={() => setIsEditing(true)} aria-label="Редактировать задачу">
              Изменить
            </button>
            <button
              className="danger"
              onClick={handleRemove}
              aria-label="Удалить задачу"
            >
              Удалить
            </button>
          </>
        ) : (
          <button onClick={handleCancel} aria-label="Отменить редактирование">
            Отмена
          </button>
        )}
      </div>
    </div>
  );
}

