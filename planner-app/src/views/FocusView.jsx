import { useEffect, useState } from 'react';
import { useStore, uid } from '../store';
import { toKey, addDays, todayKey, WEEKDAYS } from '../dates';
import Modal from '../components/Modal';
import { StatsIcon, PlusIcon } from '../components/Icons';

const ACTIVITY_COLORS = ['#fdd0c0', '#d6ccff', '#c8ecd4', '#fff0b8', '#cfe6ff', '#ffd6e8'];
const EMOJIS = ['📝', '📚', '💻', '🏭', '📊', '🧘', '🏃', '📞', '🎯', '✍️'];

const fmt = (sec) => `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;

// Seconds left on the shared timer at this moment
export const timeLeft = (timer) =>
  timer.status === 'running' ? Math.max(0, Math.round((timer.endAt - Date.now()) / 1000)) : timer.remaining;

export default function FocusView() {
  const { state, dispatch } = useStore();
  const { timer, activities, settings } = state;
  const [, tick] = useState(0);
  const [editing, setEditing] = useState(null); // activity or 'new'
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    if (timer.status !== 'running') return;
    const id = setInterval(() => tick((n) => n + 1), 250);
    return () => clearInterval(id);
  }, [timer.status]);

  const activity = activities.find((a) => a.id === timer.activityId);
  const duration = (activity ? activity.minutes : settings.focusMinutes) * 60;
  const left = timeLeft(timer);
  const progress = duration ? left / duration : 1;

  const setTimer = (value) => dispatch({ type: 'set', key: 'timer', value });

  const start = () => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') Notification.requestPermission();
    setTimer({ status: 'running', endAt: Date.now() + left * 1000 });
  };
  const pause = () => setTimer({ status: 'paused', remaining: left, endAt: null });
  const reset = () => setTimer({ status: 'idle', remaining: duration, endAt: null });

  const choose = (a) => {
    if (timer.status === 'running' && !window.confirm('Stop the current focus session?')) return;
    const same = timer.activityId === a?.id;
    const mins = a ? a.minutes : settings.focusMinutes;
    setTimer({ activityId: same ? null : a?.id ?? null, status: 'idle', endAt: null, remaining: (same ? settings.focusMinutes : mins) * 60 });
  };

  // R = 140 → circumference ≈ 879.6
  const C = 2 * Math.PI * 140;

  return (
    <div className="page">
      <header className="page-head">
        <h1 className="title">Focus</h1>
        <button className="icon-btn" onClick={() => setShowStats(true)} aria-label="Statistics"><StatsIcon size={30} /></button>
      </header>

      <div className="card focus-card">
        <h3 className="focus-label">#{activity ? activity.name : 'Quick Focus'}#</h3>
        <div className="ring">
          <svg viewBox="0 0 300 300">
            <circle cx="150" cy="150" r="140" className="ring-bg" />
            <circle
              cx="150" cy="150" r="140" className="ring-fg"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - progress)}
              transform="rotate(-90 150 150)"
            />
          </svg>
          <span className="clock">{fmt(left)}</span>
        </div>
        <div className="focus-actions">
          {timer.status === 'running' ? (
            <button className="btn big soft" onClick={pause}>Pause</button>
          ) : (
            <button className="btn big soft" onClick={start}>{timer.status === 'paused' ? 'Resume' : 'Start'}</button>
          )}
          {timer.status !== 'idle' && <button className="btn big ghost" onClick={reset}>Reset</button>}
        </div>
      </div>

      <h2 className="subtitle dark">My Activities</h2>
      <div className="activities">
        {activities.map((a) => (
          <div key={a.id} className={`activity ${timer.activityId === a.id ? 'on' : ''}`} style={{ background: a.color }}>
            <button className="activity-main" onClick={() => choose(a)}>
              <span className="emoji">{a.emoji}</span>
              <span className="meta">{a.minutes}min 🍅 {a.count}</span>
              <strong>{a.name}</strong>
            </button>
            <button className="activity-edit" onClick={() => setEditing(a)} aria-label={`Edit ${a.name}`}>⋯</button>
          </div>
        ))}
        <button className="activity new" onClick={() => setEditing('new')}>
          <PlusIcon size={40} />
          <span>New Activity</span>
        </button>
      </div>

      {editing && <ActivityEditor activity={editing === 'new' ? null : editing} onClose={() => setEditing(null)} onDeleted={() => choose(null)} />}
      {showStats && <StatsModal onClose={() => setShowStats(false)} />}
    </div>
  );
}

function ActivityEditor({ activity, onClose, onDeleted }) {
  const { state, dispatch } = useStore();
  const [f, setF] = useState(activity || { id: uid(), name: '', emoji: EMOJIS[0], minutes: 25, color: ACTIVITY_COLORS[1], count: 0 });
  const valid = f.name.trim() && f.minutes >= 1 && f.minutes <= 180;

  const save = () => {
    if (!valid) return;
    dispatch({ type: 'save', coll: 'activities', item: { ...f, name: f.name.trim(), minutes: Number(f.minutes) } });
    // Keep the idle timer in sync if this activity's length changed
    if (state.timer.activityId === f.id && state.timer.status === 'idle') {
      dispatch({ type: 'set', key: 'timer', value: { remaining: Number(f.minutes) * 60 } });
    }
    onClose();
  };
  const remove = () => {
    dispatch({ type: 'remove', coll: 'activities', id: f.id });
    if (state.timer.activityId === f.id) onDeleted();
    onClose();
  };

  return (
    <Modal
      title={activity ? 'Edit Activity' : 'New Activity'}
      onClose={onClose}
      footer={
        <>
          {activity && <button className="btn danger" onClick={remove}>Delete</button>}
          <span className="spacer" />
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={save} disabled={!valid}>Save</button>
        </>
      }
    >
      <label className="field">
        <span>Name</span>
        <input autoFocus value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="e.g. Deep work" />
      </label>
      <label className="field">
        <span>Minutes per session</span>
        <input type="number" min="1" max="180" value={f.minutes} onChange={(e) => setF({ ...f, minutes: e.target.value })} />
      </label>
      <div className="field">
        <span>Icon</span>
        <div className="swatches">
          {EMOJIS.map((e) => (
            <button key={e} className={`emoji-pick ${f.emoji === e ? 'on' : ''}`} onClick={() => setF({ ...f, emoji: e })}>{e}</button>
          ))}
        </div>
      </div>
      <div className="field">
        <span>Color</span>
        <div className="swatches">
          {ACTIVITY_COLORS.map((c) => (
            <button key={c} className={`swatch ${f.color === c ? 'on' : ''}`} style={{ background: c }} onClick={() => setF({ ...f, color: c })} aria-label={c} />
          ))}
        </div>
      </div>
    </Modal>
  );
}

function StatsModal({ onClose }) {
  const { state } = useStore();
  const today = todayKey();
  const todays = state.sessions.filter((s) => s.date === today);
  const days = Array.from({ length: 7 }, (_, i) => toKey(addDays(new Date(), i - 6)));
  const perDay = days.map((k) => state.sessions.filter((s) => s.date === k).reduce((m, s) => m + s.minutes, 0));
  const max = Math.max(60, ...perDay);
  const totalMin = state.sessions.reduce((m, s) => m + s.minutes, 0);

  return (
    <Modal title="Focus Statistics" onClose={onClose}>
      <div className="stat-tiles">
        <div><strong>{todays.length}</strong><span>Tomatoes today</span></div>
        <div><strong>{todays.reduce((m, s) => m + s.minutes, 0)}</strong><span>Minutes today</span></div>
        <div><strong>{Math.round((totalMin / 60) * 10) / 10}</strong><span>Hours total</span></div>
      </div>
      <h4 className="stat-h">Last 7 days (minutes)</h4>
      <div className="bars">
        {days.map((k, i) => (
          <div key={k} className="bar-col">
            <span className="bar-val">{perDay[i] || ''}</span>
            <div className="bar" style={{ height: `${(perDay[i] / max) * 100}%` }} />
            <span className="bar-lbl">{WEEKDAYS[new Date(k + 'T00:00').getDay()]}</span>
          </div>
        ))}
      </div>
      <h4 className="stat-h">By activity</h4>
      {state.activities.map((a) => (
        <div key={a.id} className="stat-row">
          <span>{a.emoji} {a.name}</span>
          <span>🍅 {a.count}</span>
        </div>
      ))}
    </Modal>
  );
}
