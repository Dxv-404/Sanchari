import React, { useRef } from "react";
import "./ImageUploader.css";

export default function ImageUploader({ image, setImage }) {
  const inputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImage(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div
      className="image-uploader"
      onClick={() => inputRef.current.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {image ? (
        <img
          src={URL.createObjectURL(image)}
          alt="Preview"
          className="image-preview"
        />
      ) : (
        <div className="image-placeholder">Click or drag an image here</div>
      )}
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
}
