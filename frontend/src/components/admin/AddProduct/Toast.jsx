import React, { useEffect } from "react";
import "./Toast.css";

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast ${type}`}>
      <span className="toast-icon">
        {type === "success" ? (
          <svg width="22" height="22" viewBox="0 0 24 24" stroke="#45ad6d" strokeWidth="2" fill="none">
            <path d="M5 13l4 4L19 7" stroke="#45ad6d" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" stroke="#e36b6b" strokeWidth="2" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#e36b6b" />
            <path d="M15 9l-6 6M9 9l6 6" stroke="#e36b6b" strokeLinecap="round" />
          </svg>
        )}
      </span>
      <span className="toast-msg">{message}</span>
      <button className="toast-close" onClick={onClose}>&times;</button>
    </div>
  );
}
