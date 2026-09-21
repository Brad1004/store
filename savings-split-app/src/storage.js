const STORAGE_KEY = 'savings-split-app-data';

export const ICONS = ['🏠', '📺', '💍', '✈️', '🚗', '🎓', '💻', '🐶', '🎁', '💰'];
export const COLORS = ['#5B4FE9', '#FF6B6B', '#2FBF71', '#FFA630', '#00B4D8', '#C44FE9', '#FF8FA3'];

export const LEVELS = [
  { level: 1, name: '저축 새싹', min: 0 },
  { level: 2, name: '저축 도전자', min: 500000 },
  { level: 3, name: '저축 마스터', min: 3000000 },
  { level: 4, name: '저축 고수', min: 10000000 },
  { level: 5, name: '저축의 신', min: 30000000 },
];

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData();
    const parsed = JSON.parse(raw);
    return {
      monthlyIncome: parsed.monthlyIncome || 0,
      goals: Array.isArray(parsed.goals) ? parsed.goals : [],
      streak: parsed.streak || 0,
      lastRunMonth: parsed.lastRunMonth || null,
    };
  } catch (e) {
    return defaultData();
  }
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    // ignore write failures (e.g. private mode / storage full)
  }
}

function defaultData() {
  return {
    monthlyIncome: 0,
    goals: [],
    streak: 0,
    lastRunMonth: null,
  };
}

export function currentMonthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function previousMonthKey(monthKey) {
  const [y, m] = monthKey.split('-').map(Number);
  const d = new Date(y, m - 2, 1);
  return currentMonthKey(d);
}

export function getLevel(totalSaved) {
  let current = LEVELS[0];
  for (const lvl of LEVELS) {
    if (totalSaved >= lvl.min) current = lvl;
  }
  const idx = LEVELS.findIndex((l) => l.level === current.level);
  const next = LEVELS[idx + 1];
  return { current, next };
}

export function formatWon(n) {
  const num = Math.round(Number(n) || 0);
  return num.toLocaleString('ko-KR') + '원';
}
