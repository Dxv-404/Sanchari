// Step2_PickupLocations.jsx — Final Cleaned Version with PATCH + Preview Fixes
import React, { useEffect, useState } from 'react';
import api from '../../../services/api';

export default function Step2_PickupLocations({ vehicleId, formData, updateFormData, goNext, goBack }) {
  const [locations, setLocations] = useState([]);
  const [selectedIds, setSelectedIds] = useState(formData.pickup_locations || []);
  const [newLocation, setNewLocation] = useState({ location_name: '', city: '', district: '', state: '' });

  useEffect(() => {
    api.get('/locations/').then((res) => setLocations(res.data));
  }, []);

  const normalize = (str) => str.trim().toLowerCase();

  const handleAddLocation = async () => {
    const { location_name, city, district, state } = newLocation;
    if (!location_name || !city || !district || !state) {
      alert('Please fill all fields');
      return;
    }
    const exists = locations.find(
      (l) =>
        normalize(l.location_name) === normalize(location_name) &&
        normalize(l.city) === normalize(city) &&
        normalize(l.district) === normalize(district) &&
        normalize(l.state) === normalize(state)
    );
    if (exists) {
      alert('This location already exists. Please select it from the dropdown.');
      return;
    }
    try {
      const res = await api.post('/locations/', newLocation);
      setLocations([...locations, res.data]);
      setSelectedIds([...selectedIds, res.data.id]);
      setNewLocation({ location_name: '', city: '', district: '', state: '' });
    } catch (err) {
      console.error(err);
      alert('Failed to add location');
    }
  };

  const handleSelect = (e) => {
    const options = Array.from(e.target.selectedOptions);
    const ids = options.map((opt) => parseInt(opt.value));
    setSelectedIds(ids);
  };

  const handleNext = async () => {
    const selectedDetails = locations.filter(loc => selectedIds.includes(loc.id));
    updateFormData({
      pickup_locations: selectedIds,
      pickup_locations_details: selectedDetails
    });
    try {
      await api.patch(`/vehicles/${vehicleId}/`, { pickup_locations: selectedIds });
    } catch (err) {
      console.error('Autosave failed:', err.response?.data || err.message);
    }
    goNext();
  };

  return (
    <div className="vehicle-form">
      <h2 className="vehicle-heading">Pickup Locations</h2>

      <label>Select Existing Locations</label>
      <select multiple value={selectedIds} onChange={handleSelect}>
        {locations.map((loc) => (
          <option key={loc.id} value={loc.id}>
            {loc.location_name}, {loc.city}, {loc.state}
          </option>
        ))}
      </select>

      <h4 style={{ marginTop: '2rem' }}>Add New Location</h4>
      <div className="form-group">
        <input
          placeholder="Location Name"
          value={newLocation.location_name}
          onChange={(e) => setNewLocation({ ...newLocation, location_name: e.target.value })}
        />
        <input
          placeholder="City"
          value={newLocation.city}
          onChange={(e) => setNewLocation({ ...newLocation, city: e.target.value })}
        />
        <input
          placeholder="District"
          value={newLocation.district}
          onChange={(e) => setNewLocation({ ...newLocation, district: e.target.value })}
        />
        <input
          placeholder="State"
          value={newLocation.state}
          onChange={(e) => setNewLocation({ ...newLocation, state: e.target.value })}
        />
        <button className="vehicle-button" onClick={handleAddLocation}>
          Add Location
        </button>
      </div>

      <div className="step-navigation">
        <button className="vehicle-button" onClick={goBack}>Back</button>
        <button className="vehicle-button" onClick={handleNext}>Next</button>
      </div>
    </div>
  );
}
