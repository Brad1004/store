import { useEffect, useState } from 'react';
import { StoreProvider, useStore } from './store';
import Sidebar from './components/Sidebar';
import CalendarView from './views/CalendarView';
import TasksView from './views/TasksView';
import NotesView from './views/NotesView';
import FocusView, { timeLeft } from './views/FocusView';
import SearchView from './views/SearchView';
import SettingsView from './views/SettingsView';

const beep = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [0, 0.35, 0.7].forEach((t) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = 880;
      g.gain.setValueAtTime(0.2, ctx.currentTime + t);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.3);
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + t);
      o.stop(ctx.currentTime + t + 0.3);
    });
  } catch {
    /* audio not available */
  }
};

// Completes the focus timer even when the Focus screen isn't open.
function FocusWatcher() {
  const { state, dispatch } = useStore();
  const { timer, activities, settings } = state;

  useEffect(() => {
    if (timer.status !== 'running') return;
    const id = setInterval(() => {
      if (timeLeft(timer) > 0) return;
      const activity = activities.find((a) => a.id === timer.activityId);
      const minutes = activity ? activity.minutes : settings.focusMinutes;
      dispatch({ type: 'completeFocus', activityId: timer.activityId, minutes });
      dispatch({ type: 'set', key: 'timer', value: { status: 'idle', endAt: null, remaining: minutes * 60 } });
      if (settings.sound) beep();
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        new Notification('Focus complete 🍅', { body: `${activity ? activity.name : 'Quick Focus'} · ${minutes} min` });
      }
    }, 500);
    return () => clearInterval(id);
  }, [timer, activities, settings, dispatch]);

  return null;
}

function Shell() {
  const [view, setView] = useState('calendar');
  const [noteId, setNoteId] = useState(null);

  const openNote = (id) => {
    setNoteId(id);
    setView('notes');
  };

  return (
    <div className="app">
      <Sidebar view={view} onChange={(v) => { setNoteId(null); setView(v); }} />
      <main className="main">
        {view === 'calendar' && <CalendarView />}
        {view === 'tasks' && <TasksView />}
        {view === 'notes' && <NotesView key={noteId} initialId={noteId} />}
        {view === 'focus' && <FocusView />}
        {view === 'search' && <SearchView onOpenNote={openNote} />}
        {view === 'settings' && <SettingsView />}
      </main>
      <FocusWatcher />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}
