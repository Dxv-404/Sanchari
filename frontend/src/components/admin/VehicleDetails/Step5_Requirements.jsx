// Step5_Requirements.jsx
import React, { useState } from 'react';
import api from '../../../services/api';
import IconDropdown from './IconDropdown';

export default function Step5_Requirements({ vehicleId, formData, updateFormData, goNext, goBack }) {
  const [requirements, setRequirements] = useState(formData.requirements || []);
  const [newReq, setNewReq] = useState({ icon: 'helmet', text: '' });

  const addRequirement = () => {
    if (!newReq.text.trim()) return;
    setRequirements([...requirements, newReq]);
    setNewReq({ icon: 'helmet', text: '' });
  };

  const removeRequirement = (index) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const handleNext = async () => {
    updateFormData({ requirements });
    try {
      await api.patch(`/vehicles/${vehicleId}/`, { requirements });
    } catch (err) {
      console.error('Autosave failed:', err);
    }
    goNext();
  };

  return (
    <div className="vehicle-form">
      <h2 className="vehicle-heading">Rental Requirements</h2>

      <div className="form-group">
        <label>Icon</label>
        <IconDropdown
          value={newReq.icon}
          onChange={(val) => setNewReq({ ...newReq, icon: val })}
        />
      </div>

      <div className="form-group">
        <label>Requirement Text</label>
        <input value={newReq.text} onChange={(e) => setNewReq({ ...newReq, text: e.target.value })} />
      </div>

      <button className="vehicle-button" onClick={addRequirement}>Add Requirement</button>

      <h4 style={{ marginTop: '2rem' }}>Current Requirements</h4>
      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        {requirements.map((req, idx) => (
          <li key={idx} style={{ marginBottom: '0.5rem' }}>
            <strong>{req.icon}</strong>: {req.text}{' '}
            <button
              onClick={() => removeRequirement(idx)}
              style={{ marginLeft: '1rem', fontSize: '0.85rem', color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="step-navigation">
        <button className="vehicle-button" onClick={goBack}>Back</button>
        <button className="vehicle-button" onClick={handleNext}>Next</button>
      </div>
    </div>
  );
}
