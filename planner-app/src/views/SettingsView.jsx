import { useRef, useState } from 'react';
import { useConfirm } from '../components/Dialog';
import { useStore } from '../store';
import { todayKey } from '../dates';

// File downloads are blocked when the app runs inside a sandboxed frame (e.g. a hosted preview).
const embedded = (() => {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
})();

export default function SettingsView() {
  const { state, dispatch } = useStore();
  const fileRef = useRef(null);
  const confirm = useConfirm();
  const [backupText, setBackupText] = useState('');
  const [copied, setCopied] = useState(false);
  const setProfile = (value) => dispatch({ type: 'set', key: 'profile', value });
  const setSettings = (value) => dispatch({ type: 'set', key: 'settings', value });

  // Clipboard copy works everywhere; file download may be blocked in embedded frames.
  const copyBackup = async () => {
    const json = JSON.stringify(state);
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setBackupText(json); // fall back to a selectable text box
    }
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `planner-backup-${todayKey()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const importData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    file.text().then(async (txt) => {
      e.target.value = '';
      let data;
      try {
        data = JSON.parse(txt);
        if (!Array.isArray(data.tasks) || !Array.isArray(data.notes)) throw new Error('bad file');
      } catch {
        await confirm('This file is not a planner backup. Choose a .json file saved from "Copy backup" or "Download".', { alertOnly: true });
        return;
      }
      if (await confirm('Replace all current data with this backup?', { confirmLabel: 'Replace', danger: true })) {
        dispatch({ type: 'replaceAll', data });
      }
    });
  };

  const initial = (state.profile.name || '?').trim().charAt(0).toUpperCase();

  return (
    <div className="page settings">
      <h1 className="title">Settings</h1>

      <div className="profile-row">
        <span className="avatar static">{initial}</span>
        <input className="profile-name" value={state.profile.name} onChange={(e) => setProfile({ name: e.target.value })} aria-label="Your name" />
      </div>

      <div className="pro-banner">
        <span className="crown">👑</span>
        <div>
          <strong>Planner MVP</strong>
          <span>Free · data stored on this device</span>
        </div>
      </div>

      <div className="card setting-group">
        <h4>Focus</h4>
        <label className="setting">
          <span>Quick Focus length (min)</span>
          <input type="number" min="1" max="180" value={state.settings.focusMinutes}
            onChange={(e) => {
              const v = Math.min(180, Math.max(1, Number(e.target.value) || 1));
              setSettings({ focusMinutes: v });
              if (!state.timer.activityId && state.timer.status === 'idle') dispatch({ type: 'set', key: 'timer', value: { remaining: v * 60 } });
            }} />
        </label>
        <label className="setting">
          <span>Sound when a session ends</span>
          <input type="checkbox" checked={state.settings.sound} onChange={(e) => setSettings({ sound: e.target.checked })} />
        </label>
      </div>

      <div className="card setting-group">
        <h4>Data</h4>
        <div className="setting"><span>Tasks / Events / Notes</span><span>{state.tasks.length} / {state.events.length} / {state.notes.length}</span></div>
        <div className="setting-actions">
          <button className="btn soft" onClick={copyBackup}>{copied ? 'Copied' : 'Copy backup'}</button>
          {!embedded && <button className="btn soft" onClick={exportData}>Download</button>}
          <button className="btn soft" onClick={() => fileRef.current?.click()}>Import backup</button>
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={importData} />
          <button
            className="btn danger"
            onClick={async () => (await confirm('Reset all data to the sample set?', { confirmLabel: 'Reset', danger: true })) && dispatch({ type: 'reset' })}
          >
            Reset
          </button>
        </div>
        {backupText && (
          <label className="field backup-field">
            <span>Select all and copy this text to keep a backup</span>
            <textarea id="backup-text" rows={4} readOnly value={backupText} onFocus={(ev) => ev.target.select()} />
          </label>
        )}
      </div>

      <p className="version">Planner MVP v0.1.0</p>
    </div>
  );
}
