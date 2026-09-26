// Date helpers. All day keys are local-time 'YYYY-MM-DD' strings.
export const pad = (n) => String(n).padStart(2, '0');

export const toKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const fromKey = (key) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const todayKey = () => toKey(new Date());

export const addDays = (d, n) => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
};

export const addMonths = (d, n) => new Date(d.getFullYear(), d.getMonth() + n, 1);

export const startOfWeek = (d) => addDays(d, -d.getDay());

export const diffDays = (a, b) =>
  Math.round((fromKey(toKey(a)) - fromKey(toKey(b))) / 86400000);

export const dayOfYear = (d) => diffDays(d, new Date(d.getFullYear(), 0, 1)) + 1;

export const daysInYear = (y) => (new Date(y, 1, 29).getMonth() === 1 ? 366 : 365);

// ISO-8601 week number
export const weekNumber = (d) => {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return Math.ceil(((t - yearStart) / 86400000 + 1) / 7);
};

// 6x7 grid of Dates covering the month of `d`
export const monthGrid = (d) => {
  const first = new Date(d.getFullYear(), d.getMonth(), 1);
  const start = startOfWeek(first);
  return Array.from({ length: 42 }, (_, i) => addDays(start, i));
};

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
export const WEEKDAYS_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const shortLabel = (key) => {
  const d = fromKey(key);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
};

// "Today", "Tomorrow", "Yesterday" or "Sep 21"
export const relativeLabel = (key) => {
  const diff = diffDays(fromKey(key), new Date());
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  return shortLabel(key);
};
