import React from "react";

const icons = {
  image: (
    <svg width="20" height="20" stroke="currentColor" fill="none" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="3"/>
      <circle cx="8" cy="8" r="2"/>
      <path d="M21 21l-7-7-4 4-5-5"/>
    </svg>
  ),
  price: (
    <svg width="20" height="20" stroke="currentColor" fill="none" strokeWidth="1.8" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 7v10"/>
      <path d="M9 10h6"/>
      <path d="M9 14h6"/>
    </svg>
  ),
  desc: (
    <svg width="20" height="20" stroke="currentColor" fill="none" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="4" y="4" width="16" height="16" rx="2"/>
      <path d="M8 8h8M8 12h6M8 16h4"/>
    </svg>
  ),
  location: (
    <svg width="20" height="20" stroke="currentColor" fill="none" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M12 21C12 21 5 13.5 5 9A7 7 0 1 1 19 9c0 4.5-7 12-7 12z"/>
      <circle cx="12" cy="9" r="2.5"/>
    </svg>
  ),
  type: (
    <svg width="20" height="20" stroke="currentColor" fill="none" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="5" y="5" width="14" height="14" rx="3"/>
      <path d="M9 9h6v6H9z"/>
    </svg>
  ),
  year: (
    <svg width="20" height="20" stroke="currentColor" fill="none" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="4" y="5" width="16" height="16" rx="2"/>
      <path d="M8 3v4"/>
      <path d="M16 3v4"/>
    </svg>
  ),
  condition: (
    <svg width="20" height="20" stroke="currentColor" fill="none" strokeWidth="1.8" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 16v-4"/>
      <circle cx="12" cy="8" r="1"/>
    </svg>
  ),
  fuel: (
    <svg width="20" height="20" stroke="currentColor" fill="none" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="7" y="2" width="10" height="20" rx="5"/>
      <path d="M7 8h10"/>
    </svg>
  ),
  power: (
    <svg width="20" height="20" stroke="currentColor" fill="none" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M13 2L3 14h9l-1 8L21 10h-8z"/>
    </svg>
  ),
  category: (
    <svg width="20" height="20" stroke="currentColor" fill="none" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="3" y="7" width="7" height="7" rx="1.5"/>
      <rect x="14" y="7" width="7" height="7" rx="1.5"/>
    </svg>
  ),
  city: (
    <svg width="20" height="20" stroke="currentColor" fill="none" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="3" y="7" width="18" height="10" rx="2"/>
      <path d="M7 7v10M17 7v10"/>
    </svg>
  ),
  mileage: (
    <svg width="20" height="20" stroke="currentColor" fill="none" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M4 12a8 8 0 1 1 16 0"/>
      <path d="M12 8v4l2.5 2.5"/>
    </svg>
  ),
  stock: (
    <svg width="20" height="20" stroke="currentColor" fill="none" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="3"/>
      <path d="M7 7h10v10H7z"/>
    </svg>
  ),
  available: (
    <svg width="20" height="20" stroke="#24c26b" fill="none" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/>
      <path d="M8 13l3 3 5-5"/>
    </svg>
  ),
  unavailable: (
    <svg width="20" height="20" stroke="#d12e43" fill="none" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/>
      <path d="M8 8l8 8M16 8l-8 8"/>
    </svg>
  ),
};

export default function Icon({ name }) {
  return icons[name] || null;
}
