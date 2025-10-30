import { useCallback, useState } from 'react';
import { Priority, TodoDraft } from '../types';
import { useTodos } from '../state/TodoContext';
import { normalizeTags } from '../utils/todoUtils';
import { DEFAULT_PRIORITY, PRIORITY_OPTIONS } from '../constants/defaults';

export function TodoCreateForm() {
  const { add } = useTodos();
  
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState<string>('');
  const [tagsInput, setTagsInput] = useState('');
  const [priority, setPriority] = useState<Priority>(DEFAULT_PRIORITY);

  const handleSubmit = useCallback(() => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    const draft: TodoDraft = {
      title: trimmedTitle,
      dueDate: dueDate || undefined,
      tags: normalizeTags(tagsInput),
      priority,
    };

    add(draft);
    
    // Reset form
    setTitle('');
    setDueDate('');
    setTagsInput('');
    setPriority(DEFAULT_PRIORITY);
  }, [title, dueDate, tagsInput, priority, add]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value),
    []
  );

  const handleDueDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setDueDate(e.target.value),
    []
  );

  const handleTagsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setTagsInput(e.target.value),
    []
  );

  const handlePriorityChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => setPriority(e.target.value as Priority),
    []
  );

  return (
    <div className="inputRow" role="form" aria-label="Создать задачу">
      <input
        aria-label="Название задачи"
        placeholder="Что нужно сделать?"
        value={title}
        onChange={handleTitleChange}
        onKeyDown={handleKeyDown}
      />
      
      <input
        type="date"
        aria-label="Срок"
        value={dueDate}
        onChange={handleDueDateChange}
      />
      
      <input
        aria-label="Теги"
        placeholder="теги, через, запятую"
        value={tagsInput}
        onChange={handleTagsChange}
      />
      
      <select
        aria-label="Приоритет"
        value={priority}
        onChange={handlePriorityChange}
      >
        {PRIORITY_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      <button className="primary" onClick={handleSubmit} aria-label="Добавить задачу">
        Добавить
      </button>
    </div>
  );
}

