// Step7_ReviewRequirements.jsx
import React from 'react';

export default function Step7_ReviewRequirements({ formData, goNext, goBack }) {
  const requirements = formData.requirements || [];

  return (
    <div className="vehicle-form">
      <h2 className="vehicle-heading">Review Requirements</h2>

      {requirements.length === 0 ? (
        <p>No requirements added.</p>
      ) : (
        <ul style={{ paddingLeft: '1rem' }}>
          {requirements.map((req, idx) => (
            <li key={idx}><strong>{req.icon}</strong>: {req.text}</li>
          ))}
        </ul>
      )}

      <div className="step-navigation">
        <button className="vehicle-button" onClick={goBack}>Back</button>
        <button className="vehicle-button" onClick={goNext}>Next</button>
      </div>
    </div>
  );
}
