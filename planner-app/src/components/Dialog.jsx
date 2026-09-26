import { createContext, useCallback, useContext, useState } from 'react';
import Modal from './Modal';

// In-app replacement for window.confirm / window.alert, which some
// embedded contexts (e.g. sandboxed frames) silently block.
const DialogContext = createContext(null);

export function DialogProvider({ children }) {
  const [dlg, setDlg] = useState(null);

  const open = useCallback(
    (message, { confirmLabel = 'OK', danger = false, alertOnly = false } = {}) =>
      new Promise((resolve) => setDlg({ message, confirmLabel, danger, alertOnly, resolve })),
    []
  );
  const close = (result) => {
    dlg.resolve(result);
    setDlg(null);
  };

  return (
    <DialogContext.Provider value={open}>
      {children}
      {dlg && (
        <Modal
          title={dlg.alertOnly ? 'Notice' : 'Please confirm'}
          onClose={() => close(false)}
          footer={
            <>
              <span className="spacer" />
              {!dlg.alertOnly && <button className="btn ghost" onClick={() => close(false)}>Cancel</button>}
              <button className={`btn ${dlg.danger ? 'danger-solid' : 'primary'}`} autoFocus onClick={() => close(true)}>
                {dlg.confirmLabel}
              </button>
            </>
          }
        >
          <p className="dialog-msg">{dlg.message}</p>
        </Modal>
      )}
    </DialogContext.Provider>
  );
}

// const confirm = useConfirm(); if (await confirm('Delete?', { danger: true })) …
export const useConfirm = () => useContext(DialogContext);
