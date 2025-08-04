// Step6_ReviewOverview.jsx — Cleaned for Location Tag Compatibility
import React from 'react';

export default function Step6_ReviewOverview({ formData, goNext, goBack }) {
  const {
    name,
    type,
    fuel_type,
    condition,
    year,
    power,
    mileage,
    price_daily,
    price_weekly,
    price_monthly,
    stock_left,
    available,
    description,
    pickup_locations_details = [],
    dropoff_locations_details = [],
    dealer_contact,
    requirements = [],
    location_tags = []
  } = formData;

  return (
    <div className="vehicle-form">
      <h2 className="vehicle-heading">Review Overview</h2>

      <h4>Vehicle Info</h4>
      <ul>
        <li>Name: {name}</li>
        <li>Type: {type}</li>
        <li>Condition: {condition}</li>
        <li>Fuel Type: {fuel_type}</li>
        <li>Year: {year}</li>
        <li>Power: {power}</li>
        <li>Mileage: {mileage}</li>
        <li>Price (Daily/Weekly/Monthly): ₹{price_daily} / ₹{price_weekly} / ₹{price_monthly}</li>
        <li>Stock Left: {stock_left}</li>
        <li>Available: {available ? 'Yes' : 'No'}</li>
        <li>Description: {description}</li>
      </ul>

      <h4>Pickup Locations</h4>
      <ul>
        {pickup_locations_details.map((loc, idx) => (
          <li key={idx}>{loc.location_name}, {loc.city}, {loc.district}, {loc.state}</li>
        ))}
      </ul>

      <h4>Dropoff Locations</h4>
      <ul>
        {dropoff_locations_details.map((loc, idx) => (
          <li key={idx}>{loc.location_name}, {loc.city}, {loc.district}, {loc.state}</li>
        ))}
      </ul>

      <h4>Dealer Contact</h4>
      {dealer_contact ? (
        <ul>
          <li>Name: {dealer_contact.name}</li>
          <li>Phone: {dealer_contact.phone}</li>
          <li>Email: {dealer_contact.email}</li>
        </ul>
      ) : (
        <p>No dealer contact provided.</p>
      )}

      <h4>Rental Requirements</h4>
      <ul>
        {requirements.map((req, idx) => (
          <li key={idx}>{req.icon}: {req.text}</li>
        ))}
      </ul>

      <h4>Location Tags</h4>
      <ul>
        {location_tags.map((tag, idx) => (
          <li key={idx}>{tag}</li>
        ))}
      </ul>

      <div className="step-navigation">
        <button className="vehicle-button" onClick={goBack}>Back</button>
        <button className="vehicle-button" onClick={goNext}>Submit</button>
      </div>
    </div>
  );
}
