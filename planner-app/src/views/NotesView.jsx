import { useMemo, useState } from 'react';
import { useStore, uid } from '../store';
import { MONTHS, MONTHS_LONG, WEEKDAYS_LONG } from '../dates';
import Fab from '../components/Fab';
import { BackIcon, TrashIcon } from '../components/Icons';

const firstLine = (s) => s.split('\n').find((l) => l.trim()) || '';

export default function NotesView({ initialId }) {
  const { state, dispatch } = useStore();
  const sorted = useMemo(() => [...state.notes].sort((a, b) => b.updatedAt - a.updatedAt), [state.notes]);
  const [selectedId, setSelectedId] = useState(initialId || sorted[0]?.id || null);
  const [mobileOpen, setMobileOpen] = useState(Boolean(initialId));
  const note = state.notes.find((n) => n.id === selectedId);

  const groups = useMemo(() => {
    const map = new Map();
    sorted.forEach((n) => {
      const d = new Date(n.updatedAt);
      const k = `${MONTHS_LONG[d.getMonth()]} ${d.getFullYear()}`;
      if (!map.has(k)) map.set(k, []);
      map.get(k).push(n);
    });
    return [...map];
  }, [sorted]);

  const create = () => {
    const n = { id: uid(), title: '', body: '', updatedAt: Date.now() };
    dispatch({ type: 'save', coll: 'notes', item: n });
    setSelectedId(n.id);
    setMobileOpen(true);
  };

  const update = (patch) => dispatch({ type: 'save', coll: 'notes', item: { ...note, ...patch, updatedAt: Date.now() } });

  const remove = () => {
    if (!window.confirm('Delete this note?')) return;
    dispatch({ type: 'remove', coll: 'notes', id: note.id });
    setSelectedId(sorted.find((n) => n.id !== note.id)?.id || null);
    setMobileOpen(false);
  };

  const d = note && new Date(note.updatedAt);

  return (
    <div className={`page ${mobileOpen ? 'detail-open' : ''}`}>
      <div className="split">
        <div className="col master">
          <h1 className="title">Notes</h1>
          {groups.length === 0 && <p className="empty">No notes yet. Tap + to write one.</p>}
          {groups.map(([month, items]) => (
            <section key={month}>
              <h3 className="month-label">{month}</h3>
              {items.map((n) => {
                const nd = new Date(n.updatedAt);
                return (
                  <button
                    key={n.id}
                    className={`note-card ${n.id === selectedId ? 'on' : ''}`}
                    onClick={() => { setSelectedId(n.id); setMobileOpen(true); }}
                  >
                    <strong>{n.title || 'Untitled'}</strong>
                    <span className="preview">{firstLine(n.body) || 'No Content'}</span>
                    <span className="date">{MONTHS[nd.getMonth()]} {nd.getDate()}</span>
                  </button>
                );
              })}
            </section>
          ))}
        </div>

        <div className="col detail">
          {note ? (
            <div className="card note-editor">
              <div className="note-head">
                <button className="icon-btn mobile-only" onClick={() => setMobileOpen(false)} aria-label="Back"><BackIcon /></button>
                <span className="note-date">
                  {WEEKDAYS_LONG[d.getDay()].slice(0, 3)}, {MONTHS[d.getMonth()]} {d.getDate()}, {d.getFullYear()}
                </span>
                <button className="icon-btn subtle" onClick={remove} aria-label="Delete note"><TrashIcon /></button>
              </div>
              <input className="note-title" value={note.title} placeholder="Title" onChange={(e) => update({ title: e.target.value })} />
              <textarea className="note-body" value={note.body} placeholder="Start writing…" onChange={(e) => update({ body: e.target.value })} />
            </div>
          ) : (
            <div className="card note-editor empty-state"><p className="empty">Select or create a note</p></div>
          )}
        </div>
      </div>
      <Fab onClick={create} label="New note" />
    </div>
  );
}
