import { useTodos } from '../state/TodoContext';

interface TodoStatsProps {
  className?: string;
}

export function TodoStats({ className = '' }: TodoStatsProps) {
  const { state } = useTodos();
  
  const activeCount = state.items.filter((t) => !t.completed).length;
  const completedCount = state.items.filter((t) => t.completed).length;

  return (
    <div className={`toolbar ${className}`.trim()} aria-live="polite">
      <span className="pill">Активные: {activeCount}</span>
      <span className="pill">Завершённые: {completedCount}</span>
    </div>
  );
}

