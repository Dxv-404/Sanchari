// Step4_DealerContact.jsx
import React, { useState, useEffect } from 'react';
import api from '../../../services/api';

export default function Step4_DealerContact({ vehicleId, formData, updateFormData, goNext, goBack }) {
  const [dealers, setDealers] = useState([]);
  const [dealer, setDealer] = useState(formData.dealer_contact || { name: '', phone: '' });

  useEffect(() => {
    fetchDealers();
  }, []);

  const fetchDealers = async () => {
    try {
      const res = await api.get('/dealer-contacts/');
      setDealers(res.data);
    } catch (err) {
      console.error('Failed to fetch dealers:', err);
    }
  };

  const handleSelect = (dealerObj) => {
    setDealer(dealerObj);
  };

  const handleNext = async () => {
    updateFormData({ dealer_contact: dealer });
    try {
      await api.patch(`/vehicles/${vehicleId}/`, { dealer_contact: dealer.id });
    } catch (err) {
      console.error('Autosave failed:', err);
    }
    goNext();
  };

  return (
    <div className="vehicle-form">
      <h2 className="vehicle-heading">Dealer Contact</h2>

      <div className="form-group">
        <label>Name</label>
        <input value={dealer.name} onChange={(e) => setDealer({ ...dealer, name: e.target.value })} />
      </div>
      <div className="form-group">
        <label>Phone</label>
        <input value={dealer.phone} onChange={(e) => setDealer({ ...dealer, phone: e.target.value })} />
      </div>

      <h4 style={{ marginTop: '2rem' }}>Select Existing Dealer</h4>
      <div>
        {dealers.map((d) => (
          <label key={d.id} style={{ display: 'block', marginBottom: '0.5rem', cursor: 'pointer' }}>
            <input
              type="radio"
              checked={dealer.phone === d.phone}
              onChange={() => handleSelect(d)}
            />{' '}
            {d.name} — {d.phone}
          </label>
        ))}
      </div>

      <div className="step-navigation">
        <button className="vehicle-button" onClick={goBack}>Back</button>
        <button className="vehicle-button" onClick={handleNext}>Next</button>
      </div>
    </div>
  );
}
