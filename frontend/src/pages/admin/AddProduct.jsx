// Fully cleaned AddProduct.jsx
// Removes city, district, state from state, validation, and JSX — while preserving working logic

import React, { useEffect, useState, useRef } from "react";
import ProductCardPreview from "../../components/admin/AddProduct/ProductCardPreview";
import ImageUploader from "../../components/admin/AddProduct/ImageUploader";
import Toast from "../../components/admin/AddProduct/Toast";
import ExitWarningPopup from "../../components/admin/AddProduct/ExitWarningPopup";
import icons from "../../components/admin/AddProduct/SidebarIcons";
import { useNavigate } from "react-router-dom";
import "./AddProduct.css";
import api from "../../services/api";

const sidebarItems = [
  { key: "dashboard", label: "Dashboard", icon: icons.dashboard, link: "/dashboard" },
  { key: "add", label: "Add Product", icon: icons.add, link: "/dashboard/add" },
  { key: "import", label: "Import", icon: icons.import, link: "/dashboard/import" },
  { key: "profile", label: "Profile", icon: icons.profile, link: "/dashboard/profile" },
  { key: "data", label: "Data", icon: icons.data, link: "/dashboard/data" },
];

export default function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    type: "car",
    year: "",
    condition: "new",
    fuel_type: "petrol",
    power: "",
    description: "",
    price_daily: "",
    price_weekly: "",
    price_monthly: "",
    stock_left: 1,
    mileage: "",
    available: true
  });

  const [image, setImage] = useState(null);
  const [showToast, setShowToast] = useState(null);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const isDirty = useRef(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const beforeUnload = (e) => {
      if (isDirty.current) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes.";
      }
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, []);

  useEffect(() => {
    const resize = () => setSidebarOpen(window.innerWidth > 800);
    window.addEventListener("resize", resize);
    resize();
    return () => window.removeEventListener("resize", resize);
  }, []);

  const handleChange = (e) => {
    isDirty.current = true;
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    const updated = { ...form, [name]: val };
    if (name === "price_daily") {
      const daily = parseFloat(val);
      if (!isNaN(daily)) {
        updated.price_weekly = (daily * 7 * 0.9).toFixed(2);
        updated.price_monthly = (daily * 30 * 0.8).toFixed(2);
      }
    }
    setForm(updated);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = ["name", "type", "year", "condition", "fuel_type", "power", "price_daily", "stock_left", "mileage"];
    const missing = requiredFields.some((field) => !form[field]);
    if (missing || !image) {
      setShowToast({ msg: "Please fill all required fields.", type: "error" });
      return;
    }

    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    data.append("image", image);

    try {
      const token = localStorage.getItem("access_token");
      const res = await api.post("/vehicles/", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setShowToast({ msg: "Product added successfully!", type: "success" });
      isDirty.current = false;
      setTimeout(() => navigate(`/dashboard/vehicle/${res.data.id}/details`), 1500);
    } catch {
      setShowToast({ msg: "Failed to add product.", type: "error" });
    }
  };

  return (
    <div className="admin-root">
      <aside className={`admin-sidebar ${sidebarOpen ? "" : "collapsed"}`}>
        <div className="sidebar-menu">
          <button
            className="sidebar-item"
            style={{ border: "none", background: "none", cursor: "pointer", outline: "none" }}
            onClick={() => setSidebarOpen((v) => !v)}
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
          {sidebarItems.map((item) => (
            <div
              key={item.key}
              className={`sidebar-item ${item.key === "add" ? "active" : ""}`}
              onClick={() => navigate(item.link)}
              title={item.label}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {sidebarOpen && <span className="sidebar-label">{item.label}</span>}
            </div>
          ))}
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-header">
          <div className="admin-title">SANCHARI</div>
          <div
            className="admin-logout"
            tabIndex={0}
            onClick={handleLogout}
            onMouseEnter={(e) => e.currentTarget.classList.add("expand")}
            onMouseLeave={(e) => e.currentTarget.classList.remove("expand")}
          >
            {icons.logout}
            <span className="admin-logout-label">Log out</span>
          </div>
        </div>

        <div className="add-product-container">
          <div className="add-preview">
            <ProductCardPreview form={form} image={image} />
          </div>
          <form className="add-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Vehicle Name</label>
              <input name="name" value={form.name} onChange={handleChange} required />
            </div>
            <ImageUploader image={image} setImage={setImage} />
            <div className="form-group">
              <label>Vehicle Type</label>
              <select name="type" value={form.type} onChange={handleChange} required>
                <option value="car">Car</option>
                <option value="bike">Bike</option>
                <option value="scooter">Scooter</option>
              </select>
            </div>
            <div className="form-group">
              <label>Condition</label>
              <select name="condition" value={form.condition} onChange={handleChange} required>
                <option value="new">New</option>
                <option value="used">Used</option>
              </select>
            </div>
            <div className="form-group">
              <label>Fuel Type</label>
              <select name="fuel_type" value={form.fuel_type} onChange={handleChange} required>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
              </select>
            </div>
            <div className="form-group">
              <label>Year</label>
              <input name="year" type="number" value={form.year} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Power</label>
              <input name="power" value={form.power} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Daily Price</label>
              <input name="price_daily" type="number" value={form.price_daily} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Weekly Price</label>
              <input name="price_weekly" type="number" value={form.price_weekly} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Monthly Price</label>
              <input name="price_monthly" type="number" value={form.price_monthly} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Stock Left</label>
              <input name="stock_left" type="number" value={form.stock_left} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Mileage</label>
              <input name="mileage" type="number" value={form.mileage} onChange={handleChange} required />
            </div>
            <div className="form-group toggle">
              <label>Available</label>
              <input name="available" type="checkbox" checked={form.available} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
            </div>
            <button className="submit-btn" type="submit">Add Product</button>
          </form>
        </div>
      </main>

      {showToast && (
        <Toast
          message={showToast.msg}
          type={showToast.type}
          onClose={() => setShowToast(null)}
        />
      )}

      {showExitWarning && (
        <ExitWarningPopup
          onConfirm={() => navigate("/dashboard")}
          onCancel={() => setShowExitWarning(false)}
        />
      )}
    </div>
  );
}
