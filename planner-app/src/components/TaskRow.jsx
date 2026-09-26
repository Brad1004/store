import { useStore } from '../store';
import { relativeLabel, todayKey } from '../dates';

export default function TaskRow({ task, onOpen }) {
  const { dispatch } = useStore();
  const today = todayKey();
  const overdue = !task.done && task.due && task.due < today;
  const dueToday = !task.done && task.due === today;

  return (
    <div className={`task-row ${task.done ? 'done' : ''}`}>
      <input
        type="checkbox"
        className={`check ${overdue ? 'overdue' : ''}`}
        checked={task.done}
        onChange={() => dispatch({ type: 'toggleTask', id: task.id })}
        aria-label={`Complete ${task.title}`}
      />
      <button className="task-main" onClick={() => onOpen(task)}>
        <span className="prio">{task.priority}</span>
        <span className="task-title">{task.title}</span>
        {task.due && (
          <span className={`due ${overdue ? 'overdue' : ''} ${dueToday ? 'today' : ''}`}>
            {relativeLabel(task.due)}
          </span>
        )}
      </button>
    </div>
  );
}
