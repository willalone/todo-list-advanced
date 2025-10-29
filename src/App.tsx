import { TodoProvider } from './state/TodoContext';
import { TodoApp } from './components/TodoApp';

export default function App() {
  return (
    <TodoProvider>
      <TodoApp />
    </TodoProvider>
  );
}


