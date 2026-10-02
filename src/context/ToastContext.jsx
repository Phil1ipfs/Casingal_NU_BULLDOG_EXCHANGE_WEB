// src/context/ToastContext.jsx
// Lightweight toast notifications (replaces blocking alert() calls).
import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { FaCheckCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    const id = ++nextId.current;
    setToasts((prev) => [...prev.slice(-2), { id, message, type }]);
    setTimeout(() => dismiss(id), 3200);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-region" role="status" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast--${toast.type}`}>
            {toast.type === 'success' ? <FaCheckCircle aria-hidden="true" /> : <FaInfoCircle aria-hidden="true" />}
            <span>{toast.message}</span>
            <button type="button" className="toast__close" onClick={() => dismiss(toast.id)} aria-label="Dismiss notification">
              <FaTimes aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
