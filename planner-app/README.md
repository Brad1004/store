# Planner MVP

A Planner-Pro-style personal planner (Calendar · Tasks · Notes · Focus) built with React + Vite.
All data is stored in the browser (localStorage) — no server or login needed.

## Features
| Screen | What it does |
| --- | --- |
| **Calendar** | Day / Week / Month views, mini month with item dots, day card (day-of-year, days left, ISO week, daily quote), hourly timeline with all-day row and "now" line, open-task agenda (overdue in red), month/year strip. `+` adds an event. |
| **Tasks** | Smart lists **Inbox / Today / Due Soon (3 days)** with open/total counters, Projects, Franklin-style priority (A1–C3), sort by Due Date / Priority / Alphabet, show/clear completed. |
| **Notes** | Notes grouped by month, auto-saving editor, master/detail on phones. |
| **Focus** | Pomodoro timer with progress ring, custom activities (name, emoji, minutes, color) and 🍅 counters, 7-day statistics. The timer keeps running across screens and reloads; beep + browser notification on completion. |
| **Search** | Full-text search over tasks, events and notes. |
| **Settings** | Profile name, Quick Focus length, sound, JSON backup export/import, reset. |

Responsive: left rail on tablet/desktop (like the reference on a Galaxy Fold), bottom tab bar on phones. Installable as a PWA (manifest included).

## Run
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static files in dist/ (deploy to Netlify, Vercel, GitHub Pages…)
```

## Structure
```
src/
  store.jsx        # state (useReducer + localStorage), seed data, priorities
  dates.js         # date helpers (day keys, week number, month grid)
  App.jsx          # shell, navigation, background focus-timer watcher
  components/      # Sidebar, Modal, Fab, TaskRow, Task/Event editors, Icons
  views/           # Calendar, Tasks, Notes, Focus, Search, Settings
```

## Next steps (post-MVP)
- Cloud sync + login (e.g. Supabase / Firebase) for multi-device use
- Recurring events/tasks, reminders (push notifications)
- Google Calendar import, drag-to-reschedule on the timeline
- Wrap as Android app (Capacitor) for Play Store distribution
