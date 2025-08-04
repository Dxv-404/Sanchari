// Step1_SuccessStart.jsx
import React from 'react';

export default function Step1_SuccessStart({ goNext }) {
  return (
    <div className="vehicle-form">
      <h2 className="vehicle-heading">Product Created Successfully</h2>
      <p style={{ textAlign: 'center', marginBottom: '2rem' }}>
        Let's finish setting up your vehicle by adding important rental details.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button className="vehicle-button" onClick={goNext}>
          Start Setup
        </button>
      </div>
    </div>
  );
}
