// CountryCodeDropdown.jsx
import React from "react";
import "./Onboarding.css";

const COUNTRY_CODES = [
  { code: "+91", label: "🇮🇳 +91" },
  { code: "+1", label: "🇺🇸 +1" },
  { code: "+44", label: "🇬🇧 +44" },
  { code: "+61", label: "🇦🇺 +61" },
];

export default function CountryCodeDropdown({ value, onChange }) {
  return (
    <select
      className="country-code-dropdown"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {COUNTRY_CODES.map((item) => (
        <option key={item.code} value={item.code}>
          {item.label}
        </option>
      ))}
    </select>
  );
} 