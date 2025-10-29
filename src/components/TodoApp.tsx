import { useMemo, useState } from 'react';
import { FilterState, Priority, SortDir, SortKey, TodoDraft } from '../types';
import { useTodos } from '../state/TodoContext';
import { normalizeTags } from '../utils/todoUtils';

export function TodoApp() {
  const { filteredSorted } = useTodos();

  const [filters, setFilters] = useState<FilterState>({
    query: '',
    status: 'all',
    tag: undefined,
    priority: 'all',
  });
  const [sortKey, setSortKey] = useState<SortKey>('updatedAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const items = filteredSorted(filters, sortKey, sortDir);

  const uniqueTags = useMemo(() => {
    const set = new Set<string>();
    items.forEach((t) => t.tags.forEach((tg) => set.add(tg)));
    return Array.from(set).sort();
  }, [items]);

  return (
    <div className="container">
      <div className="card" role="application" aria-label="To-Do List">
        <div className="header">
          <h1 className="title">To‑Do List</h1>
          <StatsBar />
        </div>
        <div className="grid">
          <div className="section">
            <CreateForm />
            <Toolbar
              filters={filters}
              onChangeFilters={setFilters}
              sortKey={sortKey}
              sortDir={sortDir}
              onChangeSort={(k, d) => { setSortKey(k); setSortDir(d); }}
              tags={uniqueTags}
            />
            <List items={items} />
          </div>
          <div className="section">
            <Hints />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsBar() {
  const { state } = useTodos();
  const total = state.items.length;
  const done = state.items.filter((t) => t.completed).length;
  const active = total - done;
  return (
    <div className="toolbar" aria-live="polite">
      <span className="pill">Всего: {total}</span>
      <span className="pill">Активные: {active}</span>
      <span className="pill">Завершённые: {done}</span>
    </div>
  );
}

function CreateForm() {
  const { add } = useTodos();
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState<string | undefined>();
  const [tagsInput, setTagsInput] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');

  function submit() {
    const draft: TodoDraft = {
      title: title.trim(),
      dueDate,
      tags: normalizeTags(tagsInput),
      priority,
    };
    if (!draft.title) return;
    add(draft);
    setTitle('');
    setDueDate(undefined);
    setTagsInput('');
    setPriority('medium');
  }

  return (
    <div className="inputRow" role="form" aria-label="Создать задачу">
      <input
        aria-label="Название задачи"
        placeholder="Что нужно сделать?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
      />
      <input
        aria-label="Срок"
        type="date"
        value={dueDate ?? ''}
        onChange={(e) => setDueDate(e.target.value || undefined)}
      />
      <input
        aria-label="Теги"
        placeholder="теги, через, запятую"
        value={tagsInput}
        onChange={(e) => setTagsInput(e.target.value)}
      />
      <select aria-label="Приоритет" value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
        <option value="low">Низкий</option>
        <option value="medium">Средний</option>
        <option value="high">Высокий</option>
      </select>
      <button className="primary" onClick={submit} aria-label="Добавить задачу">Добавить</button>
    </div>
  );
}

function Toolbar(props: {
  filters: FilterState;
  onChangeFilters: (f: FilterState) => void;
  sortKey: SortKey;
  sortDir: SortDir;
  onChangeSort: (k: SortKey, d: SortDir) => void;
  tags: string[];
}) {
  const { filters, onChangeFilters, sortKey, sortDir, onChangeSort, tags } = props;
  return (
    <div className="toolbar" style={{ marginTop: 16 }}>
      <input
        aria-label="Поиск"
        placeholder="Поиск по названию, заметкам и тегам"
        value={filters.query}
        onChange={(e) => onChangeFilters({ ...filters, query: e.target.value })}
      />
      <select
        aria-label="Статус"
        value={filters.status}
        onChange={(e) => onChangeFilters({ ...filters, status: e.target.value as FilterState['status'] })}
      >
        <option value="all">Все</option>
        <option value="active">Активные</option>
        <option value="completed">Завершённые</option>
      </select>
      <select aria-label="Тег" value={filters.tag ?? ''} onChange={(e) => onChangeFilters({ ...filters, tag: e.target.value || undefined })}>
        <option value="">Все теги</option>
        {tags.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
      <select aria-label="Приоритет" value={filters.priority ?? 'all'} onChange={(e) => onChangeFilters({ ...filters, priority: e.target.value as any })}>
        <option value="all">Любой приоритет</option>
        <option value="low">Низкий</option>
        <option value="medium">Средний</option>
        <option value="high">Высокий</option>
      </select>
      <select aria-label="Сортировка" value={`${sortKey}:${sortDir}`} onChange={(e) => {
        const [k, d] = e.target.value.split(':') as [SortKey, SortDir];
        onChangeSort(k, d);
      }}>
        <option value="updatedAt:desc">Недавно изменённые</option>
        <option value="createdAt:desc">Недавно добавленные</option>
        <option value="title:asc">По названию (А→Я)</option>
        <option value="dueDate:asc">По сроку (ближайшие)</option>
        <option value="priority:desc">По приоритету (высокий→низкий)</option>
      </select>
    </div>
  );
}

function List({ items }: { items: ReturnType<typeof Array.prototype.slice> }) {
  if (items.length === 0) {
    return <p className="muted" style={{ marginTop: 16 }}>Список пуст. Добавьте первую задачу выше.</p>;
  }
  return (
    <div className="list" role="list" aria-label="Список задач" style={{ marginTop: 16 }}>
      {items.map((t) => (
        <Row key={t.id} id={t.id} />
      ))}
    </div>
  );
}

function Row({ id }: { id: string }) {
  const { state, toggle, remove, edit } = useTodos();
  const todo = state.items.find((t) => t.id === id)!;

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [dueDate, setDueDate] = useState<string | undefined>(todo.dueDate);
  const [tagsInput, setTagsInput] = useState(todo.tags.join(', '));
  const [priority, setPriority] = useState<Priority>(todo.priority);

  function save() {
    edit(id, { title: title.trim() || todo.title, dueDate, tags: normalizeTags(tagsInput), priority });
    setEditing(false);
  }

  return (
    <div className="todoItem" role="listitem">
      <input
        aria-label={`Переключить задачу ${todo.title}`}
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggle(id)}
      />
      <div>
        {!editing ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span className="todoTitle" style={{ textDecoration: todo.completed ? 'line-through' : 'none', opacity: todo.completed ? 0.7 : 1 }}>{todo.title}</span>
            {todo.dueDate && <span className="pill">до {todo.dueDate}</span>}
            <span className="pill">приоритет: {prioLabel(todo.priority)}</span>
            {todo.tags.map((tg) => <span key={tg} className="tag">#{tg}</span>)}
            <span className="muted">обновлено {new Date(todo.updatedAt).toLocaleString()}</span>
          </div>
        ) : (
          <div className="inputRow">
            <input aria-label="Название" value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && save()} />
            <input aria-label="Срок" type="date" value={dueDate ?? ''} onChange={(e) => setDueDate(e.target.value || undefined)} />
            <input aria-label="Теги" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} />
            <select aria-label="Приоритет" value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
              <option value="low">Низкий</option>
              <option value="medium">Средний</option>
              <option value="high">Высокий</option>
            </select>
            <button className="primary" onClick={save}>Сохранить</button>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {!editing ? (
          <>
            <button onClick={() => setEditing(true)}>Изменить</button>
            <button className="danger" onClick={() => remove(id)}>Удалить</button>
          </>
        ) : (
          <button onClick={() => setEditing(false)}>Отмена</button>
        )}
      </div>
    </div>
  );
}

function prioLabel(p: Priority) {
  switch (p) {
    case 'low': return 'низкий';
    case 'medium': return 'средний';
    case 'high': return 'высокий';
  }
}

function Hints() {
  return (
    <div>
      <h3 style={{ marginTop: 0 }}>Подсказки</h3>
      <ul>
        <li>Нажмите Enter в поле ввода, чтобы быстро добавить задачу.</li>
        <li>Используйте запятые для добавления нескольких тегов сразу.</li>
        <li>Клавиатура: Tab/Shift+Tab для навигации, Space для переключения чекбокса.</li>
      </ul>
      <p className="muted">Данные сохраняются в localStorage браузера.</p>
    </div>
  );
}


