// Minimal stroke icons (24x24), drawn to match the reference app's line style.
const S = ({ children, size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

export const CalendarIcon = (p) => (
  <S {...p}><rect x="3" y="4" width="18" height="17" rx="1" /><path d="M3 9h18" /><rect x="13" y="13" width="4" height="4" fill="currentColor" /></S>
);
export const TaskIcon = (p) => (
  <S {...p}><path d="M14 3H4v18h16V9" /><path d="m8 13 3 3 5-6" /></S>
);
export const NoteIcon = (p) => (
  <S {...p}><path d="M4 3h16v12l-6 6H4z" /><path d="M8 8h8M8 12h5M14 21v-6h6" /></S>
);
export const FocusIcon = (p) => (
  <S {...p}><circle cx="12" cy="13" r="8" /><path d="M8 5c1 2 3 2 4 0 1 2 3 2 4 0M9 14c1.5 1.5 4.5 1.5 6 0" /></S>
);
export const SearchIcon = (p) => (
  <S {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></S>
);
export const SettingsIcon = (p) => (
  <S {...p}><path d="M12 2 21 7v10l-9 5-9-5V7z" /><circle cx="12" cy="12" r="3" /></S>
);
export const PlusIcon = (p) => (
  <S {...p}><path d="M12 5v14M5 12h14" /></S>
);
export const StatsIcon = (p) => (
  <S {...p}><rect x="4" y="4" width="4" height="16" rx="2" /><rect x="10" y="10" width="4" height="10" rx="2" /><rect x="16" y="10" width="4" height="10" rx="2" /></S>
);
export const TrashIcon = (p) => (
  <S {...p}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></S>
);
export const BackIcon = (p) => (
  <S {...p}><path d="M19 12H5M11 5l-7 7 7 7" /></S>
);
export const ChevronIcon = (p) => (
  <S {...p}><path d="m9 6 6 6-6 6" /></S>
);
