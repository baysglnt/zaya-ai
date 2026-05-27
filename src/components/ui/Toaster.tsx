"use client";
import { useState, createContext, useContext, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, AlertCircle } from "lucide-react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

const ToastContext = createContext<{ show: (message: string, type?: Toast["type"]) => void }>({
  show: () => {},
});

export function useToast() { return useContext(ToastContext); }

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      <div className="fixed bottom-4 right-4 z-50 space-y-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60 }}
              className="glass-card px-4 py-3 flex items-center gap-3 pointer-events-auto min-w-48"
              style={{
                border: `1px solid ${toast.type === "success" ? "rgba(16,185,129,0.4)" : toast.type === "error" ? "rgba(239,68,68,0.4)" : "rgba(109,63,245,0.4)"}`,
              }}
            >
              {toast.type === "success" ? <Check size={16} className="text-green-400" /> : <AlertCircle size={16} className="text-red-400" />}
              <span className="text-sm text-white">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
