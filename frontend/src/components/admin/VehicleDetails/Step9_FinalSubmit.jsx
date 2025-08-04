// Step9_FinalSubmit.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';

export default function Step9_FinalSubmit({ vehicleId, formData, goBack }) {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      const {
        name,
        type,
        year,
        condition,
        fuel_type,
        power,
        description,
        price_daily,
        price_weekly,
        price_monthly,
        stock_left,
        mileage,
        available,
        pickup_locations,
        dropoff_locations,
        requirements,
        location_tags,
        dealer_contact, // full object — will extract .id below
      } = formData;

      // ✅ Only send the dealer_contact ID to avoid nested serializer error
      const payload = {
        name,
        type,
        year,
        condition,
        fuel_type,
        power,
        description,
        price_daily,
        price_weekly,
        price_monthly,
        stock_left,
        mileage,
        available,
        pickup_locations,
        dropoff_locations,
        requirements,
        location_tags,
        dealer_contact: dealer_contact?.id ?? null,
      };

      await api.patch(`/vehicles/${vehicleId}/`, payload);
      setDone(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      console.error('Final submission failed:', err);
      setSubmitting(false);
    }
  };

  return (
    <div className="vehicle-form">
      <h2 className="vehicle-heading">Finalize Setup</h2>
      <p style={{ marginBottom: '1.5rem' }}>
        All information has been added. Submit to finalize this vehicle listing.
      </p>

      {done ? (
        <p style={{ color: 'green', fontWeight: 'bold' }}>
          Vehicle details saved! Redirecting...
        </p>
      ) : (
        <div className="step-navigation">
          <button className="vehicle-button" onClick={goBack} disabled={submitting}>
            Back
          </button>
          <button className="vehicle-button" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Vehicle'}
          </button>
        </div>
      )}
    </div>
  );
}
