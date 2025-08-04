import React from "react";
import "./ExitWarningPopup.css";

export default function ExitWarningPopup({ onConfirm, onCancel }) {
  return (
    <div className="exit-modal-overlay">
      <div className="exit-modal">
        <div className="exit-modal-icon">⚠️</div>
        <div className="exit-modal-title">Unsaved Changes</div>
        <div className="exit-modal-desc">
          Are you sure you want to leave? Your changes will be lost.
        </div>
        <div className="exit-modal-actions">
          <button className="exit-modal-btn danger" onClick={onConfirm}>Leave</button>
          <button className="exit-modal-btn" onClick={onCancel}>Stay</button>
        </div>
      </div>
    </div>
  );
}
