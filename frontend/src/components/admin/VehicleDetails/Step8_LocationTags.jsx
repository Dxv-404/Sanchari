// Step8_LocationTags.jsx
import React, { useState } from 'react';
import api from '../../../services/api';

export default function Step8_LocationTags({ vehicleId, formData, updateFormData, goNext, goBack }) {
  const [tagsInput, setTagsInput] = useState((formData.location_tags || []).join(', '));

  const handleNext = async () => {
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    updateFormData({ location_tags: tags });
    try {
      await api.patch(`/vehicles/${vehicleId}/`, { location_tags: tags });
    } catch (err) {
      console.error('Autosave failed:', err);
    }
    goNext();
  };

  return (
    <div className="vehicle-form">
      <h2 className="vehicle-heading">Location Tags</h2>
      <p style={{ marginBottom: '1rem' }}>
        Add relevant city or area tags to help users find this vehicle more easily.
      </p>

      <div className="form-group">
        <label>Tags (comma-separated)</label>
        <input
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="e.g., Kochi, Marine Drive, Vytilla"
        />
      </div>

      <div className="step-navigation">
        <button className="vehicle-button" onClick={goBack}>Back</button>
        <button className="vehicle-button" onClick={handleNext}>Next</button>
      </div>
    </div>
  );
}
