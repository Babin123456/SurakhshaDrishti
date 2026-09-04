import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

function ToastItem({ toast, onRemove }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);
  const remainingTimeRef = useRef(toast.duration || 3500);
  const startTimeRef = useRef(null);

  // Trigger smooth entrance transition right after mount
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsMounted(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const startDismissTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      setIsExiting(true);
      // Wait for exit transition (400ms) before removing from state
      setTimeout(() => {
        onRemove(toast.id);
      }, 400);
    }, remainingTimeRef.current);
  }, [onRemove, toast.id]);

  const pauseDismissTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (startTimeRef.current) {
      const elapsed = Date.now() - startTimeRef.current;
      remainingTimeRef.current = Math.max(remainingTimeRef.current - elapsed, 1000);
    }
  }, []);

  useEffect(() => {
    if (!isHovered && !isExiting && isMounted) {
      startDismissTimer();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isHovered, isExiting, isMounted, startDismissTimer]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    pauseDismissTimer();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleManualClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 400);
  };

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';
  const isWarning = toast.type === 'warning';

  const bgClass = isSuccess 
    ? 'bg-[#EBF7EE] border-[#2D7A4F]/30 text-[#2D7A4F]' 
    : isError 
    ? 'bg-[#FFF5F2] border-[#FADED4] text-[#B85C38]' 
    : isWarning 
    ? 'bg-[#FFFBEB] border-[#FDE68A] text-[#92400E]'
    : 'bg-white border-[#E8E1D5] text-[#1A1A1A]';

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-2xl border shadow-lg backdrop-blur-md text-xs font-semibold transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
        isExiting || !isMounted
          ? 'opacity-0 translate-x-full scale-95' 
          : 'opacity-100 translate-x-0 scale-100'
      } ${bgClass}`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {isSuccess && <CheckCircle2 className="w-4 h-4 shrink-0 text-[#2D7A4F]" />}
        {isError && <AlertTriangle className="w-4 h-4 shrink-0 text-[#B85C38]" />}
        {isWarning && <AlertTriangle className="w-4 h-4 shrink-0 text-[#D97706]" />}
        {!isSuccess && !isError && !isWarning && <Info className="w-4 h-4 shrink-0 text-[#8B7355]" />}
        <span className="truncate">{toast.message}</span>
      </div>
      <button
        type="button"
        onClick={handleManualClose}
        className="opacity-70 hover:opacity-100 p-1 transition-opacity cursor-pointer shrink-0"
        title="Dismiss Notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast Render Container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-3">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      addToast: () => {},
      removeToast: () => {}
    };
  }
  return context;
}
