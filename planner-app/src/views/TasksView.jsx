import { useMemo, useState } from 'react';
import { useStore, uid, comparePriority } from '../store';
import { todayKey, toKey, addDays, shortLabel } from '../dates';
import TaskRow from '../components/TaskRow';
import Fab from '../components/Fab';
import { TaskEditor } from '../components/Editors';
import { TrashIcon } from '../components/Icons';

const SORTS = [
  { id: 'due', label: 'Due Date' },
  { id: 'priority', label: 'Priority' },
  { id: 'alpha', label: 'Alphabet' },
];

export default function TasksView() {
  const { state, dispatch } = useStore();
  const [listId, setListId] = useState('inbox');
  const [sort, setSort] = useState('due');
  const [showDone, setShowDone] = useState(false);
  const [editing, setEditing] = useState(null);
  const [newProject, setNewProject] = useState('');

  const today = todayKey();
  const soonEnd = toKey(addDays(new Date(), 3));

  const lists = useMemo(() => {
    const all = state.tasks;
    const todayList = all.filter((t) => t.due && t.due <= today && (!t.done || t.due === today));
    const soon = all.filter((t) => t.due && t.due > today && t.due <= soonEnd);
    const res = {
      inbox: { name: 'Inbox', items: all },
      today: { name: 'Today', items: todayList },
      soon: { name: 'Due Soon', items: soon },
    };
    state.projects.forEach((p) => {
      res[p.id] = { name: p.name, items: all.filter((t) => t.projectId === p.id), project: p };
    });
    return res;
  }, [state.tasks, state.projects, today, soonEnd]);

  const current = lists[listId] || lists.inbox;
  const openCount = (l) => l.items.filter((t) => !t.done).length;

  const visible = useMemo(() => {
    const items = current.items.filter((t) => showDone || !t.done);
    const cmp = {
      due: (a, b) => (b.due || '').localeCompare(a.due || '') || comparePriority(a.priority, b.priority),
      priority: (a, b) => comparePriority(a.priority, b.priority) || (a.due || '').localeCompare(b.due || ''),
      alpha: (a, b) => a.title.localeCompare(b.title, 'ko'),
    }[sort];
    return [...items].sort(cmp);
  }, [current, sort, showDone]);

  // Group by due date when sorted by due date, as in the reference app
  const groups = useMemo(() => {
    if (sort !== 'due') return [{ key: 'all', label: null, items: visible }];
    const map = new Map();
    visible.forEach((t) => {
      const k = t.due || 'none';
      if (!map.has(k)) map.set(k, []);
      map.get(k).push(t);
    });
    return [...map].map(([k, items]) => ({ key: k, label: k === 'none' ? 'No date' : shortLabel(k), items }));
  }, [visible, sort]);

  const addProject = (e) => {
    e.preventDefault();
    const name = newProject.trim();
    if (!name) return;
    const id = uid();
    dispatch({ type: 'save', coll: 'projects', item: { id, name } });
    setNewProject('');
    setListId(id);
  };

  const deleteProject = (p) => {
    if (!window.confirm(`Delete project "${p.name}"? Its tasks move to Inbox.`)) return;
    state.tasks
      .filter((t) => t.projectId === p.id)
      .forEach((t) => dispatch({ type: 'save', coll: 'tasks', item: { ...t, projectId: null } }));
    dispatch({ type: 'remove', coll: 'projects', id: p.id });
    setListId('inbox');
  };

  const clearDone = () => {
    const done = current.items.filter((t) => t.done);
    if (!done.length || !window.confirm(`Delete ${done.length} completed task(s)?`)) return;
    done.forEach((t) => dispatch({ type: 'remove', coll: 'tasks', id: t.id }));
  };

  const Counter = ({ l, total }) => (
    <span className="count">
      <em>{openCount(l)}</em>
      {total && `/${l.items.length}`}
    </span>
  );

  return (
    <div className="page">
      <div className="split">
        <div className="col">
          <h1 className="title">Tasks</h1>
          <button className={`smart-card inbox ${listId === 'inbox' ? 'on' : ''}`} onClick={() => setListId('inbox')}>
            <span className="sc-icon">⬇</span>
            <Counter l={lists.inbox} total />
            <span className="sc-name">Inbox</span>
          </button>
          <div className="smart-row">
            <button className={`smart-card today ${listId === 'today' ? 'on' : ''}`} onClick={() => setListId('today')}>
              <span className="sc-icon">▣</span>
              <Counter l={lists.today} total />
              <span className="sc-name">Today</span>
            </button>
            <button className={`smart-card soon ${listId === 'soon' ? 'on' : ''}`} onClick={() => setListId('soon')}>
              <span className="sc-icon">◷</span>
              <Counter l={lists.soon} />
              <span className="sc-name">Due Soon</span>
            </button>
          </div>

          <h2 className="subtitle">Projects</h2>
          <div className="card projects">
            {state.projects.map((p) => (
              <div key={p.id} className={`project ${listId === p.id ? 'on' : ''}`}>
                <button className="project-name" onClick={() => setListId(p.id)}>
                  {p.name}
                  <span className="count">{openCount(lists[p.id])}</span>
                </button>
                <button className="icon-btn subtle" onClick={() => deleteProject(p)} aria-label={`Delete ${p.name}`}>
                  <TrashIcon size={18} />
                </button>
              </div>
            ))}
            <form className="add-project" onSubmit={addProject}>
              <span className="plus-dot">+</span>
              <input value={newProject} onChange={(e) => setNewProject(e.target.value)} placeholder="Add a Project" />
            </form>
          </div>
        </div>

        <div className="col">
          <div className="card list-pane">
            <div className="list-head">
              <h2>{current.name}</h2>
              <button className="link" onClick={clearDone}>Clear done</button>
            </div>
            <div className="chips">
              {SORTS.map((s) => (
                <button key={s.id} className={`chip ${sort === s.id ? 'on' : ''}`} onClick={() => setSort(s.id)}>
                  {s.label}
                </button>
              ))}
              <label className="chip toggle">
                <input type="checkbox" checked={showDone} onChange={(e) => setShowDone(e.target.checked)} /> Done
              </label>
            </div>
            <div className="list-scroll">
              {visible.length === 0 && <p className="empty">Nothing here. Tap + to add a task.</p>}
              {groups.map((g) => (
                <section key={g.key}>
                  {g.label && <h4 className={`group-label ${g.key !== 'none' && g.key < today ? 'overdue' : ''}`}>{g.label}</h4>}
                  {g.items.map((t) => <TaskRow key={t.id} task={t} onOpen={setEditing} />)}
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Fab onClick={() => setEditing('new')} label="New task" />
      {editing && (
        <TaskEditor
          task={editing === 'new' ? null : editing}
          defaults={current.project ? { projectId: current.project.id } : {}}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
