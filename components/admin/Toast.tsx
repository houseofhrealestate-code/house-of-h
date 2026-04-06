'use client';
import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

interface ToastContextType {
  flash: (msg: string, type?: 'success' | 'error') => void;
}

const ToastContext = createContext<ToastContextType>({ flash: () => {} });
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{ msg: string; type: string; key: number } | null>(null);
  const timerRef = useRef<NodeJS.Timeout>(undefined);

  const flash = useCallback((msg: string, type: string = 'success') => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ msg, type, key: Date.now() });
    timerRef.current = setTimeout(() => setToast(null), 3200);
  }, []);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <ToastContext.Provider value={{ flash }}>
      {children}
      {toast && (
        <div key={toast.key} className={`toast show ${toast.type}`}>
          <div className="toast__icon">
            {toast.type === 'success' ? (
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
            ) : (
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
            )}
          </div>
          <span className="toast__msg">{toast.msg}</span>
          <div className="toast__progress" />
        </div>
      )}
    </ToastContext.Provider>
  );
}
