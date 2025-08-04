// SidebarIcons.jsx

const icons = {
  dashboard: (
    <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.6">
      <rect x="3" y="3" width="7" height="9" rx="2"/>
      <rect x="14" y="3" width="7" height="5" rx="2"/>
      <rect x="14" y="12" width="7" height="9" rx="2"/>
      <rect x="3" y="17" width="7" height="4" rx="2"/>
    </svg>
  ),
  add: (
    <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 8v8M8 12h8"/>
    </svg>
  ),
  import: (
    <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.7">
      <path d="M12 5v12"/>
      <path d="M5 12l7 7 7-7"/>
    </svg>
  ),
  profile: (
    <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.7">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 20c0-4 8-6 8-6s8 2 8 6"/>
    </svg>
  ),
  data: (
    <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.6">
      <rect x="3" y="9" width="4" height="12" rx="2"/>
      <rect x="9" y="3" width="4" height="18" rx="2"/>
      <rect x="15" y="13" width="4" height="8" rx="2"/>
    </svg>
  ),
  logout: (
    <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2">
      <path d="M16 17l5-5-5-5"/>
      <path d="M21 12H9"/>
      <path d="M4 4v16"/>
    </svg>
  ),
  edit: (
    <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2">
      <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19.5l-4 1 1-4L16.5 3.5z"/>
    </svg>
  ),
  delete: (
    <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2">
      <rect x="5" y="7" width="14" height="12" rx="2"/>
      <path d="M9 7V5a3 3 0 016 0v2"/>
      <path d="M10 12v4"/>
      <path d="M14 12v4"/>
    </svg>
  ),
  price: (
    <svg width="22" height="22" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.8">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 7v10"/>
      <path d="M9 10h6"/>
      <path d="M9 14h6"/>
    </svg>
  ),
  available: (
    <svg width="22" height="22" viewBox="0 0 24 24" stroke="#20c997" fill="none" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <path d="M8 13l3 3 5-5"/>
    </svg>
  ),
  unavailable: (
    <svg width="22" height="22" viewBox="0 0 24 24" stroke="#e64980" fill="none" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <path d="M8 8l8 8M16 8l-8 8"/>
    </svg>
  ),
  helmet: (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 12a10 10 0 0120 0H2z"/>
    <path d="M12 2v10"/>
  </svg>
    ),
    license: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="4" width="16" height="16" rx="2"/>
        <path d="M4 9h16M10 13h6M10 17h6"/>
    </svg>
    ),
    fuel: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="13" height="18" rx="2"/>
        <path d="M16 7l3 3v6a2 2 0 01-2 2h-1"/>
    </svg>
    ),
    insurance: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6z"/>
        <path d="M12 8v4l3 3"/>
    </svg>
    ),
    rules: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="4" width="16" height="16" rx="2"/>
        <path d="M8 9h8M8 13h6"/>
    </svg>
    ),
    rc: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16v16H4z"/>
        <path d="M8 4v16"/>
    </svg>
    ),
    city: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
        <circle cx="12" cy="9" r="2.5" />
    </svg>
    ),
    condition: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 12l2 2 4-4" />
      <circle cx="12" cy="12" r="10" />
    </svg> // check-circle icon for good condition
    ),

    power: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="13 2 13 13 20 13" />
        <path d="M6 20h12" />
      </svg> // lightning bolt shape for power
    ),

    mileage: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l3 3" />
      </svg> // odometer-style speed dial
    ),
    type: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 13l2-2h14l2 2" />
        <rect x="5" y="13" width="14" height="6" rx="2" />
        <circle cx="7.5" cy="17.5" r="1.5" />
        <circle cx="16.5" cy="17.5" r="1.5" />
      </svg> // modern minimal car outline
    ),
    year: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg> // modern calendar icon
    )
};
export default icons;
