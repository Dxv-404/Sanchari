// src/pages/users/UserVehicleDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../services/api";
import icons from "../../../components/admin/AddProduct/SidebarIcons"; // reusing your icon set
import "../../admin/Dashboard.css"; // reusing existing styles (product-card, detail-grid, etc.)


// Sidebar items for the USER view (feel free to tweak destinations)
const sidebarItems = [
  { key: "home", label: "Home", icon: icons.dashboard, link: "/user" },
  { key: "wishlist", label: "Wishlist", icon: icons.heart, link: "/user/wishlist" },
  { key: "bookings", label: "My Bookings", icon: icons.data, link: "/user/bookings" },
  { key: "profile", label: "Profile", icon: icons.profile, link: "/user/profile" },
  { key: "support", label: "Support", icon: icons.rules, link: "/user/support" },
];

export default function UserVehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // mimic admin quickview sidebar behaviour
  useEffect(() => {
    const resize = () => setSidebarOpen(window.innerWidth > 800);
    window.addEventListener("resize", resize);
    resize();
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/vehicles/${id}/`);
        setVehicle(res.data);
      } catch (err) {
        console.error("Failed to fetch vehicle:", err);
      }
    })();
  }, [id]);

  if (!vehicle) return <div className="admin-main">Loading...</div>;

  const DetailCard = ({ icon, label, value, wide = false }) => (
    <div className={`detail-card ${wide ? "wide" : ""}`}>
      <div className="detail-icon-top" style={{ color: "#232323" }}>{icon}</div>
      <div className="detail-value staatlich-font">{value || "-"}</div>
      <div className="detail-label staatlich-font">{label}</div>
    </div>
  );

  const goReserve = () => navigate(`/user/vehicle/${id}/reserve`);
  const goRent = () => navigate(`/user/vehicle/${id}/rent`);

  return (
    <div className="admin-root">
      {/* ====== Sidebar (same structure/UX as admin quickview) ====== */}
      <aside className={`admin-sidebar ${sidebarOpen ? "" : "collapsed"}`}>
        <div className="sidebar-menu">
          <button
            className="sidebar-item"
            style={{ border: "none", background: "none", cursor: "pointer", outline: "none" }}
            onClick={() => setSidebarOpen(v => !v)}
            aria-label="Toggle Sidebar"
            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <span className="sidebar-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" stroke="#232323" fill="none" strokeWidth="2">
                <rect x="4" y="6" width="16" height="2" rx="1" />
                <rect x="4" y="11" width="16" height="2" rx="1" />
                <rect x="4" y="16" width="16" height="2" rx="1" />
              </svg>
            </span>
            {sidebarOpen && <span className="sidebar-label">Collapse</span>}
          </button>

          {sidebarItems.map(item => (
            <a key={item.key} href={item.link} className="sidebar-item" title={item.label}>
              <span className="sidebar-icon">{item.icon}</span>
              {sidebarOpen && <span className="sidebar-label">{item.label}</span>}
            </a>
          ))}
        </div>
      </aside>

      {/* ====== Main ====== */}
      <main className="admin-main">
        <div className="admin-header">
          <div className="admin-title">SANCHARI</div>
        </div>

        <div className="card-grid" style={{ gridTemplateColumns: "1fr 1fr", alignItems: "flex-start" }}>
          {/* LEFT: preview + actions */}
          <div className="product-card" style={{ padding: "1rem" }}>
            <img className="product-img" src={vehicle.image || "/placeholder.jpg"} alt={vehicle.name} />
            <div className="product-body">
              <div className="product-title staatlich-font">{vehicle.name}</div>
              <div className="product-info">
                <span className="product-info-item">{icons.price} ₹{vehicle.price_daily}</span>
                <span className="product-info-item">{icons.city} {vehicle.city || "—"}</span>
                <span className="product-info-item">
                  {vehicle.available ? icons.available : icons.unavailable}
                  {vehicle.available ? "Available" : "Unavailable"}
                </span>
              </div>
            </div>

            <div className="step-navigation" style={{ marginTop: "2rem" }}>
              <button
                className="vehicle-button"
                onClick={goReserve}
                disabled={!vehicle.available}
                title={vehicle.available ? "Reserve this vehicle" : "Currently unavailable"}
              >
                Reserve Vehicle
              </button>
              <button
                className="vehicle-button"
                onClick={goRent}
                disabled={!vehicle.available}
                title={vehicle.available ? "Proceed to rent" : "Currently unavailable"}
              >
                Rent Vehicle
              </button>
            </div>
          </div>

          {/* RIGHT: details */}
          <div className="detail-grid-container">
            <div className="description-box">
              <div className="detail-icon-top large" style={{ color: "#232323" }}>{icons.rules}</div>
              <div className="staatlich-font description-text" style={{ color: "#232323" }}>
                {vehicle.description || "No description provided."}
              </div>
            </div>

            <div className="detail-card-grid">
              <DetailCard icon={icons.type} label="Type" value={vehicle.type} />
              <DetailCard icon={icons.condition} label="Condition" value={vehicle.condition} />
              <DetailCard icon={icons.year} label="Year" value={vehicle.year} />
              <DetailCard icon={icons.power} label="Power" value={vehicle.power} />
              <DetailCard icon={icons.fuel} label="Fuel" value={vehicle.fuel_type} />
              <DetailCard icon={icons.mileage} label="Mileage" value={vehicle.mileage} />
            </div>

            <div className="detail-card-grid">
              <DetailCard
                icon={icons.city}
                label="Pickup Locations"
                value={vehicle.pickup_locations_full?.map(loc => `${loc.location_name}, ${loc.city}`).join(" | ") || "—"}
              />
              <DetailCard
                icon={icons.city}
                label="Dropoff Locations"
                value={vehicle.dropoff_locations_full?.map(loc => `${loc.location_name}, ${loc.city}`).join(" | ") || "—"}
              />
            </div>

            {vehicle.requirements_full?.length > 0 && (
              <div className="requirement-box">
                <div className="requirement-header staatlich-font">Requirements</div>
                <div className="requirement-list">
                  {vehicle.requirements_full.map((req, i) => (
                    <div key={i} className="requirement-item">
                      <div className="requirement-icon">{icons[req.icon] || icons.rules}</div>
                      <div className="requirement-text">{req.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
