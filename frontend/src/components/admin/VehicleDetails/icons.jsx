// icons.js — Inline SVG icon components
import React from 'react';

export const HelmetIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 0118 0H3z" />
    <path d="M12 12v9" />
  </svg>
);

export const LicenseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M7 8h10M7 12h4" />
  </svg>
);

export const IdCardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <circle cx="9" cy="12" r="2" />
    <path d="M15 10h2M15 14h2" />
  </svg>
);

export const DepositIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v12M8 12h8" />
  </svg>
);

export const Age21Icon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <text x="8" y="16" fontSize="8" fill="black">21+</text>
  </svg>
);

export const NOCIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <path d="M8 8h8M8 12h6M8 16h4" />
  </svg>
);

export const ICON_OPTIONS = [
  { key: 'helmet', label: 'Helmet', icon: <HelmetIcon /> },
  { key: 'license', label: 'License', icon: <LicenseIcon /> },
  { key: 'id_card', label: 'ID Card', icon: <IdCardIcon /> },
  { key: 'deposit', label: 'Deposit', icon: <DepositIcon /> },
  { key: 'age_21', label: '21+', icon: <Age21Icon /> },
  { key: 'noc', label: 'NOC', icon: <NOCIcon /> },
];
