// AvatarUpload.jsx
import React, { useRef } from "react";
import { Image } from "lucide-react";
import "./Onboarding.css";

export default function AvatarUpload({ image, onChange }) {
  const inputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      onChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      onChange(e.target.files[0]);
    }
  };

  return (
    <div
      className="avatar-upload"
      onClick={() => inputRef.current.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {image ? (
        <img
          src={URL.createObjectURL(image)}
          alt="Preview"
          className="avatar-preview"
        />
      ) : (
        <div className="avatar-placeholder">
          <Image size={32} />
          <span>Upload Profile Picture</span>
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
}