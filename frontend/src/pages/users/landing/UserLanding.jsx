import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchVehicles,
  fetchVehicleMeta,
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../../../services/api";
import icons from "../../../components/admin/AddProduct/SidebarIcons";
import "../../admin/Dashboard.css";
import Toast from "../../../components/admin/AddProduct/Toast"; // uses your Toast.jsx

const SIDEBAR_ITEMS = [
  { key: "profile", label: "Profile", icon: icons.profile, href: "/user/profile" },
  { key: "products", label: "Products", icon: icons.products, href: "/user" },
  { key: "history", label: "History", icon: icons.history, href: "/user/history" },
  { key: "orders", label: "Orders", icon: icons.orders, href: "/user/orders" },
];

export default function UserLanding() {
  const navigate = useNavigate();

  const [showFilters, setShowFilters] = useState(false);
  const [meta, setMeta] = useState(null);

  const [q, setQ] = useState("");
  const [types, setTypes] = useState([]);
  const [fuels, setFuels] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [cities, setCities] = useState([]);
  const [price, setPrice] = useState([0, 0]);
  const [mileage, setMileage] = useState([0, 0]);
  const [availableOnly, setAvailableOnly] = useState(true);
  const [ordering, setOrdering] = useState("-id");

  // NEW: Date filter
  const [useDates, setUseDates] = useState(false);
  const [startDate, setStartDate] = useState(""); // YYYY-MM-DD
  const [endDate, setEndDate] = useState("");     // YYYY-MM-DD

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [wishlist, setWishlist] = useState([]);
  const [toast, setToast] = useState(null); // {message, type}
  const [popping, setPopping] = useState({}); // { [vehicleId]: true } to trigger pop animation

  const fetchWishlistData = useCallback(async () => {
    try {
      const { data } = await fetchWishlist();
      setWishlist(data);
    } catch (err) {
      console.error("Failed to load wishlist", err);
    }
  }, []);

  const isInWishlist = (vehicleId) => wishlist.some((w) => w.vehicle.id === vehicleId);

  const toggleWishlist = async (vehicleId) => {
    // Start pop animation
    setPopping((prev) => ({ ...prev, [vehicleId]: true }));
    setTimeout(() => {
      setPopping((prev) => {
        const { [vehicleId]: _, ...rest } = prev;
        return rest;
      });
    }, 320);

    // Optimistic toggle
    const existed = isInWishlist(vehicleId);
    try {
      if (existed) {
        const entry = wishlist.find((w) => w.vehicle.id === vehicleId);
        // optimistic remove
        setWishlist((prev) => prev.filter((w) => w.id !== entry.id));
        await removeFromWishlist(entry.id);
        setToast({ message: "Product removed from wishlist", type: "success" });
      } else {
        // optimistic add (fake id until refresh)
        const fake = { id: `temp-${vehicleId}`, vehicle: { id: vehicleId } };
        setWishlist((prev) => [...prev, fake]);
        await addToWishlist(vehicleId);
        await fetchWishlistData(); // ensure real server id in list
        setToast({ message: "Product added to wishlist", type: "success" });
      }
    } catch (e) {
      // revert if failed
      await fetchWishlistData();
      setToast({ message: "Action failed. Please try again.", type: "error" });
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await fetchVehicleMeta();
        setMeta(data);
        setPrice([Math.floor(data.min_price || 0), Math.ceil(data.max_price || 0)]);
        setMileage([Math.floor(data.min_mileage || 0), Math.ceil(data.max_mileage || 0)]);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  // NEW: simple date validation feedback
  useEffect(() => {
    if (!useDates) return;
    if (startDate && endDate) {
      const s = new Date(startDate);
      const e = new Date(endDate);
      if (e < s) {
        setToast({ message: "End date cannot be before start date.", type: "error" });
      }
    }
  }, [useDates, startDate, endDate]);

  const buildParams = useCallback(() => {
    const params = {
      q: q || undefined,
      types: types.join(",") || undefined,
      fuels: fuels.join(",") || undefined,
      conditions: conditions.join(",") || undefined,
      cities: cities.join(",") || undefined,
      price_min: price?.[0],
      price_max: price?.[1],
      mileage_min: mileage?.[0],
      mileage_max: mileage?.[1],
      available: availableOnly ? "true" : undefined,
      ordering,
    };
    // NEW: date params only when enabled and both set
    if (useDates && startDate && endDate) {
      params.start_date = startDate;
      params.end_date = endDate;
    }
    return params;
  }, [
    q,
    types,
    fuels,
    conditions,
    cities,
    price,
    mileage,
    availableOnly,
    ordering,
    useDates,
    startDate,
    endDate,
  ]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = buildParams();
      const { data } = await fetchVehicles(params);
      setVehicles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [buildParams]);

  // Initial & filter change fetch
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchWishlistData();
  }, [fetchWishlistData]);

  const toggleMulti = (value, setter) => {
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const renderChip = (value, active, onClick, index) => (
    <button
      key={value + index}
      className={`user-chip ${active ? `active c${(index % 5) + 1}` : ""}`}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      title={value}
    >
      {value}
    </button>
  );

  const citySuggestions = useMemo(() => {
    if (!meta?.cities) return [];
    return Array.from(new Set(meta.cities));
  }, [meta]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="admin-root user-root">
      <aside
        className={`admin-sidebar user-sidebar ${showFilters ? "user-filters-open" : "collapsed"}`}
      >
        {!showFilters ? (
          <div className="sidebar-menu">
            {SIDEBAR_ITEMS.map((it) => (
              <a key={it.key} href={it.href} className="sidebar-item" title={it.label}>
                <span className="sidebar-icon">{it.icon}</span>
              </a>
            ))}
            <button
              className="sidebar-item"
              title="Filters"
              onClick={() => setShowFilters(true)}
            >
              <span className="sidebar-icon">{icons.filter}</span>
            </button>
          </div>
        ) : (
          <div className="user-filters-panel">
            <div className="user-filters-header">
              <span className="user-filters-title">Filters</span>
              <button className="user-filters-close" onClick={() => setShowFilters(false)}>
                ×
              </button>
            </div>

            {/* Search */}
            <div className="user-filter-block">
              <label className="user-filter-label">Search</label>
              <input
                className="user-input"
                placeholder="Search by anything..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>

            {/* Sort */}
            <div className="user-filter-block">
              <label className="user-filter-label">Sort By</label>
              <select
                className="user-input"
                value={ordering}
                onChange={(e) => setOrdering(e.target.value)}
              >
                <option value="-id">Newest</option>
                <option value="price_daily">Price: Low to High</option>
                <option value="-price_daily">Price: High to Low</option>
                <option value="name">Name: A → Z</option>
                <option value="-name">Name: Z → A</option>
                <option value="-mileage">Mileage: High to Low</option>
                <option value="mileage">Mileage: Low to High</option>
              </select>
            </div>

            {/* Price Slider */}
            <div className="user-filter-block">
              <div className="user-filter-row">
                <span className="user-filter-label">Price / day</span>
              </div>
              <div className="user-slider-wrap">
                <input
                  type="range"
                  min={meta?.min_price || 0}
                  max={meta?.max_price || 0}
                  value={price[0]}
                  onChange={(e) => setPrice([Number(e.target.value), price[1]])}
                />
                <span className="slider-value">{price[0]}</span>
              </div>
              <div className="user-slider-wrap">
                <input
                  type="range"
                  min={meta?.min_price || 0}
                  max={meta?.max_price || 0}
                  value={price[1]}
                  onChange={(e) => setPrice([price[0], Number(e.target.value)])}
                />
                <span className="slider-value">{price[1]}</span>
              </div>
            </div>

            {/* Mileage Slider */}
            <div className="user-filter-block">
              <div className="user-filter-row">
                <span className="user-filter-label">Mileage</span>
              </div>
              <div className="user-slider-wrap">
                <input
                  type="range"
                  min={meta?.min_mileage || 0}
                  max={meta?.max_mileage || 0}
                  value={mileage[0]}
                  onChange={(e) => setMileage([Number(e.target.value), mileage[1]])}
                />
                <span className="slider-value">{mileage[0]}</span>
              </div>
              <div className="user-slider-wrap">
                <input
                  type="range"
                  min={meta?.min_mileage || 0}
                  max={meta?.max_mileage || 0}
                  value={mileage[1]}
                  onChange={(e) => setMileage([mileage[0], Number(e.target.value)])}
                />
                <span className="slider-value">{mileage[1]}</span>
              </div>
            </div>

            {/* Dates */}
            <div className="user-filter-block">
              <div className="user-filter-row" style={{ alignItems: "center", gap: 12 }}>
                <label className="user-filter-label" style={{ marginBottom: 0 }}>
                  Dates
                </label>
                <label className="user-switch">
                  <input
                    type="checkbox"
                    checked={useDates}
                    onChange={() => setUseDates((v) => !v)}
                  />
                  <span>Filter by date</span>
                </label>
              </div>

              <div className="user-date-row">
                <div className="user-date-field">
                  <span className="user-date-label">Start</span>
                  <input
                    type="date"
                    className="user-input"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    disabled={!useDates}
                  />
                </div>
                <div className="user-date-field">
                  <span className="user-date-label">End</span>
                  <input
                    type="date"
                    className="user-input"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    disabled={!useDates}
                  />
                </div>
              </div>
            </div>

            {/* Chips */}
            <div className="user-filter-block">
              <label className="user-filter-label">Type</label>
              <div className="user-chip-row">
                {meta?.types?.map((t, i) =>
                  renderChip(t, types.includes(t), () => toggleMulti(t, setTypes), i)
                )}
              </div>
            </div>
            <div className="user-filter-block">
              <label className="user-filter-label">Fuel</label>
              <div className="user-chip-row">
                {meta?.fuels?.map((f, i) =>
                  renderChip(f, fuels.includes(f), () => toggleMulti(f, setFuels), i)
                )}
              </div>
            </div>
            <div className="user-filter-block">
              <label className="user-filter-label">Condition</label>
              <div className="user-chip-row">
                {meta?.conditions?.map((c, i) =>
                  renderChip(c, conditions.includes(c), () => toggleMulti(c, setConditions), i)
                )}
              </div>
            </div>

            {/* City chips */}
            <div className="user-filter-block">
              <label className="user-filter-label">Cities</label>
              <div className="user-chip-row wrap">
                {citySuggestions.map((c, i) =>
                  renderChip(c, cities.includes(c), () => toggleMulti(c, setCities), i)
                )}
              </div>
            </div>

            {/* Availability */}
            <div className="user-filter-block">
              <label className="user-switch">
                <input
                  type="checkbox"
                  checked={availableOnly}
                  onChange={() => setAvailableOnly((v) => !v)}
                />
                <span>Show available only</span>
              </label>
            </div>
          </div>
        )}
      </aside>

      <main className="admin-main">
        <div className="admin-header">
          <div className="admin-title">SANCHARI</div>

          {/* NEW: Always-visible sorter for a luxe, handy UX */}
          <div className="admin-header-right" style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <label className="inline-label" style={{ fontSize: 12, opacity: 0.8 }}>Sort</label>
            <select
              className="user-input compact"
              value={ordering}
              onChange={(e) => setOrdering(e.target.value)}
              title="Sort vehicles"
            >
              <option value="-id">Newest</option>
              <option value="price_daily">Price: Low to High</option>
              <option value="-price_daily">Price: High to Low</option>
              <option value="name">Name: A → Z</option>
              <option value="-name">Name: Z → A</option>
              <option value="-mileage">Mileage: High to Low</option>
              <option value="mileage">Mileage: Low to High</option>
            </select>
          </div>

          <div className="admin-logout" onClick={handleLogout}>
            {icons.logout}
            <span className="admin-logout-label">Log out</span>
          </div>
        </div>

        <div className="card-grid">
          {loading && <div style={{ padding: 24, opacity: 0.6 }}>Loading…</div>}
          {!loading && vehicles.length === 0 && (
            <div style={{ padding: 24, opacity: 0.6 }}>No results</div>
          )}
          {vehicles.map((v) => {
            const active = isInWishlist(v.id);
            const pop = !!popping[v.id];
            return (
              <div
                key={v.id}
                className="product-card"
                onClick={() => navigate(`/user/vehicle/${v.id}`)}
              >
                <img
                  className="product-img"
                  src={v.image || "/placeholder.jpg"}
                  alt={v.name}
                />
                <div className="product-body">
                  <div className="product-title">{v.name}</div>
                  <div className="product-info">
                    <span className="product-info-item">
                      {icons.price} ₹{v.price_daily}
                    </span>
                    <span className="product-info-item">
                      {v.available ? icons.available : icons.unavailable}
                      {v.available ? "Available" : "Unavailable"}
                    </span>
                  </div>
                </div>
                <div className="product-actions">
                  <button
                    className={`action-btn user-heart ${active ? "active" : ""} ${pop ? "pop" : ""}`}
                    aria-pressed={active}
                    aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
                    title={active ? "Remove from wishlist" : "Add to wishlist"}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(v.id);
                    }}
                  >
                    {icons.heart}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999 }}>
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        </div>
      )}
    </div>
  );
}
