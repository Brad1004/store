import { useState } from 'react';
import Modal from './Modal';
import { useStore, uid, PRIORITIES, EVENT_COLORS } from '../store';
import { todayKey } from '../dates';

export function TaskEditor({ task, defaults = {}, onClose }) {
  const { state, dispatch } = useStore();
  const isNew = !task;
  const [f, setF] = useState(
    task || { id: uid(), title: '', priority: 'B1', due: todayKey(), done: false, projectId: null, memo: '', ...defaults }
  );
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const save = () => {
    if (!f.title.trim()) return;
    dispatch({ type: 'save', coll: 'tasks', item: { ...f, title: f.title.trim(), projectId: f.projectId || null } });
    onClose();
  };
  const remove = () => {
    dispatch({ type: 'remove', coll: 'tasks', id: f.id });
    onClose();
  };

  return (
    <Modal
      title={isNew ? 'New Task' : 'Edit Task'}
      onClose={onClose}
      footer={
        <>
          {!isNew && <button className="btn danger" onClick={remove}>Delete</button>}
          <span className="spacer" />
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={save} disabled={!f.title.trim()}>Save</button>
        </>
      }
    >
      <label className="field">
        <span>Title</span>
        <input autoFocus value={f.title} onChange={set('title')} onKeyDown={(e) => e.key === 'Enter' && save()} placeholder="What needs to be done?" />
      </label>
      <div className="field-row">
        <label className="field">
          <span>Priority</span>
          <select value={f.priority} onChange={set('priority')}>
            {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Due date</span>
          <input type="date" value={f.due || ''} onChange={set('due')} />
        </label>
      </div>
      <label className="field">
        <span>Project</span>
        <select value={f.projectId || ''} onChange={set('projectId')}>
          <option value="">Inbox (no project)</option>
          {state.projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </label>
      <label className="field">
        <span>Memo</span>
        <textarea rows={3} value={f.memo} onChange={set('memo')} />
      </label>
    </Modal>
  );
}

export function EventEditor({ event, date, onClose }) {
  const { dispatch } = useStore();
  const isNew = !event;
  const [f, setF] = useState(
    event || { id: uid(), title: '', date: date || todayKey(), allDay: false, start: '09:00', end: '10:00', color: EVENT_COLORS[0] }
  );
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const invalidTime = !f.allDay && f.end && f.start && f.end <= f.start;

  const save = () => {
    if (!f.title.trim() || invalidTime) return;
    dispatch({ type: 'save', coll: 'events', item: { ...f, title: f.title.trim() } });
    onClose();
  };
  const remove = () => {
    dispatch({ type: 'remove', coll: 'events', id: f.id });
    onClose();
  };

  return (
    <Modal
      title={isNew ? 'New Event' : 'Edit Event'}
      onClose={onClose}
      footer={
        <>
          {!isNew && <button className="btn danger" onClick={remove}>Delete</button>}
          <span className="spacer" />
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={save} disabled={!f.title.trim() || invalidTime}>Save</button>
        </>
      }
    >
      <label className="field">
        <span>Title</span>
        <input autoFocus value={f.title} onChange={set('title')} placeholder="Event title" />
      </label>
      <div className="field-row">
        <label className="field">
          <span>Date</span>
          <input type="date" value={f.date} onChange={set('date')} />
        </label>
        <label className="field check-field">
          <input type="checkbox" checked={f.allDay} onChange={(e) => setF({ ...f, allDay: e.target.checked })} />
          <span>All-day</span>
        </label>
      </div>
      {!f.allDay && (
        <div className="field-row">
          <label className="field">
            <span>Start</span>
            <input type="time" value={f.start} onChange={set('start')} />
          </label>
          <label className="field">
            <span>End</span>
            <input type="time" value={f.end} onChange={set('end')} />
          </label>
        </div>
      )}
      {invalidTime && <p className="error">End time must be after start time.</p>}
      <div className="field">
        <span>Color</span>
        <div className="swatches">
          {EVENT_COLORS.map((c) => (
            <button
              key={c}
              className={`swatch ${f.color === c ? 'on' : ''}`}
              style={{ background: c }}
              onClick={() => setF({ ...f, color: c })}
              aria-label={`Color ${c}`}
            />
          ))}
        </div>
      </div>
    </Modal>
  );
}
