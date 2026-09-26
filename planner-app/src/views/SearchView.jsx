import { useState } from 'react';
import { useStore } from '../store';
import { shortLabel } from '../dates';
import TaskRow from '../components/TaskRow';
import { TaskEditor, EventEditor } from '../components/Editors';

export default function SearchView({ onOpenNote }) {
  const { state } = useStore();
  const [q, setQ] = useState('');
  const [task, setTask] = useState(null);
  const [event, setEvent] = useState(null);
  const s = q.trim().toLowerCase();
  const has = (...fields) => fields.some((f) => (f || '').toLowerCase().includes(s));

  const tasks = s ? state.tasks.filter((t) => has(t.title, t.memo)) : [];
  const events = s ? state.events.filter((e) => has(e.title)) : [];
  const notes = s ? state.notes.filter((n) => has(n.title, n.body)) : [];

  return (
    <div className="page">
      <h1 className="title">Search</h1>
      <input className="search-input" autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tasks, events and notes" />
      {s && tasks.length + events.length + notes.length === 0 && <p className="empty">No results for “{q}”</p>}
      {tasks.length > 0 && (
        <section className="card result-card">
          <h4 className="group-label">Tasks ({tasks.length})</h4>
          {tasks.map((t) => <TaskRow key={t.id} task={t} onOpen={setTask} />)}
        </section>
      )}
      {events.length > 0 && (
        <section className="card result-card">
          <h4 className="group-label">Events ({events.length})</h4>
          {events.map((e) => (
            <button key={e.id} className="result" onClick={() => setEvent(e)}>
              <i className="dot-lg" style={{ background: e.color }} />
              <span>{e.title}</span>
              <small>{shortLabel(e.date)} {e.allDay ? 'All-day' : e.start}</small>
            </button>
          ))}
        </section>
      )}
      {notes.length > 0 && (
        <section className="card result-card">
          <h4 className="group-label">Notes ({notes.length})</h4>
          {notes.map((n) => (
            <button key={n.id} className="result" onClick={() => onOpenNote(n.id)}>
              <span>📝 {n.title || 'Untitled'}</span>
            </button>
          ))}
        </section>
      )}
      {task && <TaskEditor task={task} onClose={() => setTask(null)} />}
      {event && <EventEditor event={event} onClose={() => setEvent(null)} />}
    </div>
  );
}
