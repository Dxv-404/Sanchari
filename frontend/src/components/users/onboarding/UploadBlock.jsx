// UploadBlock.jsx
import React, { useRef } from "react";
import { Upload, X } from "lucide-react";
import "./Onboarding.css";

export default function UploadBlock({ label, value, onChange, disabled }) {
  const inputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) onChange(file);
  };

  const handleClick = () => {
    if (!disabled) inputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) onChange(e.target.files[0]);
  };

  return (
    <div className="upload-block" onClick={handleClick} onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
      {value ? (
        <div className="upload-preview">
          <img
            src={URL.createObjectURL(value)}
            alt="Uploaded"
            className="upload-preview-img"
          />
          <X size={18} className="upload-clear" onClick={(e) => { e.stopPropagation(); onChange(null); }} />
        </div>
      ) : (
        <div className="upload-placeholder">
          <Upload size={24} />
          <span>{label}</span>
        </div>
      )}
      <input
        type="file"
        accept="image/*,.pdf"
        disabled={disabled}
        ref={inputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
} 