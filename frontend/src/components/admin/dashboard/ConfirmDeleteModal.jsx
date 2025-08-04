import React from "react";

export default function ConfirmDeleteModal({ open, product, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="cd-modal-overlay">
      <div className="cd-modal">
        <div className="cd-modal-icon">
          {/* Delete/alert icon */}
          <svg width="36" height="36" viewBox="0 0 24 24" stroke="#232323" fill="none" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M9 9l6 6M15 9l-6 6" stroke="#E34A4A" strokeWidth="2.2"/>
          </svg>
        </div>
        <div className="cd-modal-title">Delete Product?</div>
        <div className="cd-modal-desc">
          Are you sure you want to delete <b>{product?.name}</b>? This action cannot be undone.
        </div>
        <div className="cd-modal-actions">
          <button className="cd-modal-btn" onClick={onCancel}>Cancel</button>
          <button className="cd-modal-btn danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}
