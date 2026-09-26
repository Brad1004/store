import { PlusIcon } from './Icons';

export default function Fab({ onClick, label = 'Add' }) {
  return (
    <button className="fab" onClick={onClick} aria-label={label} title={label}>
      <PlusIcon size={34} />
    </button>
  );
}
