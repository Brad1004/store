import { useStore } from '../store';
import { todayKey } from '../dates';
import { CalendarIcon, TaskIcon, NoteIcon, FocusIcon, SearchIcon, SettingsIcon } from './Icons';

const NAV = [
  { id: 'calendar', label: 'Calendar', Icon: CalendarIcon },
  { id: 'tasks', label: 'Tasks', Icon: TaskIcon },
  { id: 'notes', label: 'Notes', Icon: NoteIcon },
  { id: 'focus', label: 'Focus', Icon: FocusIcon },
  { id: 'search', label: 'Search', Icon: SearchIcon },
  { id: 'settings', label: 'Settings', Icon: SettingsIcon },
];

export default function Sidebar({ view, onChange }) {
  const { state } = useStore();
  const today = todayKey();
  // Badge = open tasks due today or overdue (same as the reference app's "15")
  const badge = state.tasks.filter((t) => !t.done && t.due && t.due <= today).length;
  const initial = (state.profile.name || '?').trim().charAt(0).toUpperCase();

  return (
    <nav className="sidebar">
      <button className="avatar" onClick={() => onChange('settings')} title={state.profile.name}>
        {initial}
      </button>
      <div className="sidebar-divider" />
      {NAV.map(({ id, label, Icon }) => (
        <button
          key={id}
          className={`nav-btn ${view === id ? 'active' : ''} ${id === 'settings' ? 'nav-settings' : ''}`}
          onClick={() => onChange(id)}
          title={label}
          aria-label={label}
        >
          <Icon />
          {id === 'tasks' && badge > 0 && <span className="badge">{badge}</span>}
          <span className="nav-label">{label}</span>
        </button>
      ))}
    </nav>
  );
}
