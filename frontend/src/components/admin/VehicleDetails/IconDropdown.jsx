// IconDropdown.jsx
import React, { useState, useRef, useEffect } from 'react';
import { ICON_OPTIONS } from './icons';
import './VehicleDetails.css';

export default function IconDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const selected = ICON_OPTIONS.find((opt) => opt.key === value);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="icon-dropdown" ref={dropdownRef}>
      <div className="icon-dropdown-toggle" onClick={() => setOpen(!open)}>
        {selected?.icon}
        <span>{selected?.label || 'Select icon'}</span>
      </div>
      {open && (
        <div className="icon-dropdown-menu">
          {ICON_OPTIONS.map((opt) => (
            <div
              key={opt.key}
              className={`icon-dropdown-item ${opt.key === value ? 'selected' : ''}`}
              onClick={() => {
                onChange(opt.key);
                setOpen(false);
              }}
            >
              {opt.icon}
              <span>{opt.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
