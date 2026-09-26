import { createContext, useContext, useEffect, useReducer } from 'react';
import { addDays, toKey } from './dates';

const STORAGE_KEY = 'planner-mvp-v1';

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

// Franklin-style priority: letter (A=vital, B=important, C=optional) + order number
export const PRIORITIES = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3'];

export const EVENT_COLORS = ['#8fb3f5', '#4fb3dc', '#c3bdfc', '#f7a8a0', '#9ad9a8', '#ffd479'];

const seed = () => {
  const t = new Date();
  const k = (n) => toKey(addDays(t, n));
  return {
    profile: { name: 'Planner User' },
    settings: { focusMinutes: 25, breakMinutes: 5, sound: true },
    projects: [{ id: 'p1', name: '1조 달성' }],
    tasks: [
      { id: uid(), title: '고객 인증 서류 준비', priority: 'A1', due: k(-3), done: false, projectId: null, memo: '' },
      { id: uid(), title: '레진 재고 분석', priority: 'A2', due: k(-2), done: false, projectId: null, memo: '' },
      { id: uid(), title: '금형 기구물 분석', priority: 'B1', due: k(-1), done: false, projectId: null, memo: '' },
      { id: uid(), title: '원가 계산 검토', priority: 'B1', due: k(0), done: false, projectId: 'p1', memo: '' },
      { id: uid(), title: 'MRP 점검', priority: 'C1', due: k(2), done: false, projectId: null, memo: '' },
      { id: uid(), title: '성형기 매각 품의', priority: 'B2', due: k(2), done: false, projectId: 'p1', memo: '' },
      { id: uid(), title: '팀 조직도 및 업무분장', priority: 'B1', due: k(3), done: false, projectId: null, memo: '' },
      { id: uid(), title: '견적 제출', priority: 'B1', due: k(-4), done: true, projectId: 'p1', memo: '' },
    ],
    events: [
      { id: uid(), title: '연휴', date: k(0), allDay: true, start: '', end: '', color: EVENT_COLORS[2] },
      { id: uid(), title: '아침 기상', date: k(0), allDay: false, start: '05:30', end: '06:30', color: EVENT_COLORS[0] },
      { id: uid(), title: '주간 회의', date: k(1), allDay: false, start: '09:00', end: '10:00', color: EVENT_COLORS[1] },
    ],
    notes: [
      { id: uid(), title: '사업 아이디어 메모', body: '1. 아이디어 정리\n2. 시장 조사', updatedAt: Date.now() },
    ],
    activities: [
      { id: 'a1', name: 'Get a Tomato', emoji: '📝', minutes: 25, color: '#fdd0c0', count: 0 },
    ],
    sessions: [], // { id, activityId, date, minutes }
    timer: { activityId: null, status: 'idle', endAt: null, remaining: 25 * 60 },
  };
};

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...seed(), ...JSON.parse(raw) };
  } catch {
    /* fall through to seed data */
  }
  return seed();
};

const upsert = (list, item) =>
  list.some((x) => x.id === item.id) ? list.map((x) => (x.id === item.id ? { ...x, ...item } : x)) : [...list, item];

function reducer(state, action) {
  switch (action.type) {
    case 'save': // generic upsert: { coll, item }
      return { ...state, [action.coll]: upsert(state[action.coll], action.item) };
    case 'remove': // { coll, id }
      return { ...state, [action.coll]: state[action.coll].filter((x) => x.id !== action.id) };
    case 'toggleTask':
      return { ...state, tasks: state.tasks.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t)) };
    case 'set': // { key, value } for profile/settings/timer
      return { ...state, [action.key]: { ...state[action.key], ...action.value } };
    case 'completeFocus': {
      const { activityId, minutes } = action;
      return {
        ...state,
        activities: state.activities.map((a) => (a.id === activityId ? { ...a, count: a.count + 1 } : a)),
        sessions: [...state.sessions, { id: uid(), activityId, date: toKey(new Date()), minutes }],
      };
    }
    case 'replaceAll':
      return { ...seed(), ...action.data };
    case 'reset':
      return seed();
    default:
      return state;
  }
}

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage may be unavailable (private mode) */
    }
  }, [state]);
  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext);

export const comparePriority = (a, b) => PRIORITIES.indexOf(a) - PRIORITIES.indexOf(b);
