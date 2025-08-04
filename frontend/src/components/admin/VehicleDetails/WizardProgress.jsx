// WizardProgress.jsx
import React from 'react';
import './VehicleDetails.css';

export default function WizardProgress({ current, total }) {
  const dots = Array.from({ length: total }, (_, i) => i);

  return (
    <div className="dot-nav">
      {dots.map((dot) => (
        <div
          key={dot}
          className={`dot ${dot === current ? 'active' : ''}`}
        />
      ))}
    </div>
  );
}
