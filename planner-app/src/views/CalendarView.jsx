import { useEffect, useMemo, useRef, useState } from 'react';
import { useStore, comparePriority } from '../store';
import {
  toKey, fromKey, todayKey, addDays, addMonths, startOfWeek, monthGrid, dayOfYear, daysInYear,
  weekNumber, MONTHS, WEEKDAYS, WEEKDAYS_LONG,
} from '../dates';
import TaskRow from '../components/TaskRow';
import Fab from '../components/Fab';
import { TaskEditor, EventEditor } from '../components/Editors';

const QUOTES = [
  ['The secret of getting ahead is getting started.', 'Mark Twain'],
  ['Well begun is half done.', 'Aristotle'],
  ['Quality is not an act, it is a habit.', 'Aristotle'],
  ['What gets measured gets managed.', 'Peter Drucker'],
  ['Focus on being productive instead of busy.', 'Tim Ferriss'],
  ['Small daily improvements are the key to staggering long-term results.', 'Robin Sharma'],
  ['Plans are nothing; planning is everything.', 'Dwight D. Eisenhower'],
];

const HOUR_PX = 60;
const toMin = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

export default function CalendarView() {
  const { state } = useStore();
  const [mode, setMode] = useState('day');
  const [selected, setSelected] = useState(todayKey());
  const [editTask, setEditTask] = useState(null); // task object or 'new'
  const [editEvent, setEditEvent] = useState(null); // event object or 'new'

  const sel = fromKey(selected);
  const today = todayKey();

  const eventsOn = (key) =>
    state.events
      .filter((e) => e.date === key)
      .sort((a, b) => (a.allDay === b.allDay ? (a.start || '').localeCompare(b.start || '') : a.allDay ? -1 : 1));
  const tasksOn = (key) => state.tasks.filter((t) => t.due === key);

  // Left list: open tasks due on/before the selected day (overdue first), like the reference app
  const agenda = useMemo(
    () =>
      state.tasks
        .filter((t) => !t.done && t.due && t.due <= selected)
        .sort((a, b) => a.due.localeCompare(b.due) || comparePriority(a.priority, b.priority)),
    [state.tasks, selected]
  );

  const pick = (d) => setSelected(toKey(d));
  const shift = (n) => {
    if (mode === 'day') pick(addDays(sel, n));
    else if (mode === 'week') pick(addDays(sel, 7 * n));
    else pick(addMonths(sel, n));
  };

  return (
    <div className="page calendar-page">
      <header className="cal-head">
        <h1 className="title">
          {MONTHS[sel.getMonth()]} <small>{sel.getFullYear()}</small>
        </h1>
        <div className="segmented">
          {['day', 'week', 'month'].map((m) => (
            <button key={m} className={mode === m ? 'on' : ''} onClick={() => setMode(m)}>
              {m[0].toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
        <div className="cal-nav">
          <button className="icon-btn" onClick={() => shift(-1)} aria-label="Previous">‹</button>
          <button className="today-btn" onClick={() => setSelected(today)} title="Go to today">
            {new Date().getDate()}
          </button>
          <button className="icon-btn" onClick={() => shift(1)} aria-label="Next">›</button>
        </div>
      </header>

      {mode === 'day' && (
        <div className="split">
          <div className="col">
            <MiniMonth selected={sel} onPick={pick} hasItems={(k) => eventsOn(k).length + tasksOn(k).length > 0} />
            <div className="card list-card">
              {agenda.length === 0 && <p className="empty">No open tasks 🎉</p>}
              {agenda.map((t) => <TaskRow key={t.id} task={t} onOpen={setEditTask} />)}
            </div>
          </div>
          <div className="col">
            <DayCard date={sel} />
            <Timeline date={selected} events={eventsOn(selected)} onOpen={setEditEvent} />
          </div>
        </div>
      )}

      {mode === 'week' && (
        <WeekGrid
          sel={sel}
          eventsOn={eventsOn}
          tasksOn={tasksOn}
          onPick={(d) => { pick(d); setMode('day'); }}
          onOpenEvent={setEditEvent}
          onOpenTask={setEditTask}
        />
      )}

      {mode === 'month' && (
        <MonthGrid sel={sel} eventsOn={eventsOn} tasksOn={tasksOn} onPick={(d) => { pick(d); setMode('day'); }} />
      )}

      <div className="month-strip">
        <button className="year" onClick={() => pick(new Date(sel.getFullYear() - 1, sel.getMonth(), 1))}>
          {sel.getFullYear() - 1}
        </button>
        <span className="bar" />
        {MONTHS.map((m, i) => (
          <button
            key={m}
            className={i === sel.getMonth() ? 'on' : ''}
            onClick={() => pick(new Date(sel.getFullYear(), i, 1))}
          >
            {m}
          </button>
        ))}
        <span className="bar" />
        <button className="year" onClick={() => pick(new Date(sel.getFullYear() + 1, sel.getMonth(), 1))}>
          {sel.getFullYear() + 1}
        </button>
      </div>

      <Fab onClick={() => setEditEvent('new')} label="New event" />

      {editTask && (
        <TaskEditor task={editTask === 'new' ? null : editTask} defaults={{ due: selected }} onClose={() => setEditTask(null)} />
      )}
      {editEvent && (
        <EventEditor event={editEvent === 'new' ? null : editEvent} date={selected} onClose={() => setEditEvent(null)} />
      )}
    </div>
  );
}

function MiniMonth({ selected, onPick, hasItems }) {
  const today = todayKey();
  const month = selected.getMonth();
  const days = monthGrid(selected);
  // Drop the trailing week if it's entirely next month
  const weeks = days.slice(35).every((d) => d.getMonth() !== month) ? days.slice(0, 35) : days;
  return (
    <div className="card mini-month">
      {WEEKDAYS.map((w, i) => <span key={i} className="wd">{w}</span>)}
      {weeks.map((d) => {
        const k = toKey(d);
        const inMonth = d.getMonth() === month;
        const weekend = d.getDay() === 0 || d.getDay() === 6;
        return (
          <button
            key={k}
            className={[
              'md',
              !inMonth && 'out',
              weekend && 'weekend',
              k === today && 'today',
              k === toKey(selected) && 'sel',
            ].filter(Boolean).join(' ')}
            onClick={() => onPick(d)}
          >
            {inMonth ? d.getDate() : ''}
            {inMonth && hasItems(k) && <i className="dot" />}
          </button>
        );
      })}
    </div>
  );
}

function DayCard({ date }) {
  const doy = dayOfYear(date);
  const left = daysInYear(date.getFullYear()) - doy;
  const [q, who] = QUOTES[doy % QUOTES.length];
  return (
    <div className="card day-card">
      <div className="day-top">
        <span className="big-day">{date.getDate()}</span>
        <div>
          <div className="weekday">{WEEKDAYS_LONG[date.getDay()]}</div>
          <div className="doy">
            {doy}TH DAY, {left} LEFT, WEEK {weekNumber(date)}
          </div>
        </div>
      </div>
      <blockquote>“{q}”</blockquote>
      <cite>-{who}</cite>
    </div>
  );
}

function Timeline({ date, events, onOpen }) {
  const ref = useRef(null);
  const allDay = events.filter((e) => e.allDay);
  const timed = events.filter((e) => !e.allDay && e.start);
  const isToday = date === todayKey();
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();

  useEffect(() => {
    // Scroll to the first event, or to "now", or to 6am
    const first = timed[0] ? toMin(timed[0].start) : isToday ? nowMin : 360;
    if (ref.current) ref.current.scrollTop = Math.max(0, (first / 60) * HOUR_PX - HOUR_PX);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  return (
    <div className="card timeline-card">
      {allDay.length > 0 && (
        <div className="allday">
          <span className="allday-label">All-day</span>
          <div className="allday-list">
            {allDay.map((e) => (
              <button key={e.id} className="event-chip" style={{ background: e.color }} onClick={() => onOpen(e)}>
                {e.title}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="timeline" ref={ref}>
        <div className="hours" style={{ height: 24 * HOUR_PX }}>
          {Array.from({ length: 24 }, (_, h) => (
            <div key={h} className="hour" style={{ top: h * HOUR_PX }}>
              <span>{h}</span>
            </div>
          ))}
          {isToday && <div className="now-line" style={{ top: (nowMin / 60) * HOUR_PX }} />}
          {timed.map((e) => {
            const s = toMin(e.start);
            const end = e.end ? toMin(e.end) : s + 60;
            return (
              <button
                key={e.id}
                className="event-block"
                style={{ top: (s / 60) * HOUR_PX, height: Math.max(26, ((end - s) / 60) * HOUR_PX - 4), background: e.color }}
                onClick={() => onOpen(e)}
              >
                <strong>{e.title}</strong>
                <span>{e.start}{e.end && ` – ${e.end}`}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function WeekGrid({ sel, eventsOn, tasksOn, onPick, onOpenEvent, onOpenTask }) {
  const start = startOfWeek(sel);
  const today = todayKey();
  return (
    <div className="week-grid">
      {Array.from({ length: 7 }, (_, i) => {
        const d = addDays(start, i);
        const k = toKey(d);
        return (
          <div key={k} className={`week-col card ${k === today ? 'is-today' : ''}`}>
            <button className="week-head" onClick={() => onPick(d)}>
              <span>{WEEKDAYS_LONG[d.getDay()].slice(0, 3)}</span>
              <strong>{d.getDate()}</strong>
            </button>
            {eventsOn(k).map((e) => (
              <button key={e.id} className="event-chip" style={{ background: e.color }} onClick={() => onOpenEvent(e)}>
                {!e.allDay && <small>{e.start} </small>}{e.title}
              </button>
            ))}
            {tasksOn(k).map((t) => (
              <button key={t.id} className={`week-task ${t.done ? 'done' : ''}`} onClick={() => onOpenTask(t)}>
                {t.done ? '☑' : '☐'} {t.title}
              </button>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function MonthGrid({ sel, eventsOn, tasksOn, onPick }) {
  const today = todayKey();
  const month = sel.getMonth();
  return (
    <div className="card month-grid">
      {WEEKDAYS.map((w, i) => <span key={i} className="wd">{w}</span>)}
      {monthGrid(sel).map((d) => {
        const k = toKey(d);
        const items = [
          ...eventsOn(k).map((e) => ({ id: e.id, label: e.title, color: e.color })),
          ...tasksOn(k).map((t) => ({ id: t.id, label: `${t.done ? '☑' : '☐'} ${t.title}`, color: 'transparent', done: t.done })),
        ];
        return (
          <button
            key={k}
            className={`mcell ${d.getMonth() !== month ? 'out' : ''} ${k === today ? 'today' : ''}`}
            onClick={() => onPick(d)}
          >
            <span className="mnum">{d.getDate()}</span>
            {items.slice(0, 3).map((it) => (
              <span key={it.id} className={`mitem ${it.done ? 'done' : ''}`} style={{ background: it.color }}>
                {it.label}
              </span>
            ))}
            {items.length > 3 && <span className="more">+{items.length - 3}</span>}
          </button>
        );
      })}
    </div>
  );
}
